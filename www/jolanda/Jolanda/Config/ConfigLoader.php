<?php

namespace Jolanda\Config;

use Exception;

class ConfigLoader
{

    public const DEFAULT_CONFIG_FILE = 'jolanda.ini';

    private static ?string $filePath = null;

    private static ?string $fileName = null;

    /**
     * @var Configuration
     */
    private static ?array $config = null;

    public static function getConfig($name, $required = true): null|string|array
    {
        if (self::$config === null) {
            self::loadConfigurationFromFile($required);
        }

        /*if (self::$config !== null && array_key_exists($name, self::$config))
            return self::$config[$name];
        else if($required){
            throw new Exception("Setting '" . $name . "' does not exist in '" . self::getFile() . "' ");
        }*/

        if (!isset(self::$config[$name]) && $required) {
            throw new Exception("Setting '" . $name . "' does not exist in '" . self::getFile() . "' ");
        }

        return self::$config[$name] ?? null;
    }


    public static function loadConfigurationFromFile($required = false): void
    {
        if (!self::$filePath) {
            self::$filePath = realpath('../application/configs');
        }

        if (!self::$fileName) {
            self::$fileName = static::DEFAULT_CONFIG_FILE;
        }

        if (self::isFileExists($required)) {
            $configuration = parse_ini_file(self::getFile(), true);
            self::$config = $configuration;
        } else {
            if($required)
                throw new Exception("Parsing configuration file " . self::getFile() . " failed.");
        }
    }

    public static function isFileExists($required = false): bool
    {
        if (!file_exists(self::getFile())) {
            if($required)
                throw new Exception("Configuration file " . self::getFile() . " doesn't exist.");

            return false;
        } else {
            return true;
        }
    }

    public static function getFile(): string
    {
        return self::$filePath . '/' . self::$fileName;
    }

    /**
     * @return string
     */
    public static function getFilePath(): string
    {
        return self::$filePath;
    }

    /**
     * @param string $filePath
     */
    public static function setFilePath(string $filePath): void
    {
        self::$filePath = $filePath;
    }

    /**
     * @return string
     */
    public static function getFileName(): string
    {
        return self::$fileName;
    }

    /**
     * @param string $fileName
     */
    public function setFileName(string $fileName): void
    {
        self::$fileName = $fileName;
    }

}