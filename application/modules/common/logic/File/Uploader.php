<?php
namespace common\logic\File;

use Admin_Model_Product as Product;
use common\logic\HadexApi\Converters\AttachmentConverter;
use Common_Model_File as File;

/**
 * Class for Uploading images
 * @package common\logic\File
 */
class Uploader {

    /**
     * @var string $file
     */
    private string $file;

    /**
     * @var string $fileName
     */
    private string $fileName;

    /**
     * @var string $extension
     */
    private string $extension;

    /**
     * @var string $type
     */
    private string $type;

    /**
     * @var int $addWatermark
     */
    private int $addWatermark = 3;

    /**
     * @var ?int $entityID
     */
    private ?int $entityID;

    /**
     * Uploader constructor.
     *
     * @param string $file
     * @param string $fullFileName
     * @param string $type
     * @param int $addWatermark
     * @param int|null $entityID
     */
    public function __construct(string $file, string $fullFileName, string $type, int $addWatermark = 3, ?int $entityID = null) {
        $this->setFile($file);
        $this->setType($type);
        $this->setAddWatermark($addWatermark);

        if ($type == File::TYPE_PRODUCT_PHOTO) {
            $product = Product::getProductByID($entityID);

            $this->setFileName(createFileName($product['ProductName']) . '-' . generateRandomString(4));
        } else {
            $this->setFileName(pathinfo($fullFileName, PATHINFO_FILENAME) . '-' . time() . '-' . generateRandomString(4));
        }

        $this->setExtension(strtolower(pathinfo($fullFileName, PATHINFO_EXTENSION)));
        $this->uploadFile();
        $this->setEntityID($entityID);
    }

