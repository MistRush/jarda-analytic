<?php

namespace common\logic;

use Exception;

/**
 * Class for reading configuration
 *
 * @author Pavel Cihlar
 */
class Configs {

    /**
     * @var array Configuration
     */
    private static array $config = array();

    /**
     * @return string default file name to config.ini configuration file
     */
    private static function getDefaultConfigFileName(): string {
        return APPLICATION_PATH . '/configs/config.ini';
    }

    /**
     * @return array|false|string
     */
    public static function getConfigFileName(): bool|array|string {
        $configFileName = getenv('APPLICATION_CONFIG');
        if ( $configFileName != null ) {
            if ( !self::isPathAbsolute($configFileName) )
                $configFileName = APPLICATION_PATH . '/' . $configFileName;

            if ( !file_exists($configFileName) )
                throw new Exception("Configuration file $configFileName doesn't exist.");

            return $configFileName;
        }

        return self::getDefaultConfigFileName();
    }

    public static function loadConfiguration() {
        $defaultConfigurationFile = self::getDefaultConfigFileName();
        $configurationFile = self::getConfigFileName();
        if ( $configurationFile != false && $defaultConfigurationFile != $configurationFile ) {
            self::loadConfigurationFromFile($defaultConfigurationFile);
            self::loadConfigurationFromFile($configurationFile);
        } else {
            self::loadConfigurationFromFile($defaultConfigurationFile);
        }
    }

    public static function loadVue(): ?array
    {
        $development = self::getConfig('vue.development');
        $mainDevelopmentPath = self::getConfig('vue.mainDevelopmentPath');
        $buildPathJs = self::getConfig('vue.buildPathJs');
        $buildPathCss = self::getConfig('vue.buildPathCss');
        if ( $development == null || $mainDevelopmentPath == null || $buildPathJs == null || $buildPathCss == null)
            return null;

        return [
            'development' => $development,
            'mainDevelopmentPath' => $mainDevelopmentPath,
            'buildPathJs' => $buildPathJs,
            'buildPathCss' => $buildPathCss
        ];
    }

    /**
     * @param string $fileName
     */
    public static function loadConfigurationFromFile(string $fileName) {
        if ( file_exists($fileName) == false )
            throw new Exception("Configuration file $fileName doesn't exist.");

        $configuration = parse_ini_file($fileName);
        if ( $configuration == false )
            throw new Exception("Parsing configuration file $fileName failed.");

        self::$config = array_merge(self::$config, $configuration);
    }

    /**
     * @param string $name
     * @return null
     */
    public static function getConfig(string $name) {
        if ( self::$config != null && array_key_exists($name, self::$config) )
            return self::$config[$name];

        return null;
    }

    /**
     * @return string|null path to "files" folder for storing data files WITH trailing backslash
     */
    public static function getFilesPath(): ?string {
        $filesPath = self::getConfig('files.path');
        if ( $filesPath == null )
            $filesPath = 'files/';

        if ( self::isPathAbsolute($filesPath))
            return $filesPath;
        else
            return self::getAbsolutePathFromRelative($filesPath);
    }

    /**
     * @return string ath to "files/images" for storing image files WITH trailing backslash
     */
    public static function getImagePath(): string {
        return self::getFilesPath() . 'images/';
    }

    /**
     * @return string version of application (e.g. 6.0.0)
     */
    public static function getVersion(): string {
        $version = self::getConfig('version');
        if ( $version == null )
            throw new Exception('No configuration \'version\' has been specified.');

        return $version;
    }

    /**
     * @param $path
     * @return true if given $path is relative,false otherwise
     */
    public static function isPathAbsolute($path): bool {
        return str_starts_with($path, '/') || substr($path, 1, 1) == ':';
    }

    /**
     * @param $relativePath
     * @return string absolute path from given $relativePath
     */
    public static function getAbsolutePathFromRelative($relativePath): string {
        return APPLICATION_PATH . '/../public/' . $relativePath;
    }

    /**
     * @return string where is php executable on server
     */
    public static function getPhpExecutable(): string {
        return self::getConfig('phpexecutable') ?? 'php';
    }

    public static function isSourceApiEnpoint(): bool {
        return self::getConfig('api.isSourceEndpoint');
    }
    
