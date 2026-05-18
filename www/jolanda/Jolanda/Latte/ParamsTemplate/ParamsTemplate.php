<?php

namespace Jolanda\Latte\ParamsTemplate;

use Latte\Engine;

class ParamsTemplate
{
    public static $ALLOW_STATIC_ANALYSIS = true;

    public static $ALWAYS_REBUILD = false;
    public static $SAVE_TO_FILE = true;
    public static $ADD_MAKRO_TO_TEMPLATE = true;
    public static $ALLOW = false;
    public static $BACKTRACE_LVL = null;

    public static $EXTEND_CLASS = null;

    public Engine $engine;
    public function __construct(Engine $engine)
    {
        $this->engine = $engine;
    }

    public function generateCode($name, $params){
        $template = $this->engine->createTemplate($name, $this->processParams($params));
        $template->global->coreCaptured = false;

        $blueprint = new Blueprint($template, self::$EXTEND_CLASS, $params);

        $props = $blueprint->parseCurrentFile(true);

        foreach ($props as $prop => $types){
            \Jolanda\Tracy\Extensions\TypehintPanel::getInstance()->addParam('', $prop, $types);
        }

        $rebuildType = \Zend_Controller_Front::getInstance()?->getRequest()?->getParam('__rebuildTypehintTemplate');

        if(is_null($rebuildType)){
            return;
        }

        if($rebuildType == '0') {
            self::$ALWAYS_REBUILD = false;
        }else{
            self::$ALWAYS_REBUILD = true;
        }


        if(!self::$ALLOW){
            return null;
        }

        $code = $blueprint->getCode();
        return $code;
    }

    private function processParams(array|object $params)
    {
        if (is_array($params)) {
            return $params;
        }

        $methods = (new \ReflectionClass($params))->getMethods(\ReflectionMethod::IS_PUBLIC);
        foreach ($methods as $method) {
            if ($method->getAttributes(\Latte\Attributes\TemplateFilter::class)) {
                $this->engine->addFilter($method->name, [$params, $method->name]);
            }

            if ($method->getAttributes(\Latte\Attributes\TemplateFunction::class)) {
                $this->engine->addFunction($method->name, [$params, $method->name]);
            }

            if (strpos((string) $method->getDocComment(), '@filter')) {
                trigger_error('Annotation @filter is deprecated, use attribute #[Latte\Attributes\TemplateFilter]', E_USER_DEPRECATED);
                $this->engine->addFilter($method->name, [$params, $method->name]);
            }

            if (strpos((string) $method->getDocComment(), '@function')) {
                trigger_error('Annotation @function is deprecated, use attribute #[Latte\Attributes\TemplateFunction]', E_USER_DEPRECATED);
                $this->engine->addFunction($method->name, [$params, $method->name]);
            }
        }

        return array_filter((array) $params, fn($key) => $key[0] !== "\0", ARRAY_FILTER_USE_KEY);
    }

    public static function analyzeParamsTypes(Engine $latte, $params, \Zend_Controller_Request_Abstract $request, $dir, $custom_path = null){
        if(isDevelopment()){
            $paramsTemplate = new ParamsTemplate($latte);

            if (is_null($custom_path)) {
                $paramsTemplate->generateCode($dir . $request->getControllerName() . "/" . $request->getActionName() . ".latte", $params);
            }else{
                $paramsTemplate->generateCode($dir . $custom_path . '.latte', $params);
            }
        }
    }
}