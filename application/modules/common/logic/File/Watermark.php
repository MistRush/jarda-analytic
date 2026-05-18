<?php
namespace common\logic\File;

use Common_Model_File as File;

/**
 * Class for Uploading Watermark
 * @package common\logic\File
 */
class Watermark {
    const WATERMARK_FILE = 'files/remante-stamp.png';
    const WATERMARK_FILE_AN = 'files/an-stamp.png';

    /**
     * @var string $fileName
     */
    private string $fileName;

    /**
     * @var string $filePath
     */
    private string $filePath;

    /**
     * @var string
     */
    private string $watermark_file;

    /**
     * @param string $filePath
     * @param string $fileName
     * @param string $watermark_type
     */
    public function __construct(string $filePath, string $fileName, string $watermark_type = self::WATERMARK_FILE) {
        $this->setFilePath($filePath);
        $this->setFileName($fileName);
        $this->watermark_file = $watermark_type;
    }

    /**
     * perform watermark
     * @param string $destPath
     */
    public function performWatermark(string $destPath): void {
        $stamp = imagecreatefrompng($this->watermark_file);
        $im = imagecreatefromjpeg($this->getFilePath() . $this->getFileName());

        $marge_right = 10;
        $sx = imagesx($stamp);
        $sy = (imagesy($im) - imagesy($stamp))/2;

        imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, $sy, 0, 0, imagesx($stamp), imagesy($stamp));

        imagejpeg($im, $destPath . $this->getFileName(), 100);
        imagedestroy($im);
    }

    /**
     * @return string
     */
    public function getFileName(): string {
        return $this->fileName;
    }

    /**
     * @param string $fileName
     */
    public function setFileName(string $fileName) {
        $this->fileName = $fileName;
    }

    /**
     * @return string
     */
    public function getFilePath(): string {
        return $this->filePath;
    }

    /**
     * @param string $filePath
     */
    public function setFilePath(string $filePath) {
        $this->filePath = $filePath;
    }
}
