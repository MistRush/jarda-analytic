<?php

/**
 * Admin_Manager_Category
 */
class Admin_Manager_Recomendation extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Recomendation');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, array &$attributes, $listType, Doctrine_Connection $connection)
    {
        parent::onDataList($query, $attributes, $listType, $connection);
        $processedAttributes = [];

        foreach ($attributes as $attribute) {
            if (isset($attribute['Type'])) {
                bdump($attribute['Type']);
                $attribute['TypeCustom'] = $this->mapEntityType($attribute['Type']);
            }
            $processedAttributes[] = $attribute;
        }

        $attributes = $processedAttributes;



    }


    private function mapEntityType($entityType)
    {
        $map = [
            'meal' => 'Jídlo',
            'declined' => 'Zamítnuto',
            'approved' => 'Schváleno',
        ];

        return $map[$entityType] ?? $entityType;
    }


}