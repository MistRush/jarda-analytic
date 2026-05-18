<?php
use common\logic\Configs;
use Common_Model_File as File;
use common\logic\File\Uploader;

class Common_FileController extends Clevis_Zend_Controller_Action {

    public function uploadAction() {
        parent::disableLayout();

        $type = $this->getRequest()->getParam('type');
        $transfer = new Zend_File_Transfer_Adapter_Http();

        $fileInfo = $transfer->getFileInfo();
        if (array_key_exists("uploadFile", $fileInfo)) {
            $uploader = new Uploader($fileInfo["uploadFile"]["tmp_name"], $fileInfo["uploadFile"]["name"], $type, 3, $this->getRequest()->getParam('Entity_ID'));
            $commonFile = File::createFile($type, $uploader->getFileName(), $uploader->getExtension());
            $result = Clevis_Helper::formatDojoData(array($commonFile->toArray()), 'ID');
        } else {
            $result = "{}";
        }

        echo '<textarea>' . $result . '</textarea>';
    }

    public function dropZoneUploadAction() {
        parent::disableLayout();

        $type = $this->getRequest()->getParam('type');
        $transfer = new Zend_File_Transfer_Adapter_Http();

        $fileInfos = $transfer->getFileInfo();
        $result = [];
        foreach ($fileInfos as $fileInfo) {
            $parentEntityID = $this->getRequest()->getParam('ParentEntity_ID');
            $uploader = new Uploader($fileInfo["tmp_name"], $fileInfo["name"], $type, 3, $parentEntityID);
            $commonFile = File::createFile($type, $uploader->getFileName(), $uploader->getExtension());

            if ( $type == File::TYPE_PRODUCT_PHOTO ) {
                $lastRank = Admin_Model_ProductImage::getLastRankByProductID($parentEntityID);
                $productImage = new Admin_Model_ProductImage();
                $productImage->File_ID = $commonFile->ID;
                $productImage->Product_ID = $parentEntityID ?? null;
                $productImage->Rank = $lastRank + 1;
                $productImage->save();
            }

            $result[] =array_merge($commonFile->toArray(), ['OriginName' => $fileInfo["name"]]);
        }

        echo json_encode($result);
    }

    public function downloadAction() {
        parent::disableLayout();
        ini_set('memory_limit', '-1');
        $request = $this->getRequest();
        $fileID = $request->getParam("ID");
        $prefix = $request->getParam("Prefix");
        $folder = $request->getParam("Folder");
        $stream = $request->getParam("Stream");
        $download = $request->getParam("Download");

        if ($fileID != null and $fileID != 'null' && $fileID != 'undefined') {
            $file = Doctrine_Core::getTable("Common_Model_File")->find($fileID);
            if ($file != null) {
                $fileName = $this->getFileName($file);
            } else {
                throw new Zend_Controller_Action_Exception("Soubor neexistuje!", 404);
            }
        } else {
            echo "File not found";

            return;
        }

        $filePath = $this->getFilePath($file, $fileName, $prefix, $folder);

        if ($download) {
            if (file_exists($filePath))
                $data = file_get_contents($filePath);
            else {
                echo "404";
                return;
            }
        } else
            $data = file_get_contents($filePath);

        $this->setupHeaders($fileName, $filePath, $download);
        if ($stream != 1) {
            echo $data;
        }
    }

    /**
     * @param Common_Model_File $file
     * @param string $fileName
     * @param null|string $prefix
     * @param null|string $folder
     *
     * @return string|null
     */
    protected function getFilePath(File $file, string $fileName, ?string $prefix, ?string $folder = null): ?string {
        if ($file->Type == File::TYPE_BANNER) {
            return File::TYPE_BANNER_FOLDER . $fileName;
        } elseif ($file->Type == File::TYPE_MANUFACTURER) {
            return File::TYPE_MANUFACTURER_FOLDER . $fileName;
        } elseif ($file->Type == File::TYPE_LOGO) {
            return File::TYPE_LOGO_FOLDER . $fileName;
        } elseif ($file->Type == File::TYPE_CATEGORY_PHOTO) {
            return File::TYPE_CATEGORY_PHOTO_FOLDER . FILE::SIZE_MAXI . '/' . $fileName;
        } elseif ($file->Type == File::TYPE_NEWS) {
            return File::TYPE_NEWS_FOLDER . FILE::SIZE_MAXI . '/' . $fileName;
        } elseif ($file->Type == File::TYPE_DAILY_PHOTO) {
            return File::TYPE_DAILY_PHOTO_FOLDER . FILE::SIZE_MAXI . '/' . $fileName;
        } elseif ($file->Type == File::TYPE_PRODUCT_PHOTO) {
            return File::TYPE_PRODUCT_PHOTO_FOLDER . FILE::SIZE_MAXI . '/' . $fileName;
        } elseif ($file->Type == File::TYPE_PRODUCT_DOCUMMENT) {
            return File::TYPE_PRODUCT_DOCUMMENT_FOLDER . '/' . $fileName;
        } elseif ($file->Type == File::TYPE_FEEDBACK_ATTACHMENT) {
            return File::TYPE_FEEDBACK_ATTACHMENT_FOLDER . $fileName;
        } else {
            return null;
        }
    }

    /**
     * @param string $fileName
     * @param string|null $filePath
     * @param bool|null $download
     */
    protected function setupHeaders(string $fileName, string $filePath = null, ?bool $download = null): void {
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if ($extension == 'jpg' || $extension == 'jpeg') {
            header('Content-Type: image/jpeg');
        } elseif ($extension == 'pdf') {
            header('Content-Type: application/pdf');
        } elseif ($extension == 'txt') {
            header("Content-Type: text/plain");
        } elseif ($extension == 'doc' || $extension == 'docx') {
            header("Content-type: application/vnd.ms-word");
            header("Content-Disposition: attachment; filename=" . $fileName);
        } elseif ($extension == 'xls') {
            header("Content-type: application/vnd.ms-excel");
            header("Content-Disposition: attachment; filename=" . $fileName);
        } elseif ($extension == 'xlsx') {
            header("Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            header("Content-Disposition: attachment; filename=" . $fileName);
        } else {
            if (!is_null($filePath)) {
                $mimeType = mime_content_type($filePath);
                header("Content-type: " . $mimeType);
            }
            header("Content-Disposition: attachment; filename=" . $fileName);
        }
        if ($download)
            header("Content-Disposition: attachment; filename=" . $fileName);
        if (!isset($noHeader)) {
            header('Content-Transfer-Encoding: binary');
        }
    }

    /**
     * @param Common_Model_File $file
     * @return string
     */
    protected function getFileName(File $file): string {
        $fileName = $file->Name;
        if ($file->Name == null || $file->Name == '') {
            $fileName .= 'file';
        }
        if ($file->Extension != null && $file->Extension != '') {
            $fileName .= '.' . $file->Extension;
        }

        return $fileName;
    }

    public function infoAction() {
        parent::disableLayout();

        $file = Doctrine_Core::getTable('Common_Model_File')->find($this->getRequest()->getParam('ID'));
        if ($file != null) {
            $info = array();
            $info['fileName'] = $this->getFileName($file);
            echo json_encode($info);
        } else {
            throw new Zend_Controller_Action_Exception('Soubor neexistuje!', 404);
        }
    }
}