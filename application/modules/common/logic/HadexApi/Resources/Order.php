<?php

namespace common\logic\HadexApi\Resources;

use common\logic\HadexApi\Converters\DateTimeConverter;
use Admin_Model_Order as ModelOrder;
use Admin_Model_OrderItem as ModelOrderItem;
use Admin_Model_Address as ModelAddress;
use Admin_Model_OrderStateType as ModelOrderStateType;
use Admin_Model_Zasilkovna as ModelZasilkovna;
use Admin_Model_PPL as ModelPPL;
use Admin_Model_Balikovna as ModelBalikovna;
use Common_Model_Country as ModelCountry;

class Order {

    private ?string $changedSince;
    private ?int $orderID;
    private ?ModelOrder $order;
    private $getPickupDeliveryPlace;

    public function __construct(?int $orderID = null) {
        $this->orderID = $orderID;
        $this->changedSince = null;
        $this->order = null;
    }


    public function getOrders($filter = null, $changedSince = null): array {
        $this->changedSince = $changedSince;
        $orders = ModelOrder::getOrdersByFilter($this->orderID, $filter, $changedSince);
        $result = [];
        foreach ($orders as $order) {
            $result[] = $this->getOrderResultEntity($order);
        }
        return $result;
    }

    public function updateOrder(array $dataItem): array {
        $order = ModelOrder::getOrder($this->orderID);
        if (!$order) {
            return [
                'errorCode' => 404,
                'message' => 'Order not found'
            ];
        }
        $this->order = $order;
        $orderState = ModelOrderStateType::getOrderStateTypeByCode($dataItem['orderStateCode']);

        $order->OrderNumber = $dataItem['number']?:$order->OrderNumber;
        $order->CompleteOrder = $dataItem['completeOrder']?:$order->CompleteOrder;
        $order->User_ID = $dataItem['customerId']?:$order->User_ID;
        $order->OrderStateType_ID = $orderState?$orderState->ID:null;
        $order->PriceTotalWithoutVat = $dataItem['priceTotalWithoutVat']?:$order->PriceTotalWithoutVat;
        $order->PriceTotalWithVat = $dataItem['priceTotalWithVat']?:$order->PriceTotalWithVat;
        $order->Description = $dataItem['noteCustomer']?:$order->Description;
        $order->payment->Type = $dataItem['paymentType']?:$order->payment->Type;
        $order->shipping->Type = $dataItem['deliveryType']?:$order->shipping->Type;
        $order->currency->Mark = $dataItem['currencyCode']?:$order->currency->Mark;
        $order->currency->Ratio = $dataItem['currencyRate']?:$order->currency->Ratio;
        $order->Synced = $dataItem['synced']?:$order->Synced;
        $order->TrackingUrl = $dataItem['trackingCode']?:$order->TrackingUrl;

        $order->save();

        if(isset($dataItem['payment'])) {
            $this->updatePayments($order, $dataItem['payment']);
        }
        if(isset($dataItem['shipping'])) {
            $this->updateShipping($order, $dataItem['shipping']);
        }
        if(isset($dataItem['orderItems'])) {
            $this->updateOrderItems($dataItem['orderItems']);
        }
        if(isset($dataItem['invoiceAddress'])) {
            $this->updateInvoiceAddress($dataItem['invoiceAddress']);
        }
        if(isset($dataItem['deliveryAddress'])) {
            $this->updateDeliveryAddress($dataItem['deliveryAddress']);
        }

        return $this->getOrderResultEntity($order);
    }




    private function getOrderResultEntity(ModelOrder $modelOrder): array {
        $orderState = $modelOrder->orderStates->getLast()->orderStateType->orderStateTypeLangs[0]->Name;
        $deliveryAddress = (!$modelOrder->deliveryAddress->Street && !$modelOrder->deliveryAddress->ZipCode && !$modelOrder->deliveryAddress->City)
            ? $modelOrder->invoiceAddress
            : $modelOrder->deliveryAddress;
        return [
            'id' => $modelOrder->ID,
            'number' => $modelOrder->OrderNumber,
            'customerId' => $modelOrder->User_ID,
            'completeOrder' => $modelOrder->CompleteOrder,
            'orderStateCode' => $orderState, //ToDo: vyjasnit, jaké kódy jsou očekávány
            'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelOrder->Date, 'ISO-8601'),
            'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelOrder->DateTimeUpdated, 'ISO-8601'),
            'priceTotalWithoutVat' => $modelOrder->PriceTotalWithoutVat,
            'priceTotalWithVat' => $modelOrder->PriceTotalWithVat,
            'noteCustomer' => $modelOrder->Description,
            'paymentType' => $modelOrder->payment->Code,
            'deliveryType' => $modelOrder->shipping->Code,
            'currencyCode' => $modelOrder->currency->Mark,
            'currencyRate' => $modelOrder->currency->Ratio,
            'synced' => $modelOrder->Sync??false,
            'trackingCode' => $modelOrder->TrackingUrl, //ToDo: má tu jít celá URL nebo jen kód pro sledování?
            'payment' => $this->getPayments($modelOrder),
            'shipping' => $this->getShipping($modelOrder),
            'orderItems' => $this->getOrderItems($modelOrder),
            'invoiceAddress' => $this->getInvoiceAddress($modelOrder->invoiceAddress),
            'deliveryAddress' => $this->getDeliveryAddress($deliveryAddress, $modelOrder),
            'pickupDeliveryPlace' => $this->isPickupPlaceChosen($modelOrder) ? $this->getPickupDeliveryPlace($modelOrder): null,
        ];

    }

