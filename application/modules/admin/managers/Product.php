<?php
use common\logic\Eshop\Eshop;
use common\logic\Languages;
use Common_Model_File as File;

class Admin_Manager_Product extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Product');
        $this->setLanguagesManipulation('Admin_Model_ProductLang', 'productLangs', 'Product_ID', ['Name', 'ShortDescription', 'Description', 'slug', 'InfoText', 'Perex', 'CustomAvailabilityInfo', 'MetaDescription', 'Title']);
        $this->setEshopManipulation('Admin_Model_ProductEshop', 'productEshops', 'Product_ID', ['Active', 'Homepage', 'Price']);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $categoryID = null;
        $category = null;

        if (array_key_exists('Category_IDs', $attributes) && $attributes['Category_IDs']) {
            $query->leftJoin('entity', 'categories');
            $query->leftJoin('categories', 'category');

            $categoryIDs = $attributes['Category_IDs'];
            unset($attributes['Category_IDs']);

            $query->andWhere('category.ID IN (' . implode(',', $categoryIDs) . ')');
            $query->addGroupBy(array('entity.ID'));
        }

        if (array_key_exists('Manufacturer_IDs', $attributes) && $attributes['Manufacturer_IDs']) {
            $manufacturerIDs = $attributes['Manufacturer_IDs'];
            unset($attributes['Manufacturer_IDs']);

            $query->andWhere('entity.Manufacturer_ID IN (' . implode(',', $manufacturerIDs) . ')');
            $query->addGroupBy(array('entity.ID'));
        }

        if(isset($attributes['Active'])) {
            $active = (bool)$attributes['Active'];
            $eshop = Eshop::getInstance()->getEshop();
            $query->andWhere('productEshops'.$eshop->ID.'.Active="'.$active.'"');
        }

        $query->addGroupBy(array('entity.ID'));

        parent::onDataList($query, $attributes, $listType, $connection);


        $query->addSelect('file.Name', 'FileName');
        $query->addSelect('file.Extension', 'FileExtension');
        $query->addSelect('manufacturer.Name', 'ManufacturerName');
        $query->leftJoin('entity', 'productImages', 'productImages', 'productImages.Main = 1');
        $query->leftJoin('productImages', 'file');
        $query->leftJoin('entity', 'manufacturer');

        if ( isset($attributes['q']) && $attributes['q'] )
            $query->andWhere("entity.Code LIKE '%" . $attributes['q'] . "%'");
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
            $item['FullName'] = $item['Code'] . ' - ' . $item['Name' . Languages::getLangCode()] . ', Skladem: ' . $item['OnStock'] . 'Ks';
            $item['URL'] = '<input type="text" value="'.$eshop->getSettings('ProjectURL').'/produkt/'.$item['slugCZ'].'" id="'.$item['slugCZ'].'"><button class="btn-sm btn-primary" onclick="copyFunction(\''.$item['slugCZ'].'\')"><i class="ci ci-files"></i></button>';
            $item['FullFileName'] = $item['FileName'] ? '/' . File::TYPE_PRODUCT_PHOTO_FOLDER . '200/' . $item['FileName'] : '';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }

    protected function onDataUpdate(Array &$attributes, Doctrine_Connection $connection) {
        $entity = parent::onDataUpdate($attributes, $connection);

        foreach ($entity->productLangs as $productLang) {
            $productLang->SearchName = utf2ascii($productLang->Name);
            $productLang->save();
        }

        return $entity;
    }
}