    /**
     * @return string url to smtp server
     */
    public static function getSmtpServer(): string {
        $smtpServer = self::getConfig('smtp.server');
        if ($smtpServer == null)
            throw new Exception('No configuration \'smtp.server\' has been specified.');

        return $smtpServer;
    }

    /**
     * @return array of API credentials
     * @throws Exception
     */
    public static function getApiPPLCredentials(): array {
        $apiUsername = self::getConfig('apiPPL.username');
        $apiPassword = self::getConfig('apiPPL.password');
        $apiCustomerID = self::getConfig('apiPPL.customerID');
        if ($apiUsername == null)
            throw new Exception('No configuration \'apiPPL.username\' has been specified.');

        return ['Username'=>$apiUsername, 'Password' => $apiPassword, 'CustomerID' => $apiCustomerID];
    }

    /**
     * @return array of API credentials
     * @throws Exception
     */
    public static function getApiCredentials(): array {
        $apiUsername = self::getConfig('api.username');
        $apiPassword = self::getConfig('api.password');
        if ($apiUsername == null)
            throw new Exception('No configuration \'api.username\' has been specified.');

        return ['Username'=>$apiUsername, 'Password' => $apiPassword];
    }

    /**
     * @return array of API credentials
     * @throws Exception
     */
    public static function getEcomailApiKey(): string {
        $apiKey = self::getConfig('ecomail.apiKey');
        if ($apiKey == null)
            throw new Exception('No configuration \'ecomail.apiKey\' has been specified.');

        return $apiKey;
    }

    /**
     * @return array of API credentials
     * @throws Exception
     */
    public static function getHasherSecretKey(): string {
        $apiKey = self::getConfig('hasher.secretKey');
        if ($apiKey == null)
            throw new Exception('No configuration \'hasher.secretKey\' has been specified.');

        return $apiKey;
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getEcomailBasicApiEndpoint(): string {
        $apiEndpoint = self::getConfig('ecomail.apiEndpoint');
        if ($apiEndpoint == null)
            throw new Exception('No configuration \'api.endpoint\' has been specified.');

        return $apiEndpoint;
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getApiBasicEndpoint(): string {
        $apiEndpoint = self::getConfig('api.endpoint');
        if ($apiEndpoint == null)
            throw new Exception('No configuration \'api.endpoint\' has been specified.');

        return $apiEndpoint;
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getApiTokenSecret(): string {
        $apiTokenSecret = self::getConfig('api.tokenSecret');
        if ($apiTokenSecret == null)
            throw new Exception('No configuration \'api.endpoint\' has been specified.');

        return $apiTokenSecret;
    }

    public static function getTokenizerTokenSecret(): string {
        $apiTokenSecret = self::getConfig('tokenizer.secretKey');
        if ($apiTokenSecret == null)
            throw new Exception('No configuration \'api.endpoint\' has been specified.');

        return $apiTokenSecret;
    }


    /**
     * @return string|null name to smtp name
     */
    public static function getSmtpName(): ?string {
        return self::getConfig('smtp.name');
    }

    /**
     * @return string|null name to smtp password
     */
    public static function getSmtpPassword(): ?string {
        return self::getConfig('smtp.password');
    }

    /**
     * @return string|null name to smtp name
     */
    public static function getSmtpPort(): ?string {
        return self::getConfig('smtp.port');
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getTransactionMailImapHost(): string {
        return self::getConfig('transactionMail.imapServer');
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getTransactionMailImapLogin(): string {
        return self::getConfig('transactionMail.imapLogin');
    }

    /**
     * @return string
     * @throws Exception
     */
    public static function getTransactionMailImapPassword(): string {
        return self::getConfig('transactionMail.imapPassword');
    }

    public static function getEncryptionKey()
    {
        $encryptionKey = self::getConfig('encryptionKey');
        if ($encryptionKey == null)
            throw new Exception('No configuration \'encryptionKey\' has been specified.');

        return $encryptionKey;
    }

    public static function getEncryptionIV()
    {
        $encryptionIV = self::getConfig('encryptionIV');
        if ($encryptionIV == null)
            throw new Exception('No configuration \'encryptionIV\' has been specified.');

        return $encryptionIV;
    }
}