    private function getPayments(ModelOrder $modelOrder) {
            $payment = [
                'id' => $modelOrder->payment->ID,
                'code' => $modelOrder->payment->Code,
                'name' => $modelOrder->payment->Name,
                'type' => $modelOrder->payment->Type,
//                'transactionId' => null,
//                'status' => $modelOrder->PricePaymentWithoutVat,
//                'note' => $modelOrder->currency->Ratio,
                'priceWithoutVat' => $modelOrder->PricePaymentWithoutVat,
                'priceWithVat' => $modelOrder->PricePaymentWithVat,
                'currency' =>  $modelOrder->currency->Mark,
                'currencyRate' => $modelOrder->currency->Ratio,
            ];
        return $payment;
    }

    private function getOrderItems(ModelOrder $modelOrder): array {
        $orderItems = [];
        foreach ($modelOrder->orderItems as $orderItem) {
            $orderItems[] = [
                'id' => $orderItem->ID,
                'productId' => $orderItem->Product_ID,
                'productCode' => $orderItem->product->Code,
                'productName' => $orderItem->product->productLangs[0]->Name,
                'quantity' => $orderItem->Quantity,
                'priceWithoutVat' => $orderItem->PriceWithoutVat,
                'priceWithVat' => $orderItem->PriceWithVat,
            ];
        }
        return $orderItems;
    }

    private function getInvoiceAddress(ModelAddress $invoiceAddress): array {
        return [
            'id' => $invoiceAddress->ID,
            'firstName' => $invoiceAddress->FirstName,
            'lastName' => $invoiceAddress->FirstName,
            'companyName' => $invoiceAddress->CompanyName,
            'identification' => $invoiceAddress->IC,
            'taxIdentification' => $invoiceAddress->DIC,
            'state' => $invoiceAddress->country->Code,
            'street' => $invoiceAddress->Street,
            'zipCode' => $invoiceAddress->ZipCode,
            'phone' => $invoiceAddress->Phone,
            'email' => $invoiceAddress->Email,
            'city' => $invoiceAddress->City,
        ];
    }

    private function getDeliveryAddress(ModelAddress $deliveryAddress, ModelOrder $order): ?array {
        $address = [
            'id' => $deliveryAddress->ID,
            'firstName' => $deliveryAddress->FirstName,
            'lastName' => $deliveryAddress->FirstName,
            'state' => $deliveryAddress->country->Code,
            'street' => $deliveryAddress->Street,
            'zipCode' => $deliveryAddress->ZipCode,
            'phone' => $deliveryAddress->Phone,
            'email' => $deliveryAddress->Email,
            'city' => $deliveryAddress->City,
        ];

        if($this->isPickupPlaceChosen($order)) {
            return null;
        }

        return $address;

    }

    private function updatePayments(\Doctrine_Record|ModelOrder $order, array $payments) {
        //Todo: dokud se nevyjasní blok pyements, tak zatím neimplementováno

    }

    private function updateOrderItems(array $orderItems): void {
        foreach($orderItems as $orderItem) {
            if(!isset($orderItem['id'])) {
               continue;
            }
            $modelOrderItem = ModelOrderItem::getOrderItem($orderItem['id']);
            if(!$modelOrderItem) {
                $modelOrderItem = new ModelOrderItem();
            }
            $modelOrderItem->Product_ID = $orderItem['productId'];
            $modelOrderItem->Quantity = $orderItem['quantity'];
            $modelOrderItem->PriceWithoutVat = $orderItem['priceWithoutVat'];
            $modelOrderItem->PriceWithVat = $orderItem['priceWithVat'];
            $modelOrderItem->Order_ID = $this->orderID;
            $modelOrderItem->save();
        }

    }

