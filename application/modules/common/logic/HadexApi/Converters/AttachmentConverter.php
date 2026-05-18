<?php

namespace common\logic\HadexApi\Converters;

use Common_Model_File as File;

class AttachmentConverter {
    const ATTACHMENT_TYPE_PRODUCT_1 = 'OBR1';
    const ATTACHMENT_TYPE_PRODUCT_2 = 'OBR2';
    const ATTACHMENT_TYPE_PRODUCT_3 = 'OBR3';
    const ATTACHMENT_TYPE_PRODUCT_4 = 'OBR4';
    const ATTACHMENT_TYPE_PRODUCT_MANUAL_1 = 'NAVOD';
    const ATTACHMENT_TYPE_PRODUCT_MANUAL_2 = 'MANUAL';
    const ATTACHMENT_TYPE_PRODUCT_SPECIFICATION = 'SPEC';
    const ATTACHMENT_TYPE_PRODUCT_DECLARATION = 'PROHL';
    const ATTACHMENT_TYPE_PRODUCT_CERTIFICATION = 'CERT';
    const ATTACHMENT_TYPE_SOFTWARE_1 = 'SOFT1';
    const ATTACHMENT_TYPE_SOFTWARE_2 = 'SOFT2';
    const ATTACHMENT_TYPE_SOFTWARE_3 = 'SOFT3';
    const ATTACHMENT_TYPE_SOFTWARE_4 = 'SOFT4';
    const ATTACHMENT_TYPE_SOFTWARE_5 = 'SOFT5';
    const ATTACHMENT_TYPE_SOFTWARE_6 = 'SOFT6';
    const ATTACHMENT_TYPE_SOFTWARE_7 = 'SOFT7';
    const ATTACHMENT_TYPE_SOFTWARE_8 = 'SOFT8';
    const ATTACHMENT_TYPE_SOFTWARE_9 = 'SOFT9';
    const ATTACHMENT_TYPE_CATEGORY = 'CATEGORY';


    public static function convertFromApiToEshop($attachmentType): string {
        return match ($attachmentType) {
            self::ATTACHMENT_TYPE_PRODUCT_1,
            self::ATTACHMENT_TYPE_PRODUCT_2,
            self::ATTACHMENT_TYPE_PRODUCT_3,
            self::ATTACHMENT_TYPE_PRODUCT_4 => File::TYPE_PRODUCT_PHOTO,

            self::ATTACHMENT_TYPE_PRODUCT_MANUAL_1,
            self::ATTACHMENT_TYPE_PRODUCT_MANUAL_2,
            self::ATTACHMENT_TYPE_PRODUCT_SPECIFICATION,
            self::ATTACHMENT_TYPE_PRODUCT_DECLARATION,
            self::ATTACHMENT_TYPE_PRODUCT_CERTIFICATION => File::TYPE_PRODUCT_DOCUMMENT,

            self::ATTACHMENT_TYPE_SOFTWARE_1,
            self::ATTACHMENT_TYPE_SOFTWARE_2,
            self::ATTACHMENT_TYPE_SOFTWARE_3,
            self::ATTACHMENT_TYPE_SOFTWARE_4,
            self::ATTACHMENT_TYPE_SOFTWARE_5,
            self::ATTACHMENT_TYPE_SOFTWARE_6,
            self::ATTACHMENT_TYPE_SOFTWARE_7,
            self::ATTACHMENT_TYPE_SOFTWARE_8,
            self::ATTACHMENT_TYPE_SOFTWARE_9 => File::TYPE_PRODUCT_SOFTWARE,

            self::ATTACHMENT_TYPE_CATEGORY => File::TYPE_CATEGORY_PHOTO,

            default => $attachmentType,
        };
    }
}