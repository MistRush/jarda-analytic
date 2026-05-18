<?php

namespace common\logic\HadexApi\Enums;

class PriceType {
    public const PRICE_A = 'A';
    public const PRICE_B = 'B';
    public const PRICE_C = 'C';
    public const PRICE_D = 'D';
    public const PRICE_ACTION = 'ACTION';
    public const PRICE_CUSTOMER = 'CUSTOMER';

    public static function PriceTypes(): array {
        return [
            self::PRICE_A,
            self::PRICE_B,
            self::PRICE_C,
            self::PRICE_D,
            self::PRICE_ACTION
        ];
    }

    public static function isValid(string $value): bool {
        return in_array($value, self::PriceTypes(), true);
    }
}