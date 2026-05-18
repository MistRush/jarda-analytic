<script setup>
import DocPage from "@/Docs/DocPage.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
</script>

<template>
    <DocPage>
        <template #title> Instalace </template>

        <template #content>
            <Example title="Vytvoření složky vue v rootu">
                <p>V rootu vytvoříme složky podle struktury, která je ukázaná v AppDoc. Vytvoříme také následující soubory</p>

                <Preview
                    code='
          {
            "include": [
                "src/**/*",
                "src/**/*.vue",
                "../www/jolanda/front-vue/**/*",
                "../www/jolanda/front-vue/**/*.vue",
                "vite.config.*",
                "vitest.config.*",
                "cypress.config.*",
                "nightwatch.conf.*",
                "playwright.config.*"
            ],
            "exclude": ["src/**/__tests__/*"],
            "compilerOptions": {
                "module": "ESNext",
                "moduleResolution": "Bundler",
                "types": ["node"],
                "composite": true,
                "baseUrl": ".",
                "paths": {
                    "@project/*": ["./src/*"],
                    "@/*": ["../www/jolanda/front-vue/src/*"],
                    "@front/*": ["../www/project/*"]
                },
                "experimentalDecorators": true
            }
          }
        '
                >
                    <template #header> jsconfig.json </template>
                </Preview>

                <Preview
                    code='
            {
              "include": [
                  "src/**/*",
                  "src/**/*.vue",
                  "../www/jolanda/front-vue/**/*",
                  "../www/jolanda/front-vue/**/*.vue",
                  "vite.config.*",
                  "vitest.config.*",
                  "cypress.config.*",
                  "nightwatch.conf.*",
                  "playwright.config.*",
              ],
              "exclude": ["src/**/__tests__/*"],
              "compilerOptions": {
                  "module": "ESNext",
                  "moduleResolution": "Bundler",
                  "types": ["node"],
                  "composite": true,
                  "baseUrl": ".",
                  "paths": {
                      "@project/*": ["./src/*"],
                      "@/*": ["../www/jolanda/front-vue/src/*"],
                      "@front/*": ["../www/project/*"],
                  },
                  "experimentalDecorators": true
              }
            }
          '
                >
                    <template #header> tsconfig.json </template>
                </Preview>

                <Preview
                    code='
          {
            "name": "vue",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "preview": "vite preview"
            },
            "dependencies": {
              "jolanda": "git+ssh://git@bitbucket.org/itremante/jolanda.git#master"
            },
            "devDependencies": {
              "typescript": "~5.8.3",
              "vue-tsc": "^3.0.7",
              "vite": "^7.1.5",
              "webpack": "^5.101.3",
              "webpack-cli": "^6.0.1",
              "autoprefixer": "^10.4.21",
              "tailwindcss": "^4.1.13",
              "@tailwindcss/vite": "^4.1.13",
              "@vitejs/plugin-vue": "^6.0.1",
              "@vitejs/plugin-vue-jsx": "^5.1.1",
              "@vue/tsconfig": "^0.8.1",
              "@tsconfig/node22": "^22.0.2",
              "@types/lodash": "^4.17.20",
              "@types/node": "^22.15.30",
              "npm-run-all2": "^8.0.4",
              "prettier": "^3.6.2",
              "prettier-plugin-tailwindcss": "^0.6.14",
              "unplugin-vue-components": "^29.0.0",
              "@iconify/json": "^2.2.385",
              "@iconify/tailwind4": "^1.0.6"
            }
          }
        '
                >
                    <template #header> package.json (následně zavoláme npm install, popřipadě pak npm update) </template>
                </Preview>

                <Preview
                    lang="js"
                    code='
import sharedConfig from "../www/jolanda/front-vue/src/App/configs/vite.base.config.js";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
    const baseConfig = sharedConfig({
        command,
        //@ts-ignore
        projectRoot: __dirname,
        outDir: "dist",
        // Pro verzovaní buildu, viz sekce jolanda.ini
        // outDir: "dist-" + (new Date()).getTime(),
    });

    return {
        ...baseConfig,
    };
});

        '
                >
                    <template #header>vite.config.ts</template>
                </Preview>

                <Preview
                    code='
@import "tailwindcss" source(none);

@import "../../../www/jolanda/front-vue/src/assets/index.css";

@source "../";
@source "../../../www/jolanda/front-vue/src";

@plugin "@iconify/tailwind4";
        '
                >
                    <template #header>src/assets/index.css</template>
                </Preview>

                <Preview
                    code='
