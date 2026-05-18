<?php

/**
 * Admin_Manager_Category
 *
 */
class Admin_Manager_CategoryList extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();
        
        $this->setModel('Admin_Model_Category');
        $this->setLanguagesManipulation('Admin_Model_CategoryLang', 'categoryLangs', 'Category_ID', ['Name', 'ShortDescription', 'Description', 'H1Name', 'Title', 'MetaDescription', 'slug']);

    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $attributes['sort'] = 1;
        
        parent::onDataList($query, $attributes, $listType, $connection);

        $query->orderBy('entity.Name ASC');
        $query->leftJoin('entity', 'file');
    }
}