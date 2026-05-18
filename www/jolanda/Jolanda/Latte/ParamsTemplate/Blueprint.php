<?php

namespace Jolanda\Latte\ParamsTemplate;

use Latte\Runtime\Template;
use Nette\PhpGenerator as Php;
use ReflectionClass;

final class Blueprint
{
    public array $parsedTypes = [];

    public array $staticTypes = [];
    private array|object $params;

    private string $fileName;
    private string $path;
    private string $namespaceName;
    private Template $template;

    private ?string $extendClass = null;

    public function __construct(Template $template, ?string $extendClass = null, array|object $params)
    {
        $this->template = $template;

        [$fileName, $path, $namespaceName] = $this->prepareFileInfo($template);

        $this->fileName = $fileName;
        $this->path = $path;
        $this->namespaceName = $namespaceName;

        $this->extendClass = $extendClass;

        $this->params = $params;
    }

    /**
     * Generate code for the given template.
     *
     * @param Template    $template
     * @param string|null $name
     * @param bool        $saveToFile
     *
     * @return string
     * @throws \LogicException
     */
    public function getCode(): string
    {
        $this->checkPhpGeneratorExists();

        if (ParamsTemplate::$ALLOW_STATIC_ANALYSIS) {
            $analyser = new \Jolanda\Latte\ParamsTemplate\AnalyseLatteParams([], ParamsTemplate::$BACKTRACE_LVL);
            $this->staticTypes = $analyser->analyzeCode();
        }

        if (!ParamsTemplate::$ALWAYS_REBUILD) {
            $this->parsedTypes = $this->parseCurrentFile();
        }

        $namespace = $this->createNamespace($this->namespaceName);
        $class = $this->createClass($namespace, $this->fileName);
        if($this->extendClass){
            $class->setExtends($this->extendClass);
        }


        $constructor = $class->addMethod('__construct');

        $this->addProperties($class, $this->template->getParameters());
//        $functions = array_diff_key((array)$template->global->fn, (new \Latte\Essential\CoreExtension)->getFunctions());
//        $this->addFunctions($class, $functions);
        $this->addConstructorBody($class, $constructor);

        if (ParamsTemplate::$SAVE_TO_FILE) {
            $this->saveToFile($namespace);
        }

        if (ParamsTemplate::$ADD_MAKRO_TO_TEMPLATE) {
            $this->addMakroToTemplate($this->template, $this->namespaceName, $this->fileName);
        }

        return (string)$namespace;
    }

    /**
     * Check if Nette PhpGenerator exists.
     *
     * @throws \LogicException
     */
    private function checkPhpGeneratorExists(): void
    {
        if (!class_exists(Php\ClassType::class)) {
            throw new \LogicException('Nette PhpGenerator is required to print template, install package `nette/php-generator`.');
        }
    }

    /**
     * Prepare file information for the given template.
     *
     * @param Template $template
     *
     * @return array
     */
    private function prepareFileInfo(Template $template): array
    {
        $name = realpath($template->getName());
        $name = str_replace('\\', '/', $name);

        $fileNameWithExt = ltrim(strrchr($name, "/"), "/");

        $fileName = str_replace(".latte", "", $fileNameWithExt);

        $fileName = explode('-', $fileName);
        foreach ($fileName as &$part) {
            $part = ucfirst($part);
        }
        unset($part);
        $fileName = implode('', $fileName);


        $fileName = $fileName . 'ParamsTemplate';

        $path = str_replace($fileNameWithExt, '', $name);

        $startPos = strpos($name, '/modules');
        if ($startPos !== false) {
            $substring = substr($name, ($startPos + strlen('/modules') + 1));
            $substring = str_replace(array('/controllers/..', $fileNameWithExt), '', $substring);
            $substring .= 'paramsTemplates/' . $fileName;
            $substring = str_replace('/', '\\', $substring);

            $parts = explode('/', $substring); // Rozdělení řetězce do částí podle '/'
            $resultParts = [];

            foreach ($parts as $part) {
                $subParts = explode('-', $part); // Rozdělení každé části podle '-'
                $camelCasePart = array_shift($subParts); // První část zůstává nezměněna

                // Každou následující část transformujeme na camelCase
                foreach ($subParts as $subPart) {
                    $camelCasePart .= ucfirst($subPart); // Přidáme část s prvním písmenem velkým
                }

                $resultParts[] = $camelCasePart;
            }

            $substring = implode('/', $resultParts); // Spojení částí zpět do cesty


            $namespaceName = $substring;
        }
        else {
            $namespaceName = 'asdf';
        }

        $path .= 'paramsTemplates';

        return [$fileName, $path, $namespaceName];
    }

    /**
     * Create a new namespace.
     *
     * @param string $namespaceName
     *
     * @return Php\PhpNamespace
     */
    private function createNamespace(string $namespaceName): Php\PhpNamespace
    {
        return new Php\PhpNamespace(Php\Helpers::extractNamespace($namespaceName));
    }

    /**
     * Create a new class.
     *
     * @param Php\PhpNamespace $namespace
     * @param string           $fileName
     *
     * @return Php\ClassType
     */
    private function createClass(Php\PhpNamespace $namespace, string $fileName): Php\ClassType
    {
        return $namespace->addClass(Php\Helpers::extractShortName($fileName));
    }