import "./assets/index.css";
import { createPinia } from "pinia";
import App from "@/App/App.js";
import "gridstack/dist/gridstack.min.css";
import "splitpanes/dist/splitpanes.css";

window.pinia = window.pinia ?? createPinia();

const jolandaApp = App.createInstance();
if (jolandaApp) {
    jolandaApp.router.initRoutes();
    jolandaApp.mountApp();
}

        '
                >
                    <template #header>src/main.js</template>
                </Preview>
            </Example>

            <Example title="PHP layout">
                <p>Vytvoříme vue laout v latte (admin/views/layout-vue.latte)</p>

                <Preview
                    code="
{layout $layout_path}

{block logo_path}
    {$basePath}/project/img/logo_remante.svg
{/block}

{block appTitle}
    CDB
{/block}

{block headAfter}

{/block}
        "
                >
                </Preview>

                <p class="mt-2">Do controlleru rožšiřující Jolanda BaseController si definujeme cestu k našemu vue layoutu (např do construktoru)</p>
                <Preview
                    code="
$this->vueLayout = 'layout-vue';
        "
                >
                </Preview>
            </Example>

            <Example title="getVueParams">
                <p>getVueParams je podobná funkce jako getBaseParams pro latte šablony. Tady si definujeme data, které se v js uloží do app.settings</p>

                <Preview
                    code="
protected function getVueParams(){
        $params = parent::getVueParams();

        if($this->user){
            $params['user'] = $this->user ? $this->user->toArray() : null;
            $params['user']['userSettings'] = UserSettings::getInstance()->toArray();
            unset($params['user']['Hash']);
            unset($params['user']['PublicHash']);
            $params['user']['permissions'] = UserSession::getPermissions();
        }


        $params['logo_path'] = _bu() . '/project/img/logo_remante_white.svg';
        $params['appTitle'] = 'CDB';

        $locale = Languages::getInstance()->getCurrentLanguageCode();

        $translations = [];
        if($locale !== 'CZ'){
            $strings = $this->translation->getStrings($locale, true);


            foreach ($strings as $id => $string) {
                $translations[$string['orig']] = $string['text'];
            }
        }

        $params['translations'] = [
            'origLocale' => 'CS',
            'locale' => [
                'ID' => Languages::getInstance()->getCurrentLanguageID(),
                'Name' => Languages::getInstance()->getCurrentLanguageName(),
                'Code' => Languages::getInstance()->getCurrentLanguageCode(),
            ],
            'activeLanguages' => Languages::getInstance()->getActiveLanguages(),
            'languages' => Languages::getInstance()->getLanguages(),
            'core' => \Jolanda\Translations\Lang::getInstance()->getLangsArray(),
            'translations' => $translations,
        ];

        return $params;
    }
        "
                >
                    <template #header> Příklad použití getVueParams s předáním překladů 'translations', které je nutné předat pro správnou funkci překladů. </template>
                </Preview>
            </Example>

            <Example title="jolanda.ini">
                <p>Ve složce application/configs vytvoříme config jolanda.ini</p>
                <Preview code='
[VUE]
admin[buildDirectory] = "/vue/dist/" ; Build složka
        '
                />

                <p>Pro zapnutí development režimu můžeme použít automatickou detekci Vite serveru. Pozor, pro development je vynucená sekce v configu s názvem 'vue'</p>
                <Preview code='
vue[automaticDetection] = 1 ; Zapne automatickou detekci Vite serveru pro development režim
vue[url] = "http://host.docker.internal" ; URL na kterém běží Vite

admin[mainFile] = "main.js"
'
                />

                <p>Pokud nechceme používat automatickou detekci Vite serveru, můžeme development režim přepínat manuálně</p>
                <Preview code='
vue[development] = 1
vue[port] = "5173"

admin[mainFile] = "main.js"'
                />

                <p>Pokud v build složce uchováváme více verzí buildu, můžeme nastavit načítání nejnověší verze a úklid starých verzí. Verzovaný build musí být implementován na úrovni projektu v rámci deployment procesu. Tato funkce pouze zajišťuje kompatibilitu a úklid složky, nikoliv implementaci samotných verzí</p>
                <Preview code='
admin[versionedBuild] = 1 ; Příznak, zda je aktivní verzovaný build
admin[buildDirectory] = "/vue/" ; Build složka. Jelikož jednotlivé buildy mají dynamické názvy, uvádíme zde jen nadřazenou složku
admin[versionedBuildPrefix] = "dist-" ; Prefix build složek, který musí být jednotný pro všechny složky. Jinak nazvané složky jsou ignorovány
admin[minKeptBuilds] = 3 ; Minimální počet verzí, které chceme uchovávat
admin[oldBuildLifeHours] = 12 ; Minimální životnost verze. Pokud je překročen minimální počet uchovávaných verzí, verze starší tomuto času budou smazány
'
                />

                <p>Pro více konfigurací můžeme použít jiný název. Při verzovaném buildu si musíme dát pozor, aby se prefixy nepřekrývali, tedy pokud už používáme prefix 'dist-', neměli by jsme v další konfiguraci používat prefix například 'dist-front-'</p>
                <Preview code='
front[versionedBuild] = 1
front[buildDirectory] = "/vue/"
front[versionedBuildPrefix] = "front-"
'
                />

                <p>Pro načtení build souborů mimo jádro jolandy, lze využít funkce z BaseControlleru</p>
                <Preview
                    lang="php"
                    code='
    $config = \Jolanda\Config\Config::loadVue();
    if(!empty($config["front"])) {
        $buildPaths = \Jolanda\Controller\BaseController::getVueBuildPaths($config["front"]);
        // $buildPaths["buildPathJs"]
        // $buildPaths["buildPathCss"]
    }
'
                />

                <p>Příklad finálního configu</p>
                <Preview
                    code='
[VUE]
vue[development] = 0
vue[port] = 5173

admin[versionedBuild] = 1
admin[buildDirectory] = "/vue/"
admin[versionedBuildPrefix] = "dist-"
admin[mainFile] = "main.js"

front[versionedBuild] = 1
front[buildDirectory] = "/vue/"
front[versionedBuildPrefix] = "front-"
front[mainFile] = "front.js"
'
                />
            </Example>

            <Example title="PHP managery">
                <p>Pro možnost používání data-grid, data-editor a schema pro editory je třeba rozšířit funkcionalitu aktuálních managerů.</p>

                <Preview
                    code="
        public function dataGridAction() {
              Clevis_Timer::start('run-action-data-grid');

              // Init data action
              $this->disableLayout();

              $attributes = Clevis_Helper::getRequestParams();
              unset($attributes['module']);
              unset($attributes['controller']);
              unset($attributes['action']);

              // Get data manager
              $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_GRID, $attributes);
              $dataManager->init(Clevis_Data_Manager::DATA_GRID, $attributes);

              // Perform data grid
              $data = $dataManager->performDataGrid($attributes);

              $this->renderData($data, null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);

              Clevis_Timer::stop('run-action-data-grid');
        }

        public function dataEditorAction() {
              Clevis_Timer::start('run-action-data-editor');

              // Init data action
              $this->disableLayout();

              $attributes = Clevis_Helper::getRequestParams();
              unset($attributes['module']);
              unset($attributes['controller']);
              unset($attributes['action']);

              // Get data manager
              $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_EDITOR, $attributes);
              $dataManager->init(Clevis_Data_Manager::DATA_EDITOR, $attributes);

              // Perform data editor
              $data = $dataManager->performDataEditor($attributes);

              $this->renderData($data, null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);

              Clevis_Timer::stop('run-action-data-editor');
        }

        public function dataSchemaAction() {
              Clevis_Timer::start('run-action-data-schema');

              $this->disableLayout();

              $attributes = Clevis_Helper::getRequestParams();
              unset($attributes['module']);
              unset($attributes['controller']);
              unset($attributes['action']);

              $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_SCHEMA, $attributes);
              $dataManager->init(Clevis_Data_Manager::DATA_EDITOR, $attributes);

              $schema = $dataManager->getDataSchema();

              header('Content-Type: application/json');
              echo json_encode(['schema' => $schema]);

              Clevis_Timer::stop('run-action-data-schema');
        }

        public function dataPreviewAction() {
            Clevis_Timer::start('run-action-data-preview');

            $this->disableLayout();

            $attributes = Clevis_Helper::getRequestParams();
            unset($attributes['module']);
            unset($attributes['controller']);
            unset($attributes['action']);

            $dataManager = $this->dataManager->getManager(Clevis_Data_Manager::DATA_PREVIEW, $attributes);
            $dataManager->init(Clevis_Data_Manager::DATA_PREVIEW, $attributes);

            $data = $dataManager->performDataPreview($attributes);

            $this->renderData($data, null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);

            Clevis_Timer::stop('run-action-data-preview');
        }
        "
                >
                    <template #header> Clevis/Zend/Controller/DataAction.php </template>
                </Preview>

                <Preview
                    code="
                    //Na začatek funkce
                    $attributes = Clevis_Helper::getRequestParams();

                    //Toto přidáme
                    if(isset($attributes['_getSchema'])){
                        $this->getSchema = true;
                        unset($attributes['_getSchema']);
                    }
                    //end

                    unset($attributes['module']);
                    unset($attributes['controller']);
                    unset($attributes['action']);



                    //po $dataManager->performDataList($attributes, $listType) přidáme
                    $dataParam = null;
                    if (isset($data['numResults'])) {
                        $dataParam['numRows'] = $data['numResults'];
                    }
                    if (isset($data['message'])) {
                        $dataParam['message'] = $data['message'];
                    }

                    //Toto přidáme
                    if($this->getSchema){
                        $dataParam['schema'] = $dataManager->getDataSchema();
                    }
                    //end

                    $dataParam['statuses'] = \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray();

                    $this->renderData($data['data'], $data['identifier'], $dataParam);
        "
                >
                    <template #header> Clevis/Zend/Controller/DataAction.php function dataListAction() </template>
                </Preview>

                <Preview
                    code="
              const DATA_GRID = 64;
              const DATA_EDITOR = 128;
              const DATA_SCHEMA = 256;
              const DATA_PREVIEW = 512;

              public function getDataSchema(){
                  $schema = [
                      'manager' => [
                          'model' => $this->model,
                          'modelIdentifier' => $this->modelIdentifier,
                          'modelUniqueIdentifier' => $this->modelUniqueIdentifier,
                      ],
                      'children' => [],
                  ];


                  foreach ($this->children as $child){
                      $this->getChildRelation($child['alias'], $relationType, $relationLocal, $relationForeign);

                      $childSchema = array_merge($child['manager']->getDataSchema(), [
                          'alias' => $child['alias'],
                          'type' => $child['type'],
                          'aliasAs' => $child['alias-as'],
                          'relation' => [
                              'type' => $relationType,
                              'local' => $relationLocal,
                              'foreign' => $relationForeign,
                          ],
                      ]);


                      $schema['children'][] = $childSchema;
                  }

                  return $schema;
              }
        "
                >
                    <template #header> Clevis/Data/Manager.php </template>
                </Preview>

                <Preview
                    code="
            public function performDataGrid(array $attributes) {
                return $this->onDataGrid($attributes) ?? [];
            }

            public function performDataEditor(array $attributes) {
                return $this->onDataEditor($attributes) ?? [];
            }

            public function performDataPreview(array $attributes) {
                return $this->onDataPreview($attributes) ?? [];
            }

            protected function onDataGrid(array $attributes){
                return [];
            }

            protected function onDataEditor(array $attributes){
                return [];
            }

            protected function onDataPreview(array $attributes){
                return [];
            }
        "
                >
                    <template #header> Clevis/Data/ManagerRaw.php </template>
                </Preview>
            </Example>

            <Example title="Překlady">
                Musíme změnit logiku ohledně parsování překladů. Ve třídě pro správu překladů

                <Preview
                    code="
                public function generateTemplate() {
                    if (file_exists(self::TRANSLATION_FOLDER . 'translations.pot'))
                        unlink(self::TRANSLATION_FOLDER . 'translations.pot');
                    $extractor = new NetteExtractor();
                    $extractor->setupForms()->setupDataGrid();
                    $extractor->setMeta('Language', 'cs_CZ');
                    $extractor->scan([APPLICATION_PATH . '/modules/default', APPLICATION_PATH . '/modules/admin/logic', APPLICATION_PATH . '/modules/admin/models']);

                    // Základní složka, kde budeme hledat soubory .vue
                    $baseDir = '../vue/src';

                    $pattern = '/(?<!\w)_l\(\s*([\'&quot;])(.*?)\1\s*\)/';

                    // Vytvoříme rekurzivní iterátor pro průchod celou složkou
                    $dirIterator = new RecursiveDirectoryIterator($baseDir, RecursiveDirectoryIterator::SKIP_DOTS);
                    $iterator    = new RecursiveIteratorIterator($dirIterator);

                    // Použijeme RegexIterator, který nám nechá projít jen soubory s příponou .vue
                    $regexIterator = new RegexIterator($iterator, '/^.+\.(vue|js)$/i', RecursiveRegexIterator::GET_MATCH);

                    foreach ($regexIterator as $file) {
                        $messages = [];
                        // $file je pole, kde index 0 obsahuje celou cestu k souboru
                        $filePath    = $file[0];
                        $fileContent = file_get_contents($filePath);

                        // Použijeme PREG_OFFSET_CAPTURE, abychom získali i offsety shod
                        preg_match_all($pattern, $fileContent, $matches, PREG_OFFSET_CAPTURE);

                        foreach ($matches[0] as $i => $fullMatch) {
                            // Z offsetu určíme číslo řádku
                            $offset     = $fullMatch[1];
                            $lineNumber = substr_count(substr($fileContent, 0, $offset), &quot;\n&quot;) + 1;
                            // $matches[2][$i][0] obsahuje text uvnitř uvozovek (skupina 2)
                            $translation = $matches[2][$i][0];

                            $messages[] = [
                                'line'     => $lineNumber,
                                'singular' => $translation,
                            ];
                        }
                        $extractor->addMessages($messages, $filePath);
                    }

                    $extractor->save(self::TRANSLATION_FOLDER . 'translations.pot');
                }

                public function updateFromPot($locale) {
                    $compiler = new PoCompiler();
                    $moCompiler = new Compiler();


                    $fileHandler = new FileSystem(self::TRANSLATION_FOLDER . 'translations.pot');
                    $poParser = new Parser($fileHandler);
                    $template  = $poParser->parse();

                    $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
                    $poParser = new Parser($fileHandler);
                    $catalog = $poParser->parse();

                    $t_entries = [];

                    foreach ($template->getEntries() as $t_entry){
                        $t_entries[] = $t_entry->getMsgId();
                        if ($catalog->getEntry($t_entry->getMsgId()) == null) {
                            $entry = new Entry($t_entry->getMsgId());
                            $catalog->addEntry($entry);
                        }
                        $catalog->getEntry($t_entry->getMsgId())->setReference($t_entry->getReference());
                    }
                    foreach ($catalog->getEntries() as $entry) {
                        if (!in_array($entry->getMsgId(), $t_entries))
                            $catalog->removeEntry($entry->getMsgId());
                    }
                    $fileHandler->save($compiler->compile($catalog));
                    $moCompiler->compile(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
                }

                public function getStrings($locale, $onlySPA = false) {
                    $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
                    $poParser = new Parser($fileHandler);
                    $catalog = $poParser->parse();

                    $strings = [];
                    foreach ($catalog->getEntries() as $entry) {
                        if($onlySPA){
                            $foundVue = false;
            
                            $pattern = '/\.(vue|js)(?=:\d+)/i';

                            foreach ($entry->getReference() as $ref) {
                                if (preg_match($pattern, $ref)) {
                                    $foundVue = true;
                                    break;
                                }
                            }

                            if(!$foundVue){
                                continue;
                            }
                        }

                        $strings[md5($entry->getMsgId())] = [
                            'orig' => $entry->getMsgId(),
                            'text' => $entry->getMsgStr()
                        ];
                    }

                    return $strings;
                }
        "
                >
                    <template #header> Clevis/Data/ManagerRaw.php </template>
                </Preview>
            </Example>

            <Example title="Nová verze - alert">
                Pro zapnutí vyskakovacího alertu s upozorněním na novou verzi zbuildované aplikace musíme vložit následující kód do php, ideálně jen pro administraci a přihlášeného uživatele. V CDB je to například v user Bootstrapu

                <Preview
                    code="
                        \Jolanda\Controller\BaseController::initJolandaBuildTime();
                    "
                >
                    <template #header></template>
                </Preview>
            </Example>

            <Example title="Menu - oblíbené">
                Pro zprovoznění oblíbených je potřeba nastavit jolanda config a vytvořit si controller, který obsahuje endpointy pro ukládání a získávání oblibených z databáze.

                <Preview
                    code="
                        class MenuController extends \Jolanda\Controller\MenuController {

                        }

                        // NEBO

                        class MenuController {
                            use \Jolanda\Controller\MenuController;
                        }
                    "
                >
                    <template #header> Příklad controlleru </template>
                </Preview>

                <p class="mt-2">Musíme vytvořit tabulku v DB. Pro to slouží endpoint <code>/init-favorites</code> ve výše vytvořeném controlleru.</p>

                <Preview
                    code='
[MENU]
favorites[enable] = 1
;url adresa controlleru s endpointama (náš vytvořený controller viz. výše)
favorites[url] = "/default/menu"
                    '
                >
                    <template #header> jolanda.ini </template>
                </Preview>
            </Example>
        </template>
    </DocPage>
</template>
