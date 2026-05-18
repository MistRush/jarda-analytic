<?php
namespace common\logic\Helper;


class RangeFilter {

    public static function handleParams(string $from, string $to, string $type): array {
        $rangeFromValue = self::handleGetParams($from);
        $rangeToValue = self::handleGetParams($to);

        if(self::checkValues($rangeFromValue, $rangeToValue)) {
            return array('Type'=>$type, 'From'=>$rangeFromValue, 'To'=>$rangeToValue);
        } else {
            return [];
        }
    }

    private static function checkValues($fromValue, $toValue): bool{
        return $fromValue <= $toValue && ($fromValue != null &&  $toValue != null);
    }

    private static function handleGetParams($getParam) {
        return isset($_GET[$getParam]) ? strip_tags(htmlspecialchars($_GET[$getParam])) : false;
    }
}
