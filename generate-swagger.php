<?php

use OpenApi\Util;

set_include_path(get_include_path() . PATH_SEPARATOR . __DIR__ . '/library');
set_include_path(get_include_path() . PATH_SEPARATOR . __DIR__ . '/library/Zend');

$apiName = 'HadexApi';
$apiDocFolderName = 'hadex-api';


require 'library/autoload.php';
require 'library/Zend/Loader/Autoloader.php';
require 'library/Zend/Controller/Action.php';
require 'library/zircote/swagger-php/src/Generator.php';
require 'library/Clevis/Zend/Controller/Action.php';
require 'application/modules/common/controllers/'.$apiName.'Controller.php';


function autoloadDirectory($directory): void {
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($files as $file) {
        if ($file->isFile() && pathinfo($file->getFilename(), PATHINFO_EXTENSION) === 'php') {
            require_once $file->getRealPath();
        }
    }
}

// Načtení všech souborů z anotací
autoloadDirectory(__DIR__ . '/application/modules/common/logic/'.$apiName.'/Annotations');

$exclude = ['tests'];
$pattern = $apiName.'*.php';
$patternAnnotations = '*Annotations.php';
$schemaAnnotations = '*.php';

$openapi = \OpenApi\Generator::scan([
    Util::finder(__DIR__.'/application/modules/common/controllers', $exclude, $pattern),
    Util::finder(__DIR__.'/application/modules/common/logic/'.$apiName.'/Annotations/schemas', $exclude, $schemaAnnotations),
    Util::finder(__DIR__.'/application/modules/common/logic/'.$apiName.'/Annotations', $exclude, $patternAnnotations),
    ]);

$file1 = __DIR__.'/application/modules/common/logic/'.$apiName.'/Documentation/swagger.json';
$file2 = __DIR__.'/www/docs/'.$apiDocFolderName.'/swagger.json';
file_put_contents($file1, $openapi->toJson());
file_put_contents($file2, $openapi->toJson());
