<?php

namespace common\logic\HadexApi\Converters;

use Common_model_File as File;
use DateTime;
use DateTimeZone;

class DateTimeConverter {

    /**
     * @throws \DateMalformedStringException
     */
    public static function convertFromMySqlToUtc($dateTime, $format = null): string {
        $mysqlDateTime = $dateTime;
        $dateTime = new DateTime($mysqlDateTime, new DateTimeZone('Europe/Prague'));
        $dateTime->setTimezone(new DateTimeZone('UTC'));

        if ($format === 'ISO-8601')
            return $dateTime->format('Y-m-d\TH:i:s.v\Z');

        return $dateTime->format('Y-m-d H:i:s');
    }

    /**
     * @throws \DateMalformedStringException
     */
    public static function convertUtcToMySqlFormat(string $utcDateTime): string {
        $dateTime = new DateTime($utcDateTime, new DateTimeZone('UTC'));
        return $dateTime->format('Y-m-d H:i:s');
    }


}