    private function uploadFile() {
        $fileContent = file_get_contents($this->getFile());
        $type = $this->getType();
        $type = AttachmentConverter::convertFromApiToEshop($type);

        if ($type == File::TYPE_PRODUCT_PHOTO) {
            $originalFileName = File::TYPE_PRODUCT_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/' . $this->getFileName() . '.jpg';
            if ($this->extension == 'webp') {
                foreach (File::getRSizes() as $size) {
                    $productFile = fopen(File::TYPE_PRODUCT_PHOTO_FOLDER . $size . '/' . $this->getFileName() . "." . $this->extension, "wb");
                    fwrite($productFile, $fileContent);
                }
            } elseif ($this->extension == 'jpeg') {
                foreach (File::getRSizes() as $size) {
                    $productFile = fopen(File::TYPE_PRODUCT_PHOTO_FOLDER . $size . '/' . $this->getFileName() . "." . $this->extension, "wb");
                    fwrite($productFile, $fileContent);
                }
            } else {
                if ($this->extension == 'jpg') {
                    $image = @imagecreatefromjpeg($this->getFile());

                    if ($image) {
                        $originalFile = fopen($originalFileName, "wb");
                        fwrite($originalFile, $fileContent);
                    } else {
                        $tmpImage = File::TYPE_PRODUCT_PHOTO_FOLDER . $this->getFileName() . "." . $this->extension;
                        $tmpFile = fopen($tmpImage, "wb");
                        fwrite($tmpFile, $fileContent);
                        png2jpg($tmpImage, $originalFileName, 100);

                        $this->extension = 'jpg';
                        fclose($tmpFile);
                    }
                } else {
                    $tmpImage = File::TYPE_PRODUCT_PHOTO_FOLDER . $this->getFileName() . "." . $this->extension;
                    $tmpFile = fopen($tmpImage, "wb");
                    fwrite($tmpFile, $fileContent);

                    if (strtolower($this->extension) == 'png') {
                        png2jpg($tmpImage, $originalFileName, 100);
                    } else {
                        if (strtolower($this->extension) == 'gif') {
                            gif2jpg($tmpImage, $originalFileName);
                        }
                    }

                    $this->extension = 'jpg';
                    fclose($tmpFile);
                }
                // resize uploaded photos
                foreach (File::getRSizes() as $size) {
                    $resizer = new Resizer(File::TYPE_PRODUCT_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/', $this->getFileName() . '.jpg');
                    $resizer->resize(File::TYPE_PRODUCT_PHOTO_FOLDER . $size . '/', $size);
                }
            }
        } elseif ($type == File::TYPE_PRODUCT_DOCUMMENT) {
            $productDocumment = fopen(File::TYPE_PRODUCT_DOCUMMENT_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($productDocumment, $fileContent);
        } elseif ($type == File::TYPE_CATEGORY_PICTOGRAM) {
            $categoryPictogram = fopen(File::TYPE_CATEGORY_PICTOGRAM_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($categoryPictogram, $fileContent);
        } elseif ($type == File::TYPE_CATEGORY_PHOTO) {
            $originalFileName = File::TYPE_CATEGORY_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/' . $this->getFileName() . '.jpg';
            if ($this->extension == 'webp') {
                foreach (File::getRSizes() as $size) {
                    $productFile = fopen(File::TYPE_CATEGORY_PHOTO_FOLDER . $size . '/' . $this->getFileName() . "." . $this->extension, "wb");
                    fwrite($productFile, $fileContent);
                }
            } else {
                if ($this->extension == 'jpg' || $this->extension == 'jpeg') {
                    $originalFile = fopen($originalFileName, "wb");
                    fwrite($originalFile, $fileContent);
                } else {
                    $tmpImage = File::TYPE_CATEGORY_PHOTO_FOLDER . $this->getFileName() . "." . $this->extension;
                    $tmpFile = fopen($tmpImage, "wb");
                    fwrite($tmpFile, $fileContent);

                    if (strtolower($this->extension) == 'png') {
                        png2jpg($tmpImage, $originalFileName, 100);
                    } else {
                        if (strtolower($this->extension) == 'gif') {
                            gif2jpg($tmpImage, $originalFileName);
                        }
                    }

                    $this->extension = 'jpg';
                    fclose($tmpFile);
                }
                // resize uploaded photos
                foreach (File::getRSizes() as $size) {
                    $resizer = new Resizer(File::TYPE_CATEGORY_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/', $this->getFileName() . '.jpg');
                    $resizer->resize(File::TYPE_CATEGORY_PHOTO_FOLDER . '/' . $size . '/', $size);
                }
            }

        } elseif ($type == File::TYPE_NEWS) {
            $originalFileName = File::TYPE_NEWS_FOLDER . File::SIZE_ORIGINAL . '/' . $this->getFileName() . '.jpg';
            if ($this->extension == 'webp') {
                foreach (File::getRSizes() as $size) {
                    $newsFile = fopen(File::TYPE_NEWS_FOLDER . $size . '/' . $this->getFileName() . "." . $this->extension, "wb");
                    fwrite($newsFile, $fileContent);
                }
            } else {
                if ($this->extension == 'jpg' || $this->extension == 'jpeg') {
                    $originalFile = fopen($originalFileName, "wb");
                    fwrite($originalFile, $fileContent);
                } else {
                    $tmpImage = File::TYPE_NEWS_FOLDER . $this->getFileName() . "." . $this->extension;
                    $tmpFile = fopen($tmpImage, "wb");
                    fwrite($tmpFile, $fileContent);

                    if (strtolower($this->extension) == 'png') {
                        png2jpg($tmpImage, $originalFileName, 100);
                    } else {
                        if (strtolower($this->extension) == 'gif') {
                            gif2jpg($tmpImage, $originalFileName);
                        }
                    }

                    $this->extension = 'jpg';
                    fclose($tmpFile);
                }
                // resize uploaded photos
                foreach (File::getRSizes() as $size) {
                    $resizer = new Resizer(File::TYPE_NEWS_FOLDER . File::SIZE_ORIGINAL . '/', $this->getFileName() . '.jpg');
                    $resizer->resize(File::TYPE_NEWS_FOLDER . '/' . $size . '/', $size);
                }
            }
        }  elseif ($type == File::TYPE_DAILY_PHOTO) {
            $originalFileName = File::TYPE_DAILY_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/' . $this->getFileName() . '.jpg';
            if ($this->extension == 'webp') {
                foreach (File::getRSizes() as $size) {
                    $newsFile = fopen(File::TYPE_DAILY_PHOTO_FOLDER . $size . '/' . $this->getFileName() . "." . $this->extension, "wb");
                    fwrite($newsFile, $fileContent);
                }
            } else {
                if ($this->extension == 'jpg' || $this->extension == 'jpeg') {
                    $originalFile = fopen($originalFileName, "wb");
                    fwrite($originalFile, $fileContent);
                } else {
                    $tmpImage = File::TYPE_DAILY_PHOTO_FOLDER . $this->getFileName() . "." . $this->extension;
                    $tmpFile = fopen($tmpImage, "wb");
                    fwrite($tmpFile, $fileContent);

                    if (strtolower($this->extension) == 'png') {
                        png2jpg($tmpImage, $originalFileName, 100);
                    } else {
                        if (strtolower($this->extension) == 'gif') {
                            gif2jpg($tmpImage, $originalFileName);
                        }
                    }

                    $this->extension = 'jpg';
                    fclose($tmpFile);
                }
                // resize uploaded photos
                foreach (File::getRSizes() as $size) {
                    $resizer = new Resizer(File::TYPE_DAILY_PHOTO_FOLDER . File::SIZE_ORIGINAL . '/', $this->getFileName() . '.jpg');
                    $resizer->resize(File::TYPE_DAILY_PHOTO_FOLDER . '/' . $size . '/', $size);
                }
            }
        } elseif ($type == File::TYPE_BANNER) {
            $bannerFile = fopen(File::TYPE_BANNER_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($bannerFile, $fileContent);
        } elseif ($type == File::TYPE_MANUFACTURER) {
            $manufacturerFile = fopen(File::TYPE_MANUFACTURER_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($manufacturerFile, $fileContent);
        } elseif ($type == File::TYPE_LOGO) {
            $logoFile = fopen(File::TYPE_LOGO_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($logoFile, $fileContent);
        } elseif ($type == File::TYPE_FEEDBACK_ATTACHMENT) {
            $tagFile = fopen(File::TYPE_FEEDBACK_ATTACHMENT_FOLDER . $this->getFileName() . "." . $this->extension, "wb");
            fwrite($tagFile, $fileContent);
        } else {
            throw new \Exception('Unknown Type of file');
        }
    }

    /**
     * @return string
     */
    public function getFile(): string {
        return $this->file;
    }

    /**
     * @param string $file
     */
    public function setFile(string $file) {
        $this->file = $file;
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
     * @param string $extension
     */
    public function setExtension(string $extension) {
        $this->extension = $extension;
    }

    /**
     * @return string
     */
    public function getExtension(): string {
        return $this->extension;
    }

    /**
     * @param string $type
     */
    public function setType(string $type) {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getType(): string {
        return $this->type;
    }

    /**
     * @return int
     */
    public function getAddWatermark(): int {
        return $this->addWatermark;
    }

    /**
     * @param int $addWatermark
     */
    public function setAddWatermark(int $addWatermark): void {
        $this->addWatermark = $addWatermark;
    }

    /**
     * @return int
     */
    public function getEntityID(): int {
        return $this->entityID;
    }

    /**
     * @param ?int $entityID
     */
    public function setEntityID(?int $entityID): void {
        $this->entityID = $entityID;
    }
}