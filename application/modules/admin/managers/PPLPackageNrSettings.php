<?php

use common\logic\Eshop\Eshop;
use common\logic\Languages;

class Admin_Manager_PPLPackageNrSettings extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_PPLPackageNrSettings');
    }



    /**
     * @param array $attributes
     * @param $listType
     * @param array $data
     * @param null $dataSize
     *
     * @return array
     */
    protected function onDataListFinish(Array &$attributes, $listType, Array &$data, $dataSize = null): array {
        $eshop = Eshop::getInstance();

        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['RemainingNrs'] = $item['PackageNumberSeriesTo'] - ($item['LastPackageNumber']??$item['PackageNumberSeriesFrom']-1);
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }

}