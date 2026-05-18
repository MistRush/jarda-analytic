# Přidání Tracy panelů do projektu
Tyto úpravy přidávají panely do Tracy a umožňují sledování a ladění aplikace.

## 1. Odstranění reference na dosavadní rozšíření
Projděte kód a odstraňte veškeré reference na dosavadní rozšíření.

> Z pravidla by vše mělo být v application/modules/common/extensions

## 2. Inicializace panelů
V místě, kde byly dosud přidávány panely (např. BootstrapApp nebo jiné), nahraďte všechny panely metodou: 
`\Jolanda\Tracy\Extensions\Extensions::addAllPanels();`

Metoda, ve které se panely přidávají by měla vapadat obdobně.
```php

    /**
     * Init error handling
     */
    protected function _initErroHandling() {
        // Enable debugging
        if (Clevis_Helper::isDevelopmentEnvironment()) {
            //Clevis_Zend_Debug::enable();
            Debugger::enable(Debugger::DEVELOPMENT, null); // aktivujeme Laděnku
            Debugger::getBar()->addPanel(\common\extensions\SqlDebuggerPanel::getInstance());
            Debugger::getBar()->addPanel(\common\extensions\RelationDebuggerPanel::getInstance());
            Debugger::getBar()->addPanel(\common\extensions\RequestDebuggerPanel::getInstance());
            Debugger::getBar()->addPanel(\common\extensions\ElasticaQueryDebuggerPanel::getInstance());
            Doctrine_Manager::getInstance()->setListener(new \common\extensions\DoctrineListener());
            Debugger::$maxDepth = 5;
            Debugger::$showBar = true;
            Debugger::$scream = false;
            Debugger::$strictMode = true;
            Zend_Controller_Front::getInstance()->throwExceptions(true);

        } if (Clevis_Helper::isDevelopmentEnvironment() == false) {
            // Shutdown handler
            register_shutdown_function('Clevis_BootstrapApp::production_handle_shutdown');
            // Error handler
            set_error_handler('Clevis_BootstrapApp::production_handle_error', E_ALL | E_STRICT);
        }
    }
```

Po ůpravach:
```php

    /**
     * Init error handling
     */
    protected function _initErroHandling() {
        // Enable debugging
        if (Clevis_Helper::isDevelopmentEnvironment()) {
            //Clevis_Zend_Debug::enable();
            Debugger::enable(Debugger::DEVELOPMENT, null); // aktivujeme Laděnku
            \Jolanda\Tracy\Extensions\Extensions::addAllPanels();

            Debugger::$maxDepth = 5;
            Debugger::$showBar = true;
            Debugger::$scream = false;
            Debugger::$strictMode = true;
            Zend_Controller_Front::getInstance()->throwExceptions(true);

        } if (Clevis_Helper::isDevelopmentEnvironment() == false) {
            // Shutdown handler
            register_shutdown_function('Clevis_BootstrapApp::production_handle_shutdown');
            // Error handler
            set_error_handler('Clevis_BootstrapApp::production_handle_error', E_ALL | E_STRICT);
        }
    }
```

## 3. Úprava `Clevis_Zend_Dispatcher::dispatch()`
Do metody `Clevis_Zend_Dispatcher::dispatch()` před `parent::dispatch()` přidejte `Jolanda\Tracy\Extensions\Extensions::addRequestListener();`

Viz následujíci ukázka:
```php
    /**
     * Dispatch
     * 
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @return void
     */
    public function dispatch(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response)
    {
        ...

        \Jolanda\Tracy\Extensions\Extensions::addRequestListener();

        // Dispatch
        parent::dispatch($request, $response);

    }
```

---

## Doporučené/Dobrovolné Úpravy
Tyto doporučené úpravy umožňují detailnější sledování specifických částí kódu, což usnadňuje identifikaci a řešení problémů v aplikaci a jejím chování.

### Data manageru v "Request" panelu:
Do `Clevis_Zend_Controller_DataAction::dataListAction()` po `$this->renderData()` přidejte:
```php
\Jolanda\Tracy\Extensions\Extensions::setManagerData($data);
```

### Relations pro "Relation" panel:
Do `Doctrine_Record::_get()` v podmínce `if ($load)` přidejte:
```php
\Jolanda\Tracy\Extensions\RelationDebuggerPanel::getInstance()->addRecord($this, $fieldName);
```

### Dotazy pro "ElasticQuery" panel:
Do `ElasticaQueryBuilder::getAggregations()` přidejte:
```php
\Jolanda\Tracy\Extensions\ElasticaQueryDebuggerPanel::getInstance()->addQuery($query);;
```

### Zobrazení šablon a jejich proměnných v "LattePanel":
 _Tato úprava se vztahuje pouze na místa, kde pro vykreslení není využitý `\Jolanda\Controller\BaseController`_

Do BaseControlleru/místa, kde se rendruje Latte, přidejte před samotný render (`\Latte\Engine::render()` nebo `\Latte\Engine::renderToString()`):
```php
// $this->latte je instance třídy \Latte\Engine
\Jolanda\Tracy\Extensions\Extensions::initializeLatte($this->latte);
```

### Nastavení limitu paměti pro "SqlDebuggerPanel":
Před/Po `\Jolanda\Tracy\Extensions\Extensions::addAllPanels()` přidejte:
```php
\Jolanda\Tracy\Extensions\SqlDebuggerPanel::$limitSizeMB = 1; // Velikost v MB (výchozí: 1MB)
```