    private function updateInvoiceAddress(array $invoiceAddressData) {
        $invoiceAddress = ModelAddress::getAddress($this->order->InvoiceAddress_ID);
        if(!$invoiceAddress) {
            $invoiceAddress = new ModelAddress();
        }
        if(isset($invoiceAddressData['state'])) {
            $countryID = ModelCountry::getCountryByCode($invoiceAddressData['state']);
        }
        $invoiceAddress->FirstName = $invoiceAddressData['firstName'];
        $invoiceAddress->LastName = $invoiceAddressData['lastName'];
        $invoiceAddress->CompanyName = $invoiceAddressData['companyName'];
        $invoiceAddress->IC = $invoiceAddressData['identification'];
        $invoiceAddress->DIC = $invoiceAddressData['taxIdentification'];
        $invoiceAddress->Country_ID = $countryID??null;
        $invoiceAddress->Street = $invoiceAddressData['street'];
        $invoiceAddress->ZipCode = $invoiceAddressData['zipCode'];
        $invoiceAddress->Phone = $invoiceAddressData['phone'];
        $invoiceAddress->Email = $invoiceAddressData['email'];
        $invoiceAddress->City = $invoiceAddressData['city'];
        $invoiceAddress->save();

    }

    private function updateDeliveryAddress(array $deliveryAddressData) {
        $deliveryAddress = ModelAddress::getAddress($this->order->DeliveryAddress_ID);
        if(!$deliveryAddress) {
            $deliveryAddress = new ModelAddress();
        }
        if(isset($deliveryAddress['state'])) {
            $countryID = ModelCountry::getCountryByCode($deliveryAddressData['state']);
        }
        $deliveryAddress->FirstName = $deliveryAddressData['firstName'];
        $deliveryAddress->LastName = $deliveryAddressData['lastName'];
        $deliveryAddress->Country_ID = $countryID??null;
        $deliveryAddress->Street = $deliveryAddressData['street'];
        $deliveryAddress->ZipCode = $deliveryAddressData['zipCode'];
        $deliveryAddress->Phone = $deliveryAddressData['phone'];
        $deliveryAddress->Email = $deliveryAddressData['email'];
        $deliveryAddress->City = $deliveryAddressData['city'];
        $deliveryAddress->save();
    }

    private function getShipping(ModelOrder $modelOrder) {
        return [
            'id' => $modelOrder->shipping->ID,
            'code' => $modelOrder->shipping->Code,
            'name' => $modelOrder->shipping->Name,
            'type' => $modelOrder->shipping->Type,
            'priceWithoutVat' => $modelOrder->PriceShippingWithoutVat,
            'priceWithVat' => $modelOrder->PriceShippingWithVat,
            'currency' => $modelOrder->currency->Mark,
            'currencyRate' => $modelOrder->currency->Ratio,
        ];
    }

    private function updateShipping(\Doctrine_Record|ModelOrder $order, mixed $shipping) {
        //TODO bude vůbec aktualizovat? Zbývá vyjasnit.
    }

    private function isPickupPlaceChosen(ModelOrder $order): bool {
        return $order->Zasilkovna_ID || $order->PPL_ID || $order->Balikovna_ID;
    }

    private function getPickupDeliveryPlace(ModelOrder $order):?array {
        if($order->Zasilkovna_ID) {
            $pickupDetails = ModelZasilkovna::getZasilkovna($order->Zasilkovna_ID);
            return [
                'id' => $pickupDetails->PickupPlace_ID,
                'code' => $pickupDetails->PickupPlace_ID,
                'name' => $pickupDetails->PickupPlaceName,
                'address' => $pickupDetails->PickupPlaceAddress,
            ];
        }
        if($order->PPL_ID) {
            $pickupDetails = ModelPPL::getPPL($order->PPL_ID);
            return [
                'id' => $pickupDetails->PickupPlace_ID,
                'code' => $pickupDetails->PickupPlaceCode,
                'name' => $pickupDetails->PickupPlaceName,
                'address' => $pickupDetails->PickupPlaceAddress,
            ];
        }

        if($order->Balikovna_ID) {
            $pickupDetails = ModelBalikovna::getBalikovna($order->Balikovna_ID);
            return [
                'id' => $pickupDetails->PickupPlace_ID,
                'code' => $pickupDetails->PickupPlace_ID,
                'name' => $pickupDetails->PickupPlaceName,
                'address' => $pickupDetails->PickupPlaceAddress,
            ];
        }

        return null;
    }

}