<?php

use common\logic\Latte\LatteEngine;

class Common_DropZoneController extends Clevis_Zend_Controller_Action {

    public function init() {
        parent::init();

        $this->disableLayout();
    }

    public function uploadAction() {
        $parentEntityID = $this->getRequest()->getParam('ParentEntity_ID');
        $type = $this->getRequest()->getParam('Type');
        $acceptedFiles = $this->getRequest()->getParam('AcceptedFiles');
        if($acceptedFiles === '*')
            $acceptedFiles = null;
        $index = $this->getRequest()->getParam('Index');
        $dataGrid = $this->getRequest()->getParam('Grid');
        echo LatteEngine::getInstance()->renderToString(__DIR__ . '/../views/latte/dropZone/drop-zone.latte',
            [
                'parentEntityID' => $parentEntityID,
                'type' =>  $type,
                'acceptedFiles' => $acceptedFiles,
                'index'=>$index,
                'dataGrid'=> $dataGrid
            ]
        );
    }

    public function removeAction()
    {
        $fileID = $this->getRequest()->getParam('fileID');
        $type = $this->getRequest()->getParam('type');
        $dbTable = $this->pascalCase($type, '-');

        if ($type)  {
            $query = Doctrine_Query::create();
            $query->delete('Admin_Model_' . $dbTable);
            $query->where('File_ID=?', $fileID);
            $query->execute();

            $query->delete('Common_Model_File');
            $query->where('ID=?', $fileID);
            $query->execute();
        }

    }

    private function pascalCase($word, $delimiter): string
    {
        $word = strtolower($word);
        $word = ucwords($word, $delimiter);

        return str_replace($delimiter, '', $word);
    }

}