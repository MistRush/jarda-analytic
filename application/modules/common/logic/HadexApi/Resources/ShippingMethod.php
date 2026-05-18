<?php

namespace common\logic\HadexApi\Resources;

use common\logic\HadexApi\Converters\DateTimeConverter;
use Admin_Model_Shipping as ModelShipping;
use Admin_Model_ShippingPrice as ModelShippingPrice;
use Admin_Model_ShippingPayment as ModelShippingPayment;
use Admin_Model_Payment as ModelPayment;
use Common_Model_Eshop as ModelEshop;

class ShippingMethod {

    private ?int $shippingMethodID;
    private ?string $changedSince;

    public function __construct(int $shippingMethodID = null) {
        $this->shippingMethodID = $shippingMethodID;
    }


    /**
     * @throws \Doctrine_Query_Exception
     */
    public function getShippingMethods(): array {
        if ($this->shippingMethodID) {
            $shippingMethod = ModelShipping::getShipping($this->shippingMethodID);
            return [$this->getShippingMethodResultEntity($shippingMethod)];
        }
        $shippingMethods = ModelShipping::getActiveShippingsCollection();
        $result = [];
        foreach ($shippingMethods as $customer) {
            $result[] = $this->getShippingMethodResultEntity($customer);
        }
        return $result;
    }

    public function createShippingMethod(array $data): bool|array {
        $fieldsCheck = $this->createShippingMethodRequiredFieldsCheck($data);
        if ($fieldsCheck['status'] === 'error') {
            return $fieldsCheck;
        }

        if (isset($data['externalId']) && $data['externalId'] && ModelShipping::getShippingByExternalID($data['externalId'])) {
            return ['status' => 'error', 'errorCode' => 409, 'message' => 'Shipping with this externalId already exists'];
        }

        if (isset($data['code']) && $data['code'] && ModelShipping::getShippingByCode($data['code'])) {
            return ['status' => 'error', 'errorCode' => 409, 'message' => 'Shipping with this code already exists'];
        }

        $shippingMethod = new ModelShipping();
        $shippingMethod->Name = $data['name'];
        $shippingMethod->Code = $data['code'] ?? null;
        $shippingMethod->Active = $data['isAvailable'] ?? 0;
        $shippingMethod->Description = $data['description'] ?? null;
        $shippingMethod->ExternalID = $data['externalId'] ?? null;
        $shippingMethod->Eshop_ID = ModelEshop::HADEX_CZ_ID;
        $shippingMethod->save();

        $this->shippingMethodID = $shippingMethod->ID;

        $shippingPrices = $data['shippingPrices'] ?? null;
        $availablePayments = $data['availablePayments'] ?? null;

        if (isset($shippingPrices[0]) && $shippingPrices) {
            foreach ($shippingPrices as $dataItem) {
                $this->handleShippingPrice($dataItem);
            }
        }

        if (isset($availablePayments[0]) && $availablePayments) {
            foreach ($availablePayments as $dataItem) {
                $this->handleAvailablePayment($dataItem);
            }
        }

        return $this->getShippingMethodResultEntity($shippingMethod);
    }

    public function updateShippingMethod(array $data) {
        if (!$this->shippingMethodID) {
            //kontrola, jestli je aspoň externalID kdyz uz není id
            $fieldsCheck = $this->updateShippingMethodRequiredFieldsCheck($data);
            if ($fieldsCheck['status'] === 'error') {
                return $fieldsCheck;
            }
            $shippingMethod = ModelShipping::getShippingByExternalID($data['externalId']);
        } else {
            $shippingMethod = ModelShipping::getShipping($this->shippingMethodID);
        }

        if (!$shippingMethod) {
            return ['status' => 'error', 'errorCode' => 404, 'message' => 'Shipping method not found'];
        }

        if (isset($data['name'])) {
            $shippingMethod->Name = $data['name'];
        }

        if (isset($data['availablePayments'])) {
            $availablePayments = $data['availablePayments'];
        }

        if (isset($data['code'])) {
            $shippingMethod->Code = $data['code'];
        }

        if (isset($data['isAvailable'])) {
            $shippingMethod->Active = filter_var($data['isAvailable'], FILTER_VALIDATE_BOOLEAN);
        }

        $shippingMethod->save();

        $shippingPrices = $data['shippingPrices'] ?? null;


        if (isset($shippingPrices[0]) && $shippingPrices) {
            ModelShippingPrice::clearShippingPrices($shippingMethod->ID);
            foreach ($shippingPrices as $dataItem) {
                $this->handleShippingPrice($dataItem);
            }
        }

        if (isset($availablePayments[0]) && $availablePayments) {
            ModelShippingPayment::clearShippingPayments($shippingMethod->ID);
            foreach ($availablePayments as $dataItem) {
                $this->handleAvailablePayment($dataItem);
            }
        }

        return $this->getShippingMethodResultEntity($shippingMethod);

    }


