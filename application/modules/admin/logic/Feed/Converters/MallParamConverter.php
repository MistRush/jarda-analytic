<?php
namespace admin\logic\Feed\Converters;


class MallParamConverter
{
    public static function convertParam(int $paramID): ?string
    {
        $mallParamName = match($paramID) {
            8 => 'LOADING',
            47 => 'MATERIAL',
            11 => 'BALL_MOUNTING',
            36 => 'NUMBER_OF_PINS',
            45 => 'TYPE_OF_TOWING_DEVICE',
            default => null
        };
        return $mallParamName;
    }

}