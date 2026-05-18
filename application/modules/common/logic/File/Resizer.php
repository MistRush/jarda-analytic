<?php
namespace common\logic\File;

/**
 * Class for Uploading images
 * @package common\logic\File
 */
class Resizer {

    /**
     * @var string $fileName
     */
    private string $fileName;

    /**
     * @var string $filePath
     */
    private string $filePath;

    /**
     * Resizer constructor.
     * @param string $fileName
     * @param string $filePath
     */
    public function __construct(string $filePath, string $fileName) {
        $this->setFilePath($filePath);
        $this->setFileName($fileName);
    }

    /**
     * @param string $destPath
     * @param int $size
     */
    public function resize(string $destPath, int $size): void {
        $this->performResize($this->getFilePath() . $this->getFileName(), $destPath . $this->getFileName(), $size);
    }

    /**
     * @param string $filename
     * @param string $copypath
     * @param int $maxWidth
     * @param int|null $maxHeight
     */
    private function performResize(string $filename, string $copypath, int $maxWidth, ?int $maxHeight = null) : void {
        list($OrigWidth, $OrigHeight) = getimagesize($filename);

        if ($maxHeight == null)
            $maxHeight = $maxWidth;

        $pw = $OrigWidth / $maxWidth;
        $ph = $OrigHeight / $maxHeight;

        if ($pw > $ph)
            $p = $pw;
        else
            $p = $ph;

        if ($p < 1)
            $p = 1;

        $NewWidth = (int) $OrigWidth / $p;
        $NewHeight = (int) $OrigHeight / $p;

        if ( $NewWidth < 1 )
            $NewWidth = 1;

        if ( $NewHeight < 1 )
            $NewHeight = 1;

        $image_p = imagecreatetruecolor($NewWidth, $NewHeight);
        $image = imagecreatefromjpeg($filename);

        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $NewWidth, $NewHeight, $OrigWidth, $OrigHeight);
        imagejpeg($image_p, $copypath, 100);
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
