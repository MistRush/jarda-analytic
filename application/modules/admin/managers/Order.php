<?php
use Admin_Model_Order as Order;
use Clevis_Data_Manager as DataManager;
use user\logic\UserAdminSession;

class Admin_Manager_Order extends Clevis_Data_ManagerRaw {

    public function __construct() {
        parent::__construct();

        $this->setModel('Admin_Model_Order');
        $this->setColumnFilter('OrderNumber', DataManager::FILTER_LIKE);
        $this->setColumnFilter('Date', DataManager::FILTER_DATE);
        $this->setColumnFilter('FullName', DataManager::FILTER_LIKE, "concat(invoiceAddress.LastName, ' ' , invoiceAddress.FirstName)");
        $this->setColumnFilter('Email', DataManager::FILTER_LIKE, 'invoiceAddress.Email');
        $this->setColumnFilter('OrderStateType_ID', DataManager::FILTER_EQUAL);

        $this->addChildManagerByModel('Admin_Model_Address', 'invoiceAddress');
        $this->addChildManagerByModel('Admin_Model_Address', 'deliveryAddress');
    }

    protected function onDataList(Clevis_Data_ManagerRawQuery $query, Array &$attributes, $listType, Doctrine_Connection $connection) {
        $query->orderBy('entity.ID DESC');

        parent::onDataList($query, $attributes, $listType, $connection);

        $query->addSelect('currency.Label', 'CurrencyLabel');
        $query->addSelect("orderStateType.Color", 'Color');
        $query->addSelect("payment.Name", 'PaymentName');
        $query->addSelect("shipping.Name", 'ShippingName');
        $query->addSelect("IFNULL(PPL.PickupPlace_ID, IFNULL(zasilkovna.PickupPlace_ID, balikovna.PickupPlace_ID))", 'PickupPlace_ID');
        $query->addSelect("IFNULL(PPL.PickupPlaceName, IFNULL(zasilkovna.PickupPlaceName, balikovna.PickupPlaceName))", 'PickupPlaceName');
        $query->addSelect("IFNULL(PPL.PickupPlaceAddress, IFNULL(zasilkovna.PickupPlaceAddress, balikovna.PickupPlaceAddress))", 'PickupPlaceAddress');

//        $query->addSelect("zasilkovna.PickupPlaceName", 'PickupPlaceName');
//        $query->addSelect("zasilkovna.PickupPlaceAddress", 'PickupPlaceAddress');

        $query->addSelect('orderStateTypeLangs.Name', 'OrderStateTypeName');
        $query->leftJoin('entity', 'invoiceAddress');
        $query->leftJoin('entity', 'currency');
        $query->leftJoin('entity', 'orderStateType');
        $query->leftJoin('orderStateType', 'orderStateTypeLangs');
        $query->leftJoin('entity', 'payment');
        $query->leftJoin('entity', 'shipping');
        $query->leftJoin('entity', 'PPL');
        $query->leftJoin('entity', 'zasilkovna');
        $query->leftJoin('entity', 'balikovna');

        if ($eshops = UserAdminSession::getCurrentUserEshop(true))
            $query->addWhere('entity.Eshop_ID IN (' . implode(',', $eshops) . ')');

        //$query->addWhere('entity.OrderStateType_ID != ' . OrderStateType::ID_STATE_FINISH . ' OR entity.OrderStateType_ID IS NULL');

        if (!empty($attributes['orderStateType']))
            $query->andWhere('entity.OrderStateType_ID = ' . $attributes['orderStateType']);

        if (empty($attributes['orderStateType']))
            $query->andWhere('entity.OrderStateType_ID != ' . Admin_Model_OrderStateType::ID_STATE_CANCEL);

        $query->addGroupBy('entity.ID');
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
        $output = array();
        $output['identifier'] = $this->getDataUniqueIdentifier();

        foreach ($data as &$item) {
            $item['FullDate'] = formatDate($item['Date']) . ' v ' . $item['Time'];

            if( $item['UserUtmParams_ID']>0 ) {
                $badgeName = 'PPC';
                $badgeColor = 'bg-info';
            } elseif($item['ConversionReferer']) {
                $badgeName = 'SEO';
                $badgeColor = 'bg-success';
            } else {
                $badgeName = 'DIRECT';
                $badgeColor = 'bg-secondary';
            }
            $item['ConversionType'] =  $item['ID'] >= 6160?'<span style="color:white" class="badge '.$badgeColor.'">'.$badgeName.'</span>':'';
        }

        $output['data'] = $data;
        $output['numResults'] = $dataSize;

        return $output;
    }

    protected function onDataUpdate(array &$attributes, Doctrine_Connection $connection): Order {
        /** @var Order $entity */
        $entity = parent::onDataUpdate($attributes, $connection);

        if ($entity && $entity->InvoiceAddress_ID) {
            if (isset($attributes['aFirstName']))
                $entity->invoiceAddress->FirstName = $attributes['aFirstName'];

            if (isset($attributes['aLastName']))
                $entity->invoiceAddress->LastName = $attributes['aLastName'];

            if (isset($attributes['aStreet']))
                $entity->invoiceAddress->Street = $attributes['aStreet'];


            if (isset($attributes['aCity']))
                $entity->invoiceAddress->City = $attributes['aCity'];

            if (isset($attributes['aZipCode']))
                $entity->invoiceAddress->ZipCode = $attributes['aZipCode'];

            $entity->invoiceAddress->save();
        }

        if ($entity && $entity->DeliveryAddress_ID) {
            if (isset($attributes['daFirstName']))
                $entity->deliveryAddress->FirstName = $attributes['daFirstName'];

            if (isset($attributes['daLastName']))
                $entity->deliveryAddress->LastName = $attributes['daLastName'];

            if (isset($attributes['daStreet']))
                $entity->deliveryAddress->Street = $attributes['daStreet'];

            if (isset($attributes['daCity']))
                $entity->deliveryAddress->City = $attributes['daCity'];

            if (isset($attributes['daZipCode']))
                $entity->deliveryAddress->ZipCode = $attributes['daZipCode'];

            $entity->deliveryAddress->save();
        }

        if (!$entity->DeliveryAddress_ID) {
            if (isset($attributes['daFirstName']) || isset($attributes['daLastName']) || isset($attributes['daStreet']) ||
                isset($attributes['daCity']) || isset($attributes['daZipCode'])) {
                $newDeliveryAddress = new Admin_Model_Address();
                $newDeliveryAddress->FirstName = $attributes['daFirstName'];
                $newDeliveryAddress->LastName = $attributes['daLastName'];
                $newDeliveryAddress->Street = $attributes['daStreet'];
                $newDeliveryAddress->City = $attributes['daCity'];
                $newDeliveryAddress->ZipCode = $attributes['daZipCode'];
                $newDeliveryAddress->save();

                $entity->DeliveryAddress_ID = $newDeliveryAddress->ID;
            }
        }
        if (isset($attributes['OrderStateType_ID'])) {
            Admin_Model_OrderState::createOrderState($entity->ID, $entity->OrderStateType_ID, UserAdminSession::getCurrentUserName());
        }

        return $entity;
    }
}