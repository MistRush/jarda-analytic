<?php

namespace common\logic\BankMailParser;

class Bank {
    public static function kb($message): array
    {
        preg_match("'Datum splatnosti:\t(.*?)[\n]'", $message, $match);
        $ret['date'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Číslo vašeho účtu:\t(.*?)[\n]'", $message, $match);
        $ret['toAccount'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Číslo protiúčtu:\t(.*?)[\n]'", $message, $match);
        $ret['fromAccount'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Jméno protiúčtu:\t(.*?)[\n]'", $message, $match);
        $ret['fromAccountName'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Částka a měna:\t(.*?)[\n]'", $message, $match);
        $ret['amount'] =isset($match[1])?trim($match[1]):'';
        preg_match("'Konstantní symbol:\t(.*?)[\n]'", $message, $match);
        $ret['ks'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Variabilní symbol:\t(.*?)[\n]'", $message, $match);
        $ret['vs'] = isset($match[1])?trim($match[1]):'';
        preg_match("'Zpráva pro příjemce:\t(.*?)[\n]'", $message, $match);
        $ret['message'] = isset($match[1])?trim($match[1]):'';
        return $ret;
    }

    public static function processAmountToDecimal(string|int $amount) {
            $number = str_replace('CZK','', $amount);
            $number = str_replace(',','.', $number);
            $number = str_replace(' ','', $number);
            if( is_string($number) || is_int($number)) {
                $number = floatval($number);
            }
            return empty($number) ? 0.0 : $number;

    }
}
