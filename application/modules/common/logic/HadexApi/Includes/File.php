<?php

namespace common\logic\HadexApi\Includes;

use common\logic\File\Uploader;
use common\logic\HadexApi\Converters\AttachmentConverter;
use Common_Model_File as CommonFile;

class File {

    public static function uploadFileFromUrl(string $url, string $type): int {
        $fileNameExplode = explode('/', $url);
        $attachmentType = AttachmentConverter::convertFromApiToEshop($type);
        $uploader = new Uploader($url, end($fileNameExplode), $attachmentType, 0);
        $commonFile = CommonFile::createFile($attachmentType, $uploader->getFileName(), $uploader->getExtension());
        return $commonFile->ID;
    }

    public static function uploadFileFromBase64(string $base64Data, string $type, int $parentEntityID, string $fileName = null) : int|string {
        $data = base64_decode($base64Data);

        if ($data === false) {
            return 'Neplatný Base64 řetězec.';
        }

        $fileSignature = bin2hex(substr($data, 0, 4));
        $fileExtension = self::getFileExtension($fileSignature);

        if($fileExtension === 'unknown') {
            return 'Neznámý typ souboru.';
        }

        $tempFilePath = tempnam(sys_get_temp_dir(), 'attachment_'.time()) . '.'.$fileExtension;
        file_put_contents($tempFilePath, $data);

        $attachmentType = AttachmentConverter::convertFromApiToEshop($type);
        if(!$fileName) {
            $fileNameExplode = explode('/', $tempFilePath);
            $fileName = end($fileNameExplode);
        }


        $uploader = new Uploader($tempFilePath, $fileName, $attachmentType, 0, $parentEntityID);
        $commonFile = CommonFile::createFile($attachmentType, $uploader->getFileName(), $uploader->getExtension());

        return $commonFile->ID;
    }


    public static function getFileExtension(string $fileSignature): string {
        return match ($fileSignature) {
            'ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe4', 'ffd8ffe5', 'ffd8ffe6', 'ffd8ffe7', 'ffd8ffe8' => 'jpg',
            '89504e47' => 'png',
            '47494638' => 'gif',
            '25504446' => 'pdf',
            default => 'unknown',
        };
    }


}