<?php
namespace Jolanda\JsLogger;

use Jolanda\Latte\Latte;
use Monolog\Logger;
use Monolog\Handler\RotatingFileHandler;

class JsLogger
{
    private $logPath;
    private $tempLogPath;
    private $logger;

    public static $ENABLED = false;
    public static $LOG_ACTION = '';
    public static $LOG_ON_DEVELOPMENT = false;

    public function __construct($logPath)
    {
        $this->logPath = $logPath;
        $this->tempLogPath = $logPath . '/temp.log';

        $this->logger = new Logger('js-logger');
        $this->logger->pushHandler(new RotatingFileHandler($this->logPath . '/js-log', 14, Logger::ERROR));
    }

    public function log($logData)
    {
        if(self::isEnabled()){
            $pattern = $this->getLogPattern('daily');
            if (!preg_match($pattern, $logData)) {
                return; // Skip saving the log data if it doesn't match the daily log pattern
            }

            // Ukládání logu do temp souboru
            $logLine = str_replace("\n", " ", $logData) . "\n";
            file_put_contents($this->tempLogPath, $logLine, FILE_APPEND);

            // Ukládání logu do daily souboru pomocí Monolog
            $this->logger->error($logData);
        }
    }

    public function readTempLog(bool $clean = true)
    {
        // Načtení temp logu
        $logData = file($this->tempLogPath, FILE_IGNORE_NEW_LINES);

        // Vyčištění temp logu
        if ($clean) {
            file_put_contents($this->tempLogPath, '');
        }

        return $logData;
    }

    public function readDailyLog(string $file)
    {
        $logData = file($this->logPath . '/' . $file, FILE_IGNORE_NEW_LINES);

        return $logData;
    }


    public function getLogPattern($type)
    {
        if ($type === 'temp') {
            return '/SERVER\[(.*)\] BU\[(.*)\] PATH\[(.*)\] UA\[(.*)\] ERROR: Message: (.*), Source: (.*), Line: (.*), Column: (.*), Error: (.*)/';
        } else if ($type === 'daily') {
            return '/LOG: \[.*\] SERVER\[(.*)\] BU\[(.*)\] PATH\[(.*)\] UA\[(.*)\] ERROR: Message: (.*), Source: (.*), Line: (.*), Column: (.*), Error: (.*)/';
        }
        return '';
    }

    public function parseLog($data, $type)
    {
        $errors = [];
        $pattern = $this->getLogPattern($type);
        foreach ($data as $logLine) {
            // Extrahování informací z logového záznamu
            if (!preg_match($pattern, $logLine, $matches)) {
                continue; // Přeskočení řádků, které neobsahují platný logový záznam
            }
            $server = $matches[1] ?? '';
            $bu = $matches[2] ?? '';
            $path = $matches[3] ?? '';
            $userAgent = $matches[4] ?? '';
            $errorMessage = $matches[5] ?? '';
            $source = $matches[6] ?? '';
            $line = $matches[7] ?? '';
            $column = $matches[8] ?? '';
            $error = $matches[9] ?? '';

            // Odstranění nežádoucí části URL adresy
            $source = str_replace($server . $bu, '', $source);

            // Extrahování parametrů URL
            $urlParams = '';
            if (strpos($source, '?') !== false) {
                list($source, $urlParams) = explode('?', $source, 2);
            }

            // Shromažďování chyb podle zdroje, řádku, sloupce, zprávy a parametrů URL
            $sourceKey = $source . ' [Line:' . $line . ', Column:' . $column . ']';
            if (!isset($errors[$sourceKey][$errorMessage])) {
                $errors[$sourceKey][$errorMessage] = ['count' => 0, 'urls' => [], 'error' => $error, 'params' => $urlParams, 'userAgent' => $userAgent];
            }
            $errors[$sourceKey][$errorMessage]['count']++;
            if (!isset($errors[$sourceKey][$errorMessage]['urls'][$path])) {
                $errors[$sourceKey][$errorMessage]['urls'][$path] = 0;
            }
            $errors[$sourceKey][$errorMessage]['urls'][$path]++;
        }

        return $errors;
    }

    public function parseTempLog($clean = true)
    {
        $data = $this->readTempLog($clean);
        return $this->parseLog($data, 'temp');
    }

    public function parseDailyLog($filePath)
    {
        return $this->parseLog($filePath, 'daily');
    }

    public function format($data){
        // Formátování výstupu
        $output = [];
        foreach ($data as $source => $sourceErrors) {
            foreach ($sourceErrors as $errorMessage => $errorData) {
                $urls = array_map(function ($url, $count) {
                    return "$url (".$count."x)"; // Přidání "x" za počet výskytů URL
                }, array_keys($errorData['urls']), $errorData['urls']);
                $output[] = "$source: $errorMessage ({$errorData['count']}x), Error Details: {$errorData['error']}, URL Params: {$errorData['params']}, User Agent: {$errorData['userAgent']}, URLS[" . implode(', ', $urls) . "]"; // Přidání "x" za počet výskytů chyby
            }
        }

        return $output;
    }

    public function renderReport($clean = true)
    {
        // Načtení dat z temp logu a jejich zpracování
        $data = $this->parseTempLog($clean);

        if(!count($data)){
            return false;
        }
        // Vytvoření instance Latte Engine
        $latte = Latte::getInstance()->getEngine();

        // Nastavení parametrů pro šablonu
        $params = [
            'errors' => $data,
            'serverName' => $_SERVER['DOCUMENT_ROOT'],
        ];

        // Vykreslení šablony a vrácení vyrenderovaného HTML
        return $latte->renderToString(__DIR__ . '/latte/report.latte', $params);
    }

    public static function isEnabled(){
        if(isDevelopment() && self::$LOG_ON_DEVELOPMENT && self::$ENABLED){
            return true;
        }else if(!isDevelopment() && self::$ENABLED){
            return true;
        }
    }

    public static function getSetting(){
        return [
            'ENABLED' => self::$ENABLED,
            'LOG_ACTION' => self::$LOG_ACTION,
            'LOG_ON_DEVELOPMENT' => self::$LOG_ON_DEVELOPMENT,
        ];
    }
}