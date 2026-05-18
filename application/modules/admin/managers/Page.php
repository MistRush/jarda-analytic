<?php
use Common_Model_Language as Language;

class Admin_Manager_Page extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Page');
        $this->setLanguagesManipulation('Admin_Model_PageLang', 'pageLangs', 'Page_ID', ['Name', 'Content', 'Title', 'MetaDescription', 'MetaKeywords']);
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        parent::onDataList($query, $attributes, $listType, $connection);


        foreach ( Language::getActiveLanguages() as $language ) {
            $query->addSelect('pageLangs' . $language->Code . '.slug', 'slug'. $language->Code);
            //$query->leftJoin('entity', 'pageLangs', 'pageLangs' . $language->Code, 'pageLangs' . $language->Code . '.Language_ID = ' . $language->ID );
        }
    }

    public static function getActiveLanguages(): array|int|Doctrine_Collection_OnDemand|Doctrine_Collection {
        $query = Doctrine_Query::create();
        $query->from('Common_Model_Language object');

        return $query->execute();
    }
}