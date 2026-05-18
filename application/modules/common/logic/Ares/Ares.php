<?php
namespace common\logic\Ares;


use Jolanda\Controls\Editor\StatusManager;

class Ares {

    public static function getCustomerByIn($in): array {
        $statusManager = StatusManager::getInstance();
        $file = @file_get_contents("https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/" . $in);
        if ($file) {
            $aresData = json_decode($file, true);
        }

        if (isset($aresData) && ($aresData)) {
            if ($aresData['ico'] == $in) {
                return array(
                    'status' => 'success',
                    'in' => $aresData['ico'],
                    'tin' => $aresData['dic']??'',
                    'company' => $aresData['obchodniJmeno'],
                    'street' => $aresData['sidlo']['nazevUlice'],
                    'descriptiveNumber' => $aresData['sidlo']['cisloDomovni'],
                    'orientationNumber' => $aresData['sidlo']['cisloOrientacni']?? null,
                    'city' => $aresData['sidlo']['nazevObce'],
                    'zip' => $aresData['sidlo']['psc'],
                );
            }
        } else {
            $statusManager->addError('IČO firmy nebylo nalezeno');
            return array('errmsg' => 'IČO firmy nebylo nalezeno', 'status' => 'error');
        }

        $statusManager->addError('Databáze ARES není dostupná');
        return  array('errmsg'=>'Databáze ARES není dostupná', 'status' => 'error');
    }


    public static function checkCustomer($in) {
        $data = self::checkCustomerByIn($in);
        $inRegister = $data['psu'] ?? null;
        if(!$inRegister) {
            return false;
        }
        if($inRegister['stavZdrojeVr'] === "AKTIVNI" ||
            $inRegister['stavZdrojeRes'] === "AKTIVNI" ||
            $inRegister['stavZdrojeRzp'] === "AKTIVNI") {
            return true;
        } else {
            return false;
        }

    }

    private static function checkCustomerByIn($in): bool|array
    {

        $statusManager = StatusManager::getInstance();
        $file = @file_get_contents("https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/" . $in);
        if ($file) {
            $aresData = json_decode($file, true);
        }

        if (isset($aresData) && ($aresData)) {
            if ($aresData['ico'] == $in) {
                return array(
                    'psu'=> $aresData['seznamRegistraci']
                );
            }
        } else {
            $statusManager->addError('IČO firmy nebylo nalezeno');
            return json_encode(array('errmsg' => 'IČO firmy nebylo nalezeno'));
        }

        $statusManager->addError('Databáze ARES není dostupná');
        return  json_encode(array('errmsg'=>'Databáze ARES není dostupná'));
    }
}