    private function createShippingMethodRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'name' => 'Missing name',
        ];

        $check = $this->checkRequiredFields($data, $requiredFields);
        if ($check !== true) {
            return $check;
        }

        return ['status' => 'success'];
    }

    private function updateShippingMethodRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'externalId' => 'Missing externalId',
        ];

        $check = $this->checkRequiredFields($data, $requiredFields);
        if ($check !== true) {
            return $check;
        }

        return ['status' => 'success'];
    }


    private function checkRequiredFields(array $data, array $requiredFields): array|bool {
        foreach ($requiredFields as $field => $message) {
            if (!isset($data[$field]) || !$data[$field]) {
                return ['status' => 'error', 'errorCode' => 400, 'message' => $message];
            }
        }
        return true;
    }


    private function getShippingMethodResultEntity(ModelShipping $modelShipping): array {
        return [
            "id" => $modelShipping->ID,
            "code" => $modelShipping->Code,
            "name" => $modelShipping->Name,
            "description" => $modelShipping->Description,
            "isAvailable" => $modelShipping->Active,
            "externalId" => $modelShipping->ExternalID,
            "shippingPrices" => $this->getShippingPrices($modelShipping),
            "availablePayments" => $this->getAvailablePayments($modelShipping),
        ];
    }

    private function getShippingPrices(ModelShipping $modelShipping): array {
        $eshop = ModelEshop::getEshopByID($modelShipping->Eshop_ID);
        $result = [];
        foreach ($modelShipping->shippingPrices as $shippingPrice) {
            $result[] = $this->getShippingPriceResultEntity($shippingPrice, $eshop);
        }
        return $result;
    }

    private function getAvailablePayments(ModelShipping $modelShipping): array {
        $eshop = ModelEshop::getEshopByID($modelShipping->Eshop_ID);
        $result = [];

        foreach ($modelShipping->shippingPayments as $shippingPayment) {
            $result[] = $this->getPaymentResultEntity($shippingPayment, $eshop);
        }
        return $result;
    }

    private function getPaymentResultEntity(ModelShippingPayment $shippingPayment, ModelEshop $eshop) {
        return [
            "id" => $shippingPayment->payment->ID,
            "code" => $shippingPayment->payment->Code,
            "name" => $shippingPayment->payment->Name,
            "externalId" => $shippingPayment->payment->ExternalID,
            "value" => $shippingPayment->payment->Price,
            "currencyCode" => $eshop->currency->Mark,
            "description" => $shippingPayment->payment->Description
        ];
    }

    private function getShippingPriceResultEntity(ModelShippingPrice $shippingPrice, ModelEshop $eshop) {
        return [
            "value" => $shippingPrice->PriceWithoutVat,
            "currencyCode" => $eshop->currency->Mark,
            "maxWeight" => $shippingPrice->MaxWeight,
            "maxWidth" => $shippingPrice->MaxWidth,
            "maxDepth" => $shippingPrice->MaxDepth,
            "maxHeight" => $shippingPrice->MaxHeight,
        ];
    }

    private function handleShippingPrice(array $dataItem): void {
        $shippingPrice = new ModelShippingPrice();
        $shippingPrice->Shipping_ID = $this->shippingMethodID;
        $shippingPrice->PriceWithoutVat = $dataItem['value'];
        $shippingPrice->MaxWeight = $dataItem['maxWeight'] ?? null;
        $shippingPrice->MaxWidth = $dataItem['maxWidth'] ?? null;
        $shippingPrice->MaxDepth = $dataItem['maxDepth'] ?? null;
        $shippingPrice->MaxHeight = $dataItem['maxHeight'] ?? null;
        $shippingPrice->save();
    }

    private function handleAvailablePayment(array $paymentDataItem): void {
        $shippingPayment = new ModelShippingPayment();
        $shippingPayment->Shipping_ID = $this->shippingMethodID;
        if ($paymentDataItem['code']) {
            $payment = ModelPayment::getPaymentByCode($paymentDataItem['code']);
            if (!$payment) {
                $payment = new ModelPayment();
            }
            $payment->ExternalID = !empty($paymentDataItem['externalId']) ? $paymentDataItem['externalId'] : null;
            $payment->Name = $paymentDataItem['name'] ?? null;
            $payment->Active = 1;
            $payment->Code = $paymentDataItem['code'] ?? null;
            $payment->Description = $paymentDataItem['description'] ?? null;
            $payment->Eshop_ID = ModelEshop::HADEX_CZ_ID;
            $payment->Price = $paymentDataItem['value'] ?? null;
            $payment->save();

            $shippingPayment->Payment_ID = $payment->ID;
            $shippingPayment->save();
        }
    }


}