    /**
     * Add properties to the class.
     *
     * @param Php\ClassType $class
     * @param array         $props
     */
    private function addProperties(Php\ClassType $class, array $props): void
    {
        foreach ($props as $name => $value) {
            $class->removeProperty($name);
            $type = $this->getType($value);
            $types = [];
            $specialTypes = []; // Pole pro speciální typy

            if (!ParamsTemplate::$ALWAYS_REBUILD) {
                $parsedTypes = $this->parsedTypes[$name] ?? [];

                foreach ($parsedTypes as $pt) {
                    if (!in_array($pt, $types)) {
                        $types[] = $pt;
                    }
                }
            }

            if(!in_array($type, $types)){
                $types[] = $type;
            }

            if (ParamsTemplate::$ALLOW_STATIC_ANALYSIS) {
                if(is_object($this->params)){
                    $staticTypes = $this->staticTypes[$name] ?? [];
                    foreach ($staticTypes as $key => $st) {
                        if ($st === 'unknown') {
                            continue;
                        }

                        if ($key === 'arrayItems') {
                            continue;
                        }

                        if (!in_array($st, $types)) {
                            $types[] = $st;
                        }
                    }
                }else{
                    foreach ($this->staticTypes as $key => $st){
                        if(array_key_exists('arrayItems', $st)){
                            if(array_key_exists($name, $st['arrayItems'])){
                                foreach ($st['arrayItems'][$name] as $k => $arrayItemType) {
                                    //TODO pokud další pole, tak do komentů dát return typy
                                    if($k === 'arrayItems'){
                                        continue;
                                    }

                                    if ($arrayItemType === 'unknown') {
                                        continue;
                                    }

                                    if (!in_array($arrayItemType, $types)) {
                                        $types[] = $arrayItemType;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Oddělení speciálních typů
            if (in_array('false', $types)) {
                $specialTypes[] = 'false';
                $types = array_diff($types, ['false']);
            }
            if (in_array('null', $types)) {
                $specialTypes[] = 'null';
                $types = array_diff($types, ['null']);
            }

            // Přidání speciálních typů na konec
            $types = array_merge($types, $specialTypes);

            if (count($types) > 1) {
                $types = array_filter($types, function ($type) {
                    return $type !== 'mixed';
                });
            }

            if(count($types) === 1 && (in_array('null', $types) || in_array('false', $types))){
                $types = ['mixed'];
            }

            if(!count($types)){
                $types = ['mixed'];
            }

            $prop = $class->addProperty($name);

            foreach ($types as $key => $t){
                if(str_ends_with($t, '[]')){
                    $prop->addComment('@var \\' . $t);

                    unset($types[$key]);
                }
            }

            $type = implode('|', $types);
            $prop->setType($type);
        }
    }

    /**
     * Add functions to the class.
     *
     * @param Php\ClassType $class
     * @param array         $funcs
     */
    private function addFunctions(Php\ClassType $class, array $funcs): void
    {
        foreach ($funcs as $name => $func) {
            $method = (new Php\Factory)->fromCallable($func);
            $type = $this->printType($method->getReturnType(), $method->isReturnNullable(), $class->getNamespace()) ?: 'mixed';
            $class->addComment("@method $type $name" . $this->printParameters($method, $class->getNamespace()));
        }
    }

    /**
     * Add body to the constructor.
     *
     * @param Php\ClassType $class
     * @param Php\Method    $constructor
     */
    private function addConstructorBody(Php\ClassType $class, Php\Method $constructor): void
    {
        foreach ($class->getProperties() as $name => $value) {
            $prop = $constructor->addParameter($name);
            $prop->setType($value->getType());

            $constructor->addBody('$this->' . $prop->getName() . ' = $' . $prop->getName() . ';');
        }
    }

    /**
     * Save the namespace to a file.
     *
     * @param Php\PhpNamespace $namespace
     */
    private function saveToFile(Php\PhpNamespace $namespace): void
    {
        if (!is_dir($this->path)) {
            mkdir($this->path, 0777, true);
        }

        if(file_exists($this->path . '/' . $this->fileName . '.php')){
            $data = file_get_contents($this->path . '/' . $this->fileName . '.php');

            if(md5($data) === md5((string) $namespace)){
                return;
            }
        }

        file_put_contents($this->path . '/' . $this->fileName . '.php', "<?php \n" . (string)$namespace);
    }

    public function addMakroToTemplate(Template $template, string $namespaceName, string $fileName): void
    {
        $modifiedNamespace = $namespaceName;
        $lastSlashPosition = strrpos($namespaceName, '\\');
        if ($lastSlashPosition !== false) {
            $modifiedNamespace = substr($namespaceName, 0, $lastSlashPosition);
        }

        $makro = '{templateType ' . $modifiedNamespace . '\\' . $fileName . '}';
        $data = file_get_contents($template->getName());

        if (str_contains($data, '{templateType')) {
            if(str_contains($data, $makro)){
                return;
            }
            $data = preg_replace('/{templateType.*}/', $makro, $data);
        }
        else {
            $data = $makro . "\n" . $data;
        }

        file_put_contents($template->getName(), $data);
    }

    /**
     * Get the type of the given value.
     *
     * @param mixed $value
     *
     * @return string
     */
    private function getType($value): string
    {
        return $value === null ? 'mixed' : get_debug_type($value);
    }

    public function parseCurrentFile($fromComments = false): array
    {

        $fileExist = file_exists($this->path . '/' . $this->fileName . '.php');

       if($fileExist){
           require_once $this->path . '/' . $this->fileName . '.php';
           $templateParser = new \Jolanda\Latte\ParamsTemplate\ParamsTemplateParser();
           $parsedTypes = $templateParser->parse($this->namespaceName, $fromComments);
       }else{
           return [];
       }


       return $parsedTypes;
    }

//    private function loadFromFile(string $path, string $fileName){
//        return file_get_contents($path . '/' . $fileName . '.php');
//    }
}