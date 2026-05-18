<?php

namespace Jolanda\Controller;

use Exception;
use FilesystemIterator;
use Jolanda\Config\Config;
use Jolanda\Controls\Editor\EntityEditor;
use Jolanda\Controls\Editor\EntityEditorVue;
use Jolanda\Controls\Grid\QuickEditor;
use Jolanda\Controls\Grid\QuickEditorVue;
use Jolanda\JsLogger\JsLogger;
use Jolanda\Latte\Latte;
use Jolanda\Latte\ParamsTemplate\ParamsTemplate;
use Jolanda\Menu\Menu;
use Jolanda\Tracy\Extensions\Extensions;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Zend_Controller_Request_Abstract;
use Zend_Controller_Response_Abstract;

abstract class BaseController extends \Zend_Controller_Action
{

    protected const LAYOUT_FULL = 'layout';
    protected const LAYOUT_LOGIN = 'layout-login';
    protected const LAYOUT_INLINE = 'layout-inline';
    protected const LAYOUT_NONE = 'layout-none';

    protected const LAYOUT_VUE = 'layout-vue';

    /**
     * @var string
     */
    protected $module = 'admin';

    /**
     * @var string
     */
    protected $module_path = 'admin';

    /**
     * @var Menu
     */
    protected $menu;

    /**
     * @var Latte
     */
    protected $latte;

    /**
     * @var array
     */
    protected $coreParams;

    /**
     * @var string
     */
    protected $layout = self::LAYOUT_FULL;

    /**
     * @var string
     */
    protected $lang = 'CZ';

    public $showJolandaVersion = true;

    /**
     * @var int
     */
    protected $lang_id = 1;

    public $vueLayout = null;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array(), string $module = 'admin')
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->module = $module;
        $this->module_path = '../application/modules/' . $this->module;
        $this->latte = Latte::getInstance()->getEngine();
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->layout->disableLayout();
        $this->menu = Menu::getInstance();
        $this->coreParams = [];
    }

    protected function initialize(): void
    {
        $this->menu->setModule($this->module);
        $this->coreParams['request'] = [
            'module' => $this->getRequest()->getModuleName(),
            'controller' => $this->getRequest()->getControllerName(),
            'action' => $this->getRequest()->getActionName(),
            'url' => _bu() . '/' . $this->getRequest()->getModuleName() . '/' . $this->getRequest()->getControllerName() . '/' . $this->getRequest()->getActionName()
        ];
        $this->coreParams['translations'] = \Jolanda\Translations\Lang::getInstance()->getJsonLangs();
        $this->coreParams['module'] = $this->module;
        $this->coreParams["lang"] = $this->lang;
        $this->coreParams["lang_id"] = $this->lang_id;
        $this->coreParams["git_version"] = $this->showJolandaVersion ? $this->getCurrentGitVersion() : null;
        $this->coreParams["JsLogger"] = JsLogger::getSetting();
        $this->coreParams["__auth"] = $this->_getParam('__auth');
        $this->coreParams["menuSearchVisible"] = $this->menu->isSearchVisible();
        $this->coreParams["menuHomepageVisible"] = $this->menu->isHomepageVisible();

        $this->coreParams['jolandaConfig'] = [
            'vue' => null,
            'alerts' => [
                'vueAlerts' => Config::vueAlerts(),
                'historyBar' => Config::alertsHistoryBar(),
            ],
            'helpbar' => [
                'vueHelpbar' => Config::vueHelpbar(),
            ]
        ];

        try{
            $this->coreParams['jolandaConfig']["vue"] = Config::loadVue();
            if($this->coreParams['jolandaConfig']["vue"]){
                $mainFile = null;
                foreach ($this->coreParams['jolandaConfig']["vue"] as $key => $vue){
                    if($key === 'jolanda' || $key === 'front' || $key === 'base')
                        continue;

                    if(!empty($vue['mainFile']))
                        $mainFile = $vue['mainFile'];

                    $buildPaths = self::getVueBuildPaths($vue, true);
                    $this->coreParams['jolandaConfig']["vue"][$key]['buildPathJs'] = $buildPaths['buildPathJs'] ?? null;
                    $this->coreParams['jolandaConfig']["vue"][$key]['buildPathCss'] = $buildPaths['buildPathCss'] ?? null;
                }

                if(!empty($this->coreParams['jolandaConfig']['vue']['vue']) && !empty($mainFile)) {
                    $vueDevelopment = self::getVueDevelopment($this->coreParams['jolandaConfig']['vue']['vue'], $mainFile);
                    $this->coreParams['jolandaConfig']["vue"]['base']['development'] = $vueDevelopment['development'] ?? false;
                    $this->coreParams['jolandaConfig']["vue"]['base']['mainPath'] = $vueDevelopment['mainPath'] ?? null;

                    unset($this->coreParams['jolandaConfig']['vue']['vue']);
                }
            }
        }catch (\Exception $e){
            $this->coreParams['jolandaConfig']["vue"] = null;
        }
    }

    protected abstract function getBaseParams();

    protected function renderLatte($params = [], $use_acl = true, $custom_path = null, $return = false, $block = null)
    {
        if(!$block){
            $block = $this->_getParam('__block');
        }

        if ($this->getRequest()->getParam('layout-inline') != null && $this->layout != self::LAYOUT_LOGIN) {
            $this->setLayout(self::LAYOUT_INLINE);
        }
        $this->coreParams['layout_path'] = __DIR__."/templates/{$this->layout}.latte";

        if (!$use_acl or $this->menu->isAuthorized($this->getRequest())) {
            ParamsTemplate::$BACKTRACE_LVL = 5;
            ParamsTemplate::analyzeParamsTypes($this->latte, $params, $this->getRequest(), $this->module_path."/views/", $custom_path);
            $baseParams = $this->getBaseParams();

            $params = array_merge($params, $baseParams, $this->coreParams);
            try {
                if ($return) {
                    if ($custom_path != null) {
                        return $this->latte->renderToString($this->module_path."/views/".$custom_path.".latte", $params, $block);
                    } else {
                        return $this->latte->renderToString($this->module_path."/views/".$this->getRequest()->getControllerName()."/".$this->getRequest()->getActionName().".latte", $params, $block);
                    }
                } else {
                        Extensions::initializeLatte($this->latte);

                    if ($custom_path != null) {
                        $this->latte->render($this->module_path."/views/".$custom_path.".latte", $params, $block);
                    } else {
                        if(is_array($block)){
                            foreach ($block as $b){
                                $this->latte->render($this->module_path."/views/".$this->getRequest()->getControllerName()."/".$this->getRequest()->getActionName().".latte", $params, $b);
                            }
                        }else{
                            $this->latte->render($this->module_path."/views/".$this->getRequest()->getControllerName()."/".$this->getRequest()->getActionName().".latte", $params, $block);
                        }
                    }
                }
            } catch (Exception $e) {
                throw new Exception($e);
            }
        } else {
            throw new Exception('Access Denied by ACL');
        }
    }

    protected function setLayout(string $layout): void
    {
        $this->layout = $layout;
    }

    protected function renderEditor(EntityEditor|EntityEditorVue $editor, array $params = []): void {
        $this->coreParams['layout_path'] = __DIR__ . "/templates/{$this->layout}.latte";
        $params = array_merge($params, $this->coreParams, $this->getBaseParams());
        $params['editor'] = $editor;
        $panel_id = false;
        if ($this->getRequest()->getParam('panel_id')) {
            $panel_id = $this->getRequest()->getParam('panel_id');
        }
//        $entity_ID = $this->getRequest()->getParam('entity_ID');
//        if ($entity_ID != null) {
//            $editor->setEntityId($entity_ID);
//        }
        $params['panel_id'] = $panel_id;
        $parent_rows = $this->getRequest()->getParam('parent_rows');
        if ($parent_rows != null) {
            foreach ($parent_rows as $parent_row) {
                $editor->setParentEntity($parent_row['column'], $parent_row['id']);
            }
        }
        $caching = $this->getRequest()->getParam('caching');

        if($caching === '1' || $caching === 'true'){
            $editor->enableNextPrevButtons();
        }

        $editor->dataSaveType = $this->getRequest()->getParam('dataSaveType', EntityEditor::SAVE_DATA_SERVERSIDE);
        $editor->forGrid = $this->getRequest()->getParam('grid_id');
        $editor->local_tmp_id = $this->getRequest()->getParam('local_tmp_id');

        if ($editor->getBackUrl() != null) {
            $params["path"] = array_reverse($this->menu->getPathByUrl($editor->getBackUrl()));
        }

        if(empty($params['custom_code'])){
            $custom_code = null;
            if (!empty($params['custom_latte'])) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $params['custom_latte'] . ".latte", $params);
            } else if (file_exists($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte")) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte", $params);
            }
            $params['custom_code'] = $custom_code;
        }

        $params['create_default_values'] = json_decode($this->getRequest()->getParam('create_default_values'));

        $path = $_SERVER['DOCUMENT_ROOT'] . _bu();
        if (substr($path, -1) == '/') {
            $path = substr($path, 0, -1);
        }
        $path .= '/../www/jolanda/Jolanda/Controls/Editor/latte/';

        if(empty($this->getRequest()->getParam('return_object'))) {
            if ($panel_id) {
                $editor->setAjax(true);

                if($editor instanceof EntityEditorVue){
                    $params['useLayout'] = false;

                    echo json_encode([
                       'entityEditor' => $editor->toJson(),
                       'custom_code' => $params['custom_code'],
                    ]);
//                    echo $this->latte->render($path . 'editor-vue.latte', $params);
                }else if($editor instanceof EntityEditor){
                    echo json_encode([
                        'buttons' => $this->latte->renderToString($path . 'buttons.latte', $params),
                        'content' => $this->latte->renderToString($path . 'content.latte', $params),
                        'footer' => $this->latte->renderToString($path . 'footer.latte', $params),
                        'editor_id' => $editor->getId(),
                        'title' => $editor->getTitle(),
                    ]);
                }

            } else {
                if ($editor->getEntityId() == null && !$editor->isEnableStandalone()) {
                    throw new Exception('Rendering standalone editor for creating entity is disabled by default.');
                }
                if ($editor->getEntityId() == null && $editor->getBackUrl() == null) {
                    throw new Exception('Unable to render standalone editor for creating entity without back URL.');
                }

                if($editor instanceof EntityEditorVue){
                    $params['useLayout'] = true;
                    echo $this->latte->render($path . 'editor-vue.latte', $params);
                }else if($editor instanceof EntityEditor){
                    echo $this->latte->renderToString($path . 'editor.latte', $params);

                }
            }
        }else{
            $result = [
                'editor' => serialize($editor),
                'params' => $params,
            ];

            echo json_encode($result);
        }
    }

    protected function renderQuickEditor(QuickEditor $quickEditor, array $params = []): void
    {
        $quickEditor->setParent($this->getRequest()->getParam('parent_column'), $this->getRequest()->getParam('parent_entity_id'));
        $quickEditor->setDialog($this->getRequest()->getParam('dialog_id'));
//        $entity_ID = $this->getRequest()->getParam('entity_id');
//        if ($entity_ID != null) {
//            $quickEditor->setEntityId($entity_ID);
//        }
        $parent_rows = $this->getRequest()->getParam('parent_rows');
        if ($parent_rows != null) {
            foreach ($parent_rows as $parent_row) {
                $quickEditor->setParent($parent_row['column'], $parent_row['id']);
            }
        }

        $quickEditor->dataSaveType = $this->getRequest()->getParam('dataSaveType', QuickEditor::SAVE_DATA_SERVERSIDE);
        $quickEditor->forGrid = $this->getRequest()->getParam('grid_id');
        $quickEditor->local_tmp_id = $this->getRequest()->getParam('local_tmp_id');
        $quickEditor->create_default_values = json_decode($this->getRequest()->getParam('create_default_values'));

        if(!$quickEditor->getCustomCode()){
            $custom_code = null;
            if (file_exists($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte")) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte", ['editor' => $quickEditor, 'params' => $params]);
            }
            $quickEditor->setCustomCode($custom_code);
        }else{
            $custom_code = null;
            if (file_exists($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte")) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte", ['editor' => $quickEditor, 'params' => $params]);
            }
            $quickEditor->setCustomCode($quickEditor->getCustomCode() . $custom_code);
        }


        $params['vue'] = false;
        if(empty($this->getRequest()->getParam('return_object'))){
            if($quickEditor instanceof QuickEditorVue){
                $params['vue'] = true;
                echo json_encode([
                    'content' => $quickEditor->render($params),
                    'title' => 'Editace',
                    'footer' => ''
                ]);
//                echo json_encode([
//                    'quickEditor' => $quickEditor->toJson(),
//                ]);
                //                    echo $this->latte->render($path . 'editor-vue.latte', $params);
            }else{
                echo json_encode([
                    'content' => $quickEditor->render($params),
                    'title' => 'Editace',
                    'footer' => ''
                ]);
            }

        }else{
            $result = [
                'quickEditor' => serialize($quickEditor),
                'params' => $params,
            ];

            echo json_encode($result);
        }

    }

    private function getCurrentGitVersion(){
        try{
            $file = 'core';
            if (!file_exists(realpath("../").'/.git/modules/www/'.$file.'/HEAD')) {
                $file = 'jolanda';
            }
            if (!file_exists(realpath("../").'/.git/modules/www/'.$file.'/HEAD')) {
                return null;
            }

            $headFileContent = file_get_contents(realpath("../").'/.git/modules/www/'.$file.'/HEAD');
            if (str_contains($headFileContent, 'ref:')) {
                $refFile = trim(str_replace('ref:', '', $headFileContent));

                if(file_exists(realpath("../").'/.git/modules/www/'.$file.'/'.$refFile)){
                    $head = filemtime(realpath("../").'/.git/modules/www/'.$file.'/'.$refFile);
                    $hash = trim(file_get_contents(realpath("../").'/.git/modules/www/'.$file.'/'.$refFile));
                    $branch = basename(realpath("../") . '/.git/modules/www/'.$file.'/' . $refFile);
                    $date = Date('d.m.Y H:i:s', $head);
                }
            } else {
                if(file_exists(realpath("../").'/.git/modules/www/'.$file.'/HEAD')){
                    $head = filemtime(realpath("../").'/.git/modules/www/'.$file.'/HEAD');
                    $hash = $headFileContent;
                    $branch = $hash;
                    $date = Date('d.m.Y H:i:s', $head);
                }
            }

            //$commit = trim(file_get_contents(realpath("../") . '/.git/modules/www/core/COMMIT_EDITMSG'));


            return [
                'hash' => $hash ?? null,
                'date' => $date ?? null,
                'branch' => $branch ?? null,
            ];
        }catch (\Throwable $e){
            return null;
        }
    }

    public function renderRemoteEditor($url, string $token, $params = [], ?callable $renderCallback = null, $renderParams = []){
        $params = array_merge($this->_getAllParams(), $params);

        $params['return_object'] = 1;

        $request = new \Remante\OAuth\RestRequest($url, $token, $params);
        $response = $request->send();

        $response = json_decode($response, true);

        /** @var EntityEditor $editor  */
        $editor = unserialize($response['editor'], [false]);

//        $editor->setupRemoteEditor($manager);

        if($renderCallback != null){
            $renderCallback($editor);
        }

        if(!empty($response['params']['custom_code'])){
            $custom_code = null;
            if (!empty($renderParams['custom_latte'])) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $renderParams['custom_latte'] . ".latte", array_merge($renderParams, $response['params']));
            } else if (file_exists($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte")) {
                $custom_code = $this->latte->renderToString($this->module_path . "/views/" . $this->getRequest()->getControllerName() . "/" . $this->getRequest()->getActionName() . ".latte", array_merge($renderParams, $response['params']));
            }
            $response['params']['custom_code'] .= $custom_code;
        }

        $this->renderEditor($editor, array_merge($renderParams, $response['params']));
    }

    public function renderRemoteQuickEditor($url, string $token, $params = [], ?callable $renderCallback = null, $renderParams = []){
        $params = array_merge($this->_getAllParams(), $params);

        $params['return_object'] = 1;

        $request = new \Remante\OAuth\RestRequest($url, $token, $params);
        $response = $request->send();

        $response = json_decode($response, true);

        /** @var QuickEditor $editor  */
        $editor = unserialize($response['quickEditor'], [false]);

//        $editor->setupRemoteEditor($manager);

        if($renderCallback != null){
            $renderCallback($editor);
        }

        //renderuje quick editor
        $this->renderQuickEditor($editor, array_merge($renderParams, $response['params']));
    }

    protected function renderVue($params = [], $use_acl = true)
    {
        $this->coreParams['layout_path'] = __DIR__."/templates/" . self::LAYOUT_VUE . ".latte";

        if (!$use_acl or $this->menu->isAuthorized($this->getRequest())) {
            $baseParams = $this->getBaseParams();

            $this->returnVueApi($params);

//            $params = array_merge($params, $baseParams, $this->coreParams);
            $params = $this->getVueParams();
            $params['vueParams'] = json_encode($params);
            try {
                Extensions::initializeLatte($this->latte);

                $this->latte->render($this->module_path."/views/".$this->vueLayout.".latte", $params);
            } catch (Exception $e) {
                throw new Exception($e);
            }
        } else {
            if($this->isVueApiRequest()){
                header('HTTP/1.1 403 Forbidden');
                header('Content-Type: application/json');
                echo json_encode([
                    'error'   => 'Forbidden',
                    'message' => 'Uživatel nemá oprávnění přístupu na tuto stránku'
                ]);
                exit;
            }

            throw new Exception('Access Denied by ACL');
        }
        exit;
    }

    public function returnVueApi($params){
        if ($this->isVueApiRequest()) {
            header('Content-Type: application/json');
            echo json_encode($params);
            exit;
        } else {
            return;
        }
    }

    protected function getVueParams(){
        $params = $this->coreParams;
        $params = array_merge($params, $this->getBaseParams());

        $params['menu'] = $this->menu->toArray();
        $params['layout'] = __DIR__ . '/../views/' . $this->vueLayout;

        $params['menu']['favorites'] = null;
        if($params['user']->ID){
            $menuConfig = Config::loadMenu();

            if($menuConfig && $menuConfig['favorites'] && $menuConfig['favorites']['enable'] === '1' && $menuConfig['favorites']['url']){
                $favorites = MenuController::getFavorites($params['user']->ID);

                $params['menu']['favorites']['url'] = $menuConfig['favorites']['url'];

                if($favorites && key_exists('Items', $favorites)){
                    $params['menu']['favorites']['items'] = json_decode($favorites['Items']);
                }else{
                    $params['menu']['favorites']['items'] = [];
                }
            }
        }

        $params['jolandaBuildTime'] = self::getJolandaBuildTime();

        return $params;
    }

    public function isVueApiRequest(){
        return isset($_SERVER['CONTENT_TYPE']) && (str_contains($_SERVER['CONTENT_TYPE'], 'application/json') || str_contains($_SERVER['CONTENT_TYPE'], 'multipart/form-data')) !== false;
    }

    protected static function isViteRunning($url, $port, $mainPath) {
        if(!isDevelopment()) return false;

        $ch = curl_init("$url:$port$mainPath");
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, 300); // rychle failne
        curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $code > 0;
    }

    static function initJolandaBuildTime(){
        header('X-Jolanda-Build-Time: ' . self::getJolandaBuildTime());
    }

    private static function getJolandaBuildTime(): int {
        try {
            $vueConfig = Config::loadVue();
            foreach ($vueConfig as $key => $vue) {
                if ($key === 'jolanda') continue;

                $buildDirectory = self::getVueBuildDirectory($vue, true);
                if (file_exists($buildDirectory))
                    return @filemtime($buildDirectory);
                else return 0;
            }
        } catch (\Throwable $e) {
            return 0;
        }

        return 0;
    }

    private static function getVueBuildDirectory(array $config, bool $fallbackPath = false): ?string {
        $buildDirectory = $config['buildDirectory'] ?? ($fallbackPath ? 'vue/dist/' : null);
        if($buildDirectory) {
            $buildDirectory = str_starts_with($buildDirectory, '/') ? ltrim($buildDirectory, '/') : $buildDirectory;
            $buildDirectory = !str_ends_with($buildDirectory, '/') ? $buildDirectory . '/' : $buildDirectory;
        }

        $versionedBuild = filter_var($config['versionedBuild'] ?? null, FILTER_VALIDATE_BOOL);
        $versionedBuildPrefix = $config['versionedBuildPrefix'] ?? 'dist-';
        $minKeptBuilds = $config['minKeptBuilds'] ?? 3;
        $oldBuildLifeHours = $config['oldBuildLifeHours'] ?? 12;
        if($versionedBuild) {
            $entries = scandir($buildDirectory);
            $buildDirectories = [];
            foreach ($entries as $entry) {
                if ($entry === '.' || $entry === '..')
                    continue;

                $fullPath = $buildDirectory . $entry;
                if (is_dir($fullPath))
                    $buildDirectories[$fullPath] = filemtime($fullPath);
            }

            arsort($buildDirectories);
            $buildDirectories = array_filter(array_keys($buildDirectories), function ($value) use ($versionedBuildPrefix, $buildDirectory) {
                return str_starts_with($value, $buildDirectory . $versionedBuildPrefix);
            });
            $buildDirectories = array_values($buildDirectories);

            $buildDirectory = $fallbackPath ? 'vue/dist/' : null;
            if(!empty($buildDirectories[0]))
                $buildDirectory = !str_ends_with($buildDirectories[0], '/') ? $buildDirectories[0] . '/' : $buildDirectories[0];

            $oldBuildDirectories = array_slice($buildDirectories, $minKeptBuilds);
            foreach ($oldBuildDirectories as $oldBuildDirectory) {
                if(filemtime($oldBuildDirectory) < time() - $oldBuildLifeHours * 3600 && file_exists($oldBuildDirectory)) {
                    $files = new RecursiveIteratorIterator(
                        new RecursiveDirectoryIterator($oldBuildDirectory, FilesystemIterator::SKIP_DOTS),
                        RecursiveIteratorIterator::CHILD_FIRST
                    );

                    foreach ($files as $fileInfo) {
                        $todo = ($fileInfo->isDir() ? 'rmdir' : 'unlink');
                        $todo($fileInfo->getRealPath());
                    }

                    rmdir($oldBuildDirectory);
                }
            }
        }

        if($buildDirectory) {
            $buildDirectory = str_starts_with($buildDirectory, '/') ? ltrim($buildDirectory, '/') : $buildDirectory;
            return !str_ends_with($buildDirectory, '/') ? $buildDirectory . '/' : $buildDirectory;
        } else return null;
    }

    public static function getVueBuildPaths(array $vueConfig, bool $fallbackPath = false): array {
        $buildDirectory = self::getVueBuildDirectory($vueConfig, $fallbackPath);
        if(empty($buildDirectory)) {
            return [
                'buildPathJs' => null,
                'buildPathCss' => null,
            ];
        }

        $defaultBuildPathJs = $buildDirectory . 'build.js';
        $defaultBuildPathCss = $buildDirectory . 'build.css';
        $buildPathJs = null;
        $buildPathCss = null;
        $hasManifest = file_exists($buildDirectory . 'manifest.json');

        if ($hasManifest) {
            $manifest = json_decode(file_get_contents($buildDirectory . 'manifest.json'), true);
            if (!empty($manifest['buildFileJs']) && file_exists($buildDirectory . $manifest['buildFileJs']))
                $buildPathJs = '/' . $buildDirectory .  $manifest['buildFileJs'];
            else if(file_exists($defaultBuildPathJs))
                $buildPathJs = '/' . $defaultBuildPathJs;

            if (!empty($manifest['buildFilesCss'])) {
                foreach ($manifest['buildFilesCss'] as $css) {
                    if (file_exists($buildDirectory . $css)) {
                        if(!is_array($buildPathCss))
                            $buildPathCss = [];

                        $buildPathCss[] = '/' . $buildDirectory . $css;
                    }
                }
            } else {
                if (!empty($manifest['buildFileCss']) && file_exists($buildDirectory . $manifest['buildFileCss']))
                    $buildPathCss = '/' . $buildDirectory .  $manifest['buildFileCss'];
                else if(file_exists($defaultBuildPathJs))
                    $buildPathCss = '/' . $defaultBuildPathCss;
            }
        } else {
            if (file_exists($defaultBuildPathJs))
                $buildPathJs = '/' . $defaultBuildPathJs;

            if (file_exists($defaultBuildPathCss))
                $buildPathCss = '/' . $defaultBuildPathCss . '?' . filemtime($defaultBuildPathCss);
        }

        return [
            'buildPathJs' => $buildPathJs,
            'buildPathCss' => $buildPathCss,
        ];
    }

    public static function getVueDevelopment(array $vueConfig, string $mainFile): array {
        $mainPath = null;
        $development = false;

        if(!empty($vueConfig['automaticDetection'])){
            if(!empty($vueConfig['port']) && !empty($vueConfig['url'])){
                $development = self::isViteRunning($vueConfig['url'], $vueConfig['port'], '/vue/dist/src/' . $mainFile);
                $mainPath = "http://localhost:" . $vueConfig['port'] . '/vue/dist/src/' . $mainFile;
            }
        } else {
            if(!empty($vueConfig['development']) && !empty($vueConfig['port'])){
                $development = true;
                $mainPath = "http://localhost:" . $vueConfig['port'] .'/vue/dist/src/' . $mainFile;
            }
        }

        return [
            'development' => $development,
            'mainPath' => $mainPath,
        ];
    }
}