<?php
use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use Tracy\Debugger;
use user\logic\UserSettings;

/** Nullstring contant */
define('NULLSTRING', '{nullstring}');

/* Align contant */
const ALIGN_LEFT = 'left';
const ALIGN_CENTER = 'center';
const ALIGN_RIGHT = 'right';

/** Vertical align */
const ALIGN_TOP = 'top';
const ALIGN_MIDDLE = 'middle';
const ALIGN_BOTTOM = 'bottom';

/** Type of columns */
const COLUMN_ID = 1;
const COLUMN_TEXT = 2;
const COLUMN_NUMBER = 4;
const COLUMN_CURRENCY = 8;
const COLUMN_BOOL = 16;
const COLUMN_DATE = 32;
const COLUMN_TIME = 64;
const COLUMN_DATETIME = 65;
const COLUMN_ENUM = 128;
const COLUMN_ENTITY = 256;
const COLUMN_CUSTOM = 512;
const COLUMN_CHECKBOX = 1040;
const COLUMN_EDITBOX = 2048;
const COLUMN_COMBOBOX = 4096;
const FILTER_ENABLE = 8192;
const FILTER_DISABLE = 16384;
const COLUMN_COUNTER = 32768;
const COLUMN_LONGTEXT = 4194304;

/** Validator Types */
const VALIDATOR_NUMERIC = 'numeric';
const VALIDATOR_FLOATING_POINT = 'floating-point';
const VALIDATOR_CURRENCY = 'currency';
const VALIDATOR_EMAIL = 'email';
const VALIDATOR_ZIP_CODE = 'zip-code';
const VALIDATOR_TIME = 'time';

/** Checkbox States */
const UNCHECKED = 0;
const CHECKED = 1;
const UNCHECKED_DISABLED = 2;
const CHECKED_DISABLED = 3;
const WITHOUT_CHECKBOX = 4;

/** Store Mode */
const STORE_MODE_READ = 'read';
const STORE_MODE_WRITE = 'write';

/** Tooltip Dialog Delay */
const TOOLTIP_DELAY = 1000;

/**
 * Placeholder
 *
 * @param string name
 */
function placeholder($name) {
    return Zend_View_Helper_Placeholder_Registry::getRegistry()->getContainer($name);
}

/**
 * Placeholder script
 */
$container = null;
$containerStack = null;

function placeholderStart($name) {
    global $container;
    global $containerStack;
    if ($containerStack == null)
        $containerStack = array();
    if ($container != null)
        array_push($containerStack, $container);
    $container = placeholder($name);
    $container->captureStart(Zend_View_Helper_Placeholder_Container_Abstract::SET);
}

function placeholderEnd() {
    global $container;
    global $containerStack;
    if ($container == null)
        die('');
    $container->captureEnd();
    if (count($containerStack) > 0)
        $container = array_pop($containerStack);
    else
        $container = null;
}

/**
 * Get array item
 */
function array_get_item($array, $key = 0, $default = false) {
    if (is_array($array) === true) {
        if (is_array($key) === true) {
            foreach ($key as $value) {
                if (array_key_exists($value, $array) === true) {
                    $array = $array[$value];
                } else {
                    return $default;
                }
            }

            return $array;
        } else if (array_key_exists($key, $array) === true) {
            return $array[$key];
        }
    }

    return $default;
}

function array_remove_by_key(&$array, $key) {
    if (count($array) == 0 || !is_array($array))
        return false;
    if (!array_key_exists($key, $array))
        return $array;
    foreach ($array as $_key => $value) {
        if ($key == $_key)
            unset($array[$_key]);
    }
}

function array_remove(&$array, $val) {
    if (count($array) == 0 || !is_array($array))
        return false;
    if (!in_array($val, $array))
        return $array;
    foreach ($array as $key => $value) {
        if ($value == $val)
            unset($array[$key]);
    }
}

// ip getter
function getRealIpAddr() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {  //check ip from share internet
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {  //to check ip is pass from proxy
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    return $ip;
}

function aasort (&$array, $key) {
    $sorter = array();
    $ret = array();
    reset($array);
    foreach ($array as $ii => $va) {
        $sorter[$ii] = $va[$key];
    }
    asort($sorter);
    foreach ($sorter as $ii => $va) {
        $ret[$ii] = $array[$ii];
    }
    $array = $ret;
}


function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

function array_remove_reference(&$array, &$val) {
    if (count($array) == 0 || !is_array($array))
        return false;
    if (!in_array($val, $array))
        return $array;
    foreach ($array as $key => $value) {
        if ($value == $val)
            unset($array[$key]);
    }
}

function echo_to_file($string, $file, $append = false) {
    $mode = 'w';
    if ($append)
        $mode = 'a';
    $fh = fopen($file, $mode) or die('Can\'t open file!');
    fwrite($fh, $string . PHP_EOL);
    fclose($fh);
}

function var_dump_to_file($variable, $file = null, $append = false) {
    if ($file == null)
        $file = 'dump.txt';

    // Dump to string
    ob_start();
    var_dump($variable);
    $result = ob_get_contents();
    ob_end_clean();

    echo_to_file($result, $file, $append);
}

function get_time_ms() {
    return microtime(1) * 1000;
}

function format_range_ms($start, $end) {
    return '<b>Time: ' . round($end - $start, 2) . ' ms</b><br>';
}

function dayName($day) {
    switch ($day) {
        case "Monday":
            return "Pondělí";
        case "Tuesday":
            return "Úterý";
        case "Wednesday":
            return "Středa";
        case "Thursday":
            return "Čtvrtek";
        case "Friday":
            return "Pátek";
        case "Saturday":
            return "Sobota";
        case "Sunday":
            return "Neděle";
    }
}

function formatDate($date) {
    if ($date) {
        $dateArray = explode('-', $date);
        if ($dateArray[2] < 10)
            $dateArray[2] = substr($dateArray[2], -1);

        if ($dateArray[1] < 10)
            $dateArray[1] = substr($dateArray[1], -1);

        return $dateArray[2] . "." . $dateArray[1] . "." . $dateArray[0];
    }
}

function reFormatDate($date) {
    if ($date) {
        $dateArray = explode('.', $date);
        return $dateArray[2] . "-" . $dateArray[1] . "-" . $dateArray[0];
    }
}



function boolToWord($value) {
    if ($value == '1') {
        return 'ano';
    } else {
        return 'ne';
    }
}

function yesNoDunnoToWord($value) {
    if ($value == 'yes') {
        return 'ano';
    } else if ($value == 'no') {
        return 'ne';
    } else if ($value == 'dunno') {
        return 'nevím';
    }
}

function isOdd($value) {
    return $value & 1;
}

function dojoIdentityData($dataIdentity, $dataItems, $dataNumRows = null) {

    $data = array();

    if (is_array($dataIdentity)) {
        if (count($dataIdentity == 1)) {
            $data["identifier"] = $dataIdentity[0];
        }
    } else {
        $data["identifier"] = $dataIdentity;
    }

    if (is_array($dataItems))
        $data["items"] = $dataItems;
    else
        $data["items"] = $dataItems->toArray();

    if ($dataNumRows != null)
        $data["numRows"] = $dataNumRows;
    return Zend_Json::encode($data);
}

// image resizer
function resizer($filename, $copypath, $MaxWidth, $MaxHeight) {
    list($OrigWidth, $OrigHeight) = getimagesize($filename);

    if ($MaxWidth == 0)
        $MaxWidth = $OrigWidth;
    if ($MaxHeight == 0)
        $MaxHeight = $OrigHeight;

    $pw = $OrigWidth / $MaxWidth;
    $ph = $OrigHeight / $MaxHeight;

    if ($pw > $ph)
        $p = $pw;
    else
        $p = $ph;

    if ($p < 1)
        $p = 1;

    $NewWidth = (int) $OrigWidth / $p;
    $NewHeight = (int) $OrigHeight / $p;

    $image_p = imagecreatetruecolor($NewWidth, $NewHeight);
    $image = imagecreatefromjpeg($filename);

    imagecopyresampled($image_p, $image, 0, 0, 0, 0, $NewWidth, $NewHeight, $OrigWidth, $OrigHeight);
    imagejpeg($image_p, $copypath, 100);
}

function png2jpg($originalFile, $outputFile, $quality) {
    $input = imagecreatefrompng($originalFile);
    list($width, $height) = getimagesize($originalFile);
    $output = imagecreatetruecolor($width, $height);
    $white = imagecolorallocate($output,  255, 255, 255);
    imagefilledrectangle($output, 0, 0, $width, $height, $white);
    imagecopy($output, $input, 0, 0, 0, 0, $width, $height);
    imagejpeg($output, $outputFile);
}

function gif2jpg($originalFile, $outputFile) {
    $image = imagecreatefromgif($originalFile);
    imagejpeg($image, $outputFile);
    imagedestroy($image);
}

function utf2ascii($text) {
    $return = Str_Replace(
        Array("á", "č", "ď", "é", "ě", "í", "ľ", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž", "Á", "Č", "Ď", "É", "Ě", "Í", "Ľ", "Ň", "Ó", "Ř", "Š", "Ť", "Ú", "Ů", "Ý", "Ž"), Array("a", "c", "d", "e", "e", "i", "l", "n", "o", "r", "s", "t", "u", "u", "y", "z", "A", "C", "D", "E", "E", "I", "L", "N", "O", "R", "S", "T", "U", "U", "Y", "Z"), $text);
    $return = StrToLower($return);
    return $return;
}

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function xml2array($contents, $get_attributes = 1, $priority = 'tag') {
    if (!$contents)
        return array();

    if (!function_exists('xml_parser_create')) {
        return array();
    }

    $parser = xml_parser_create('');
    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8");
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1);
    xml_parse_into_struct($parser, trim($contents), $xml_values);
    xml_parser_free($parser);

    if (!$xml_values)
        return;

    $xml_array = array();
    $parents = array();
    $opened_tags = array();
    $arr = array();

    $current = &$xml_array;

    $repeated_tag_index = array();
    foreach ($xml_values as $data) {
        unset($attributes, $value);

        extract($data);

        $result = array();
        $attributes_data = array();

        if (isset($value)) {
            if ($priority == 'tag')
                $result = $value;
            else
                $result['value'] = $value;
        }

        //Set the attributes too.
        if (isset($attributes) and $get_attributes) {
            foreach ($attributes as $attr => $val) {
                if ($priority == 'tag')
                    $attributes_data[$attr] = $val;
                else
                    $result['attr'][$attr] = $val;
            }
        }

        if ($type == "open") {
            $parent[$level - 1] = &$current;
            if (!is_array($current) or ( !in_array($tag, array_keys($current)))) {
                $current[$tag] = $result;
                if ($attributes_data)
                    $current[$tag . '_attr'] = $attributes_data;
                $repeated_tag_index[$tag . '_' . $level] = 1;

                $current = &$current[$tag];
            } else {

                if (isset($current[$tag][0])) {
                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;
                    $repeated_tag_index[$tag . '_' . $level] ++;
                } else {
                    $current[$tag] = array($current[$tag], $result);
                    $repeated_tag_index[$tag . '_' . $level] = 2;

                    if (isset($current[$tag . '_attr'])) {
                        $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                        unset($current[$tag . '_attr']);
                    }
                }
                $last_item_index = $repeated_tag_index[$tag . '_' . $level] - 1;
                $current = &$current[$tag][$last_item_index];
            }
        } elseif ($type == "complete") {
            if (!isset($current[$tag])) {
                $current[$tag] = $result;
                $repeated_tag_index[$tag . '_' . $level] = 1;
                if ($priority == 'tag' and $attributes_data)
                    $current[$tag . '_attr'] = $attributes_data;
            } else {
                if (isset($current[$tag][0]) and is_array($current[$tag])) {

                    $current[$tag][$repeated_tag_index[$tag . '_' . $level]] = $result;

                    if ($priority == 'tag' and $get_attributes and $attributes_data) {
                        $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                    }
                    $repeated_tag_index[$tag . '_' . $level] ++;
                } else {
                    $current[$tag] = array($current[$tag], $result);
                    $repeated_tag_index[$tag . '_' . $level] = 1;
                    if ($priority == 'tag' and $get_attributes) {
                        if (isset($current[$tag . '_attr'])) {

                            $current[$tag]['0_attr'] = $current[$tag . '_attr'];
                            unset($current[$tag . '_attr']);
                        }

                        if ($attributes_data) {
                            $current[$tag][$repeated_tag_index[$tag . '_' . $level] . '_attr'] = $attributes_data;
                        }
                    }
                    $repeated_tag_index[$tag . '_' . $level] ++;
                }
            }
        } elseif ($type == 'close') {
            $current = &$parent[$level - 1];
        }
    }

    return($xml_array);
}

function createFileName($strURL, $strSpace = '-', $boolReturnLower = true) {
    $strConvertURL = '';

    if (empty($strURL) == false) {
        // defined chars to converting from special char to clea char
        $arrSpecialChars = array('á', 'ä', 'č', 'ď', 'é', 'ě', 'í', 'ĺ', 'ľ', 'ň', 'ó', 'ô', 'ö', 'ŕ', 'š', 'ť', 'ú', 'ů', 'ü', 'ý', 'ř', 'ž', 'Á', 'Ä', 'Č', 'Ď', 'É', 'Ě', 'Í', 'Ĺ', 'Ľ', 'Ň', 'Ó', 'Ô', 'Ö', 'Ŕ', 'Š', 'Ť', 'Ú', 'Ů', 'Ü', 'Ý', 'Ř', 'Ž');
        $arrCleanChars = array('a', 'a', 'c', 'd', 'e', 'e', 'i', 'l', 'l', 'n', 'o', 'o', 'o', 'r', 's', 't', 'u', 'u', 'u', 'y', 'r', 'z', 'A', 'A', 'C', 'D', 'E', 'E', 'I', 'L', 'L', 'N', 'O', 'O', 'O', 'R', 'S', 'T', 'U', 'U', 'U', 'Y', 'R', 'Z');

        // strip whitespace (or other characters) from the beginning and end of a string
        $strURL = trim($strURL);
        // apply space
        $strURL = str_replace(' ', $strSpace, $strURL);
        // apply converting
        $strURL = str_replace($arrSpecialChars, $arrCleanChars, $strURL);

        // remote all other characters
        for ($i = 0; $i <= strlen($strURL); $i++) {
            $strCharOfURL = substr($strURL, $i, 1);
            $charValue = ord($strCharOfURL);

            if (($charValue > 47 && $charValue < 58) || ($charValue > 64 && $charValue < 91) || ($charValue > 96 && $charValue < 123) || ($strCharOfURL == $strSpace)) {
                $strConvertURL .= $strCharOfURL;
            }
        }

        // lower
        if ($boolReturnLower == true) {
            $strConvertURL = strtolower($strConvertURL);
        }
    }

    // return result
    return $strConvertURL;
}

/* creates a compressed zip file */

function create_zip($files = array(), $destination = '', $overwrite = false) {
    //if the zip file already exists and overwrite is false, return false
    if (file_exists($destination) && !$overwrite) {
        return false;
    }
    //vars
    $valid_files = array();
    //if files were passed in...
    if (is_array($files)) {
        //cycle through each file
        foreach ($files as $file => $relative_path) {
            //make sure the file exists
            if (file_exists($file)) {
                $valid_files[$file] = $relative_path;
            }
        }
    }
    //if we have good files...
    if (count($valid_files)) {
        //create the archive
        $zip = new ZipArchive();
        if ($zip->open($destination, $overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
            return false;
        }
        //add the files
        foreach ($valid_files as $file => $relative_path) {
            $relative_path = str_replace("\\", '/', $relative_path);
            $zip->addFile($file, $relative_path);
        }
        //debug
        //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
        //close the zip -- done!
        $zip->close();

        //check to make sure the file exists
        return file_exists($destination);
    } else {
        return false;
    }
}

/**
 * Create unique temporary directory in specified $dir.
 *
 * @param $dir
 * @param string $prefix
 * @param int $mode
 * @return created directory path
 */
function tempdir($dir, $prefix = '', $mode = 0700) {
    if (substr($dir, -1) != '/') {
        $dir .= '/';
    }
    do {
        $path = $dir . $prefix . mt_rand(0, 9999999);
    } while (!mkdir($path, $mode));
    return $path;
}

function isIkpoCzVersion() {
    $actual_link = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

    if (strpos($actual_link, 'ikpo.cz') !== false) {
        return true;
    } else {
        return false;
    }
}

function translate(string $string, string $locale = null){
    return Default_Logic_Translation::getInstance()->translate($string, $locale);
}

/* zf dump */
function dmp($var) {
    Zend_Debug::dump($var);
}

/* tracy bar dump */
function bdmp($var) {
    Debugger::barDump($var);
}

/* tracy dump */
function tdmp($var, $name = false) {
    if ($name) {
        $dbt=debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS,1);
        $lines = file($dbt[0]['file']);//file in to an array
        $line = $lines[$dbt[0]['line']-1];
        preg_match('/\((.*)\)/', $line, $find);
        Debugger::dump(explode(',', $find[1])[0] . ':');
    }
    Debugger::dump($var);
}

/* tracy firelogger */
function fdmp($var) {
    Debugger::fireLog($var);
}

function _bu() {
    return Zend_Controller_Front::getInstance()->getBaseUrl();
}

function fu($productImage, $size, $fileKey = 'file') {
    return Common_Model_File::getFileUrl($productImage, $size, $fileKey);
}

function getMonths() {
    $months = array(1 => 'Leden', 2 => 'Únor', 3 => 'Březen', 4 => 'Duben', 5 => 'Květen', 6 => 'Červen', 7 => 'Červenec', 8 => 'Srpen', 9 => 'Září', 10 => 'Říjen', 11 => 'Listopad', 12 => 'Prosinec');

    return $months;
}

function urlExists($url) {
    $file_headers = @get_headers($url);
    if(!$file_headers || $file_headers[0] == 'HTTP/1.0 404 Not Found')
        return false;
    else
        return true;
}

function oDate($date) {
    $d = new DateTime(substr($date, 0, 28));
    return $d->format('Y-m-d');
}

function deleteFile($filename) {
    if (file_exists($filename))
        unlink($filename);
}

function price($price, string $currencyLabel = null, $showLabel = true): string {
    $eshop = Eshop::getInstance()->getEshop();
    $decimals = $eshop->settings->PriceDecimalPlaces ?? 2;

    if ( !$currencyLabel )
        $currencyLabel = $eshop->currency->Label;

    return number_format($price, $decimals, ',', ' ') . ($showLabel ? (' ' . $currencyLabel) : null);
}

/**
 * @return bool
 */
function isMobile() {
    if (isset($_COOKIE['mobile']) && $_COOKIE['mobile'])
        return true;
    else
        return false;
}

function isDevelopment() :bool {
    if (getenv('APPLICATION_ENV') == 'production')
        return false;
    else
        return true;
}

function base64_to_jpeg(string $base64_string, string $output_file): ?string {
    $data = explode(',', $base64_string);

    if (isset($data[1])) {
        $ifp = fopen($output_file, 'wb');
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);

        return $output_file;
    }

    return null;

}