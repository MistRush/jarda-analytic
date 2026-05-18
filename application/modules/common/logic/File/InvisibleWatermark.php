<?php
namespace common\logic\File;

use Imagick;

class InvisibleWatermark {

    private const MASK_IMAGE = 'files/remante-invisible.png';

    public static function create(string $input_path, string $output_path, bool $compress = false): bool{
        $input_path = $_SERVER['DOCUMENT_ROOT'] . _bu() . '/' . $input_path;
        $output_path = $_SERVER['DOCUMENT_ROOT'] . _bu() . '/' . $output_path;
        if (file_exists($input_path)) {
            $mark = new Imagick($input_path);
            $original = new Imagick($input_path);
            $mask = new Imagick($_SERVER['DOCUMENT_ROOT'] . _bu() . '/' . self::MASK_IMAGE);
            $mask->scaleImage($original->getImageWidth(), $original->getImageHeight());
            $mask->setGravity(Imagick::GRAVITY_CENTER);
            $mark->setImageAlphaChannel(Imagick::ALPHACHANNEL_SET);
            $mark->compositeImage($mask, Imagick::COMPOSITE_DSTIN, 0, 0);

            $mark->negateImage(false, Imagick::CHANNEL_BLUE);
            $mark->evaluateImage(Imagick::EVALUATE_SET, 0, Imagick::CHANNEL_BLUE);

            $mark->setImageArtifact('compose:args', "12");
            $original->compositeImage($mark, Imagick::COMPOSITE_BLEND, 0, 0);

            if ($compress){
                $original->setCompression(Imagick::COMPRESSION_JPEG);
                $original->setCompressionQuality(70);
            }

            $original->writeImage($output_path);
            return true;
        } else
            return false;
    }
}