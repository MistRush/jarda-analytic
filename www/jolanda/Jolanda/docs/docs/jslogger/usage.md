#JsLogger

JsLogger slouží pro zachycení errorů v js consoli prohlížeče. Tyto errory pak posílá na server, kde se ukládájí do log souboru. Chyby se ukládájí taky do temp souboru, který pak lze využít pro poslání hromadného mailu s notifikací. 

##Použití v jolandě

V jolandě je už potřebný javasctip linknutý do layoutu. Stačí jen přidat nastavení loggeru.
```php
\Jolanda\JsLogger\JsLogger::$ENABLED = true; //povolení loggeru
\Jolanda\JsLogger\JsLogger::$LOG_ACTION = '/default/ajax/js-log'; //url cesta na kterou se budou posílat logy
\Jolanda\JsLogger\JsLogger::$LOG_ON_DEVELOPMENT = true; //povolení logu i v režimu development
```

Toto nastavení vložímu kdekoliv v kódu, ale musí být před získáním coreParams v BaseControlleru. 

Pro použití v jolandě a zároveň i na frontu, je nejlepší přidat si nastaví přímo do Bootstrapu aplikace.

```php
//Bootstrap.php
protected function _initJsLogger(){
    \Jolanda\JsLogger\JsLogger::$ENABLED = true;
    \Jolanda\JsLogger\JsLogger::$LOG_ACTION = '/default/ajax/js-log';
    \Jolanda\JsLogger\JsLogger::$LOG_ON_DEVELOPMENT = true;
}

```

##Použití na frontu

Na frontu si musíme nalinkovat js soubor, který se stará o logování. 

```html
    {if $JsLogger['ENABLED']}
        <script src="{$basePath}/jolanda/front/js/js-logger/dist/JsLogger.js?{filemtime($_SERVER['DOCUMENT_ROOT']._bu().'/jolanda/front/js/js-logger/dist/JsLogger.js')}"></script>
    {/if}
```

Do BaseParams si přidáme JsLogger
```php
$baseParams["JsLogger"] = JsLogger::getSetting();
```

Nastavíme JsLogger. Pokud už je nastavený v bootstrapu, tak se nemusí nic nastavovat. Jinak viz výše.



##Logovací url

Musíme vytvořit action, která bude logovat. 

Example:
```php
//cestu k této actioně nastavíme do JsLogger::$LOG_ACTION
public function jsLogAction(): void
{
    $jsLogger = new \Jolanda\JsLogger\JsLogger('../data/log/js'); //vytvoří logger (loguje do složky js)
    $jsLogger->log($this->getRequest()->getRawBody()); //uloží log
}
```


##Cron na email notifikaci

Vytvoříme si action, která bude odesílat chyby které se nahromadily do temp souboru od posledního spuštění cronu. Cron si pak spustíme v libovolném intervalu.

Example:
```php
public function jsErrorReportAction(){
    $jsLogger = new \Jolanda\JsLogger\JsLogger('../data/log/js'); //vytvoří logger
    $report = $jsLogger->renderReport(); //vytvoří report

    if(!$report)
        return;

    Default_Logic_EmailTemplate::sendSimpleEmail('EcuServis JS Error', $report, DEVELOPERS_ERROR); //pošle mail
}
```

