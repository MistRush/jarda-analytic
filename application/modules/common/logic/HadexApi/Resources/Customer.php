<?php

namespace common\logic\HadexApi\Resources;

use common\logic\HadexApi\Converters\DateTimeConverter;
use User_Model_User as ModelUser;
use User_Model_UserMeta as ModelUserMeta;
use Common_Model_Eshop as ModelEshop;

class Customer {

    private ?int $customerID;
    private ?string $changedSince;

    public function __construct(int $customerID = null) {
        $this->customerID = $customerID;
    }


    public function getCustomers($filter = null, $changedSince = null): array {
        $this->changedSince = $changedSince;
        $customers = ModelUser::getUsersByFilter($this->customerID, $filter, $changedSince);
        $result = [];
        foreach ($customers as $customer) {
            $result[] = $this->getCustomerResultEntity($customer);
        }
        return $result;
    }

    public function createCustomer(array $data): bool|array {
        $fieldsCheck = $this->createCustomerRequiredFieldsCheck($data);
        if ($fieldsCheck['status'] === 'error') {
            return $fieldsCheck;
        }

        if(ModelUser::getUserByExternalID($data['externalId'])) {
            return ['status' => 'error', 'errorCode' => 409, 'message' => 'Customer with this externalId already exists'];
        }

        $customer = new ModelUser();
        $customer->Name = $data['login'];
        if(isset($data['firstName']) && isset($data['lastName'])) {
            $customer->ContactName = $data['firstName'] . ' ' . $data['lastName'];
        }
        $customer->Active = $data['active'] ?? 1;
        $customer->AllowInvoicePayment = $data['allowInvoicePayment'] ?? 0;
        $customer->BasePriceTypeCode = $data['basePriceTypeCode'];
        $customer->Discount = $data['discount'] ?? 0;
        $customer->DeactivateQuantityMin = $data['deactivateQuantityMin'] ?? false;
        $customer->Code = $data['code'];
        $customer->invoiceAddress->CompanyName = $data['companyName'];
        $customer->invoiceAddress->IC = $data['identification'];
        $customer->invoiceAddress->DIC = $data['taxIdentification'];
        $customer->invoiceAddress->country->Code = $data['state'];
        $customer->invoiceAddress->Street = $data['street'];
        $customer->invoiceAddress->City = $data['city'];
        $customer->invoiceAddress->ZipCode = $data['zipCode'];
        $customer->invoiceAddress->Phone = $data['phone'];
        $customer->invoiceAddress->Email = $data['email'];
        $customer->ExternalID = $data['externalId'];
        $customer->Eshop_ID = ModelEshop::HADEX_CZ_ID;
        $customer->Synced = true;
        $customer->save();

        $this->customerID = $customer->ID;

        $customerMetasData = $data['customerMetas']??null;


        if (isset($customerMetasData[0]) && $customerMetasData) {
            foreach ($customerMetasData as $dataItem) {
                $this->handleCustomerMetaData($dataItem);
            }
        }

        return $this->getCustomerResultEntity($customer);
    }

    public function updateCustomer(array $data) {
        if($data['id']) {
            $this->customerID = $data['id'];
        }
        if(!$this->customerID) {
            //kontrola, jeslti je aspoň externalID kdyz uz není id
            $fieldsCheck = $this->updateCustomerRequiredFieldsCheck($data);
            if ($fieldsCheck['status'] === 'error') {
                return $fieldsCheck;
            }
            $customer = ModelUser::getUserByExternalID($data['externalId']);
        } else {
            $customer = ModelUser::getUser($this->customerID);
        }

        if (!$customer) {
            return ['status' => 'error', 'errorCode' => 404, 'message' => 'Customer not found'];
        }

        if(isset($data['login'])) {
            $customer->Name = $data['login'];
        }
        if(isset($data['firstName']) && isset($data['lastName'])) {
            $customer->ContactName = $data['firstName'] . ' ' . $data['lastName'];
        }
        if(isset($data['active'])) {
            $customer->Active = $data['active'];
        }
        if(isset($data['basePriceTypeCode'])) {
            $customer->BasePriceTypeCode = $data['BasePriceTypeCode'];
        }
        if(isset($data['discount'])) {
            $customer->Discount = $data['discount'];
        }
        if(isset($data['deactivateQuantityMin'])) {
            $customer->DeactivateQuantityMin = $data['deactivateQuantityMin'];
        }
        if(isset($data['code'])) {
            $customer->Code = $data['code'];
        }
        if(isset($data['allowInvoicePayment'])) {
            $customer->AllowInvoicePayment = $data['allowInvoicePayment'];
        }
        if(isset($data['companyName'])) {
            $customer->invoiceAddress->CompanyName = $data['companyName'];
        }
        if(isset($data['identification'])) {
            $customer->invoiceAddress->IC = $data['identification'];
        }
        if(isset($data['taxIdentification'])) {
            $customer->invoiceAddress->DIC = $data['taxIdentification'];
        }
        if(isset($data['state'])) {
            $customer->invoiceAddress->country->Code = $data['state'];
        }
        if(isset($data['street'])) {
            $customer->invoiceAddress->Street = $data['street'];
        }
        if(isset($data['city'])) {
            $customer->invoiceAddress->City = $data['city'];
        }
        if(isset($data['zipCode'])) {
            $customer->invoiceAddress->ZipCode = $data['zipCode'];
        }
        if(isset($data['phone'])) {
            $customer->invoiceAddress->Phone = $data['phone'];
        }
        if(isset($data['email'])) {
            $customer->invoiceAddress->Email = $data['email'];
        }

        $customer->save();

        $customerMetasData = $data['customerMetas']??null;
        if (isset($customerMetasData[0]) && $customerMetasData) {
            ModelUserMeta::deleteCustomerMetas($this->customerID);
            foreach ($customerMetasData as $dataItem) {
                $this->handleCustomerMetaData($dataItem);
            }
        }

        return $this->getCustomerResultEntity($customer);

    }


    private function createCustomerRequiredFieldsCheck($data): array|bool {
        $requiredFields = [
            'externalId' => 'Missing externalId',
            'login' => 'Missing login',
        ];

        $check = $this->checkRequiredFields($data, $requiredFields);
        if ($check !== true) {
            return $check;
        }

        return ['status' => 'success'];
    }

    private function updateCustomerRequiredFieldsCheck($data): array|bool {
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


    private function getCustomerResultEntity(ModelUser $modelUser): array {
        $nameArray = explode(' ', $modelUser->ContactName);
        $firstName = $nameArray[0];
        $lastName = $nameArray[1]??null;
        return [
            'id' => $modelUser->ID,
            'createdOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelUser->DateTimeCreated, 'ISO-8601'),
            'updatedOnUtc' => DateTimeConverter::convertFromMySqlToUtc($modelUser->DateTimeUpdated, 'ISO-8601'),
            'login' => $modelUser->Name,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'companyName' => $modelUser->invoiceAddress?$modelUser->invoiceAddress->CompanyName:null,
            'identification' =>$modelUser->invoiceAddress? $modelUser->invoiceAddress->IC:null,
            'taxIdentification' => $modelUser->invoiceAddress? $modelUser->invoiceAddress->DIC:null,
            'state' => $modelUser->invoiceAddress->country->Code,
            'city' => $modelUser->invoiceAddress->City,
            'zipCode' => $modelUser->invoiceAddress->ZipCode,
            'phone' => $modelUser->invoiceAddress->Phone,
            'email' => $modelUser->invoiceAddress->Email,
            'active' => $modelUser->Active,
            'synced' => $modelUser->Synced??false,
            'externalId' => $modelUser->ExternalID,
            'basePriceTypeCode' => $modelUser->BasePriceTypeCode,
            'discount'=>$modelUser->Discount,
            'deactivateQuantityMin' => $modelUser->DeactivateQuantityMin,
            'allowInvoicePayment' => $modelUser->AllowInvoicePayment,
            'customerMetas' => $this->getCustomerMetas($modelUser),
        ];

    }

    private function handleCustomerMetaData(array $data): void {
        if(isset($data['customerMetas']['id'])) {
            $customerMeta = ModelUserMeta::getUserMetaByID($data['customerMetas']['id']);
            if(!$customerMeta) {
                return;
            }
            $customerMeta->Code = $data['key'];
            $customerMeta->Value = $data['value'];
            $customerMeta->save();
            return;
        }

        $customerMeta = new ModelUserMeta();
        $customerMeta->User_ID = $this->customerID;
        $customerMeta->Code = $data['code'];
        $customerMeta->Value = $data['value'];
        $customerMeta->save();
    }

    private function getCustomerMetas(ModelUser $modelUser): array {
        $customerMetas = ModelUserMeta::getUserMetasByUserID($modelUser->ID);
        $customerMetasArray = [];
        foreach ($customerMetas as $customerMeta) {
            $customerMetasArray[] = [
                'id' => $customerMeta->ID,
                'code' => $customerMeta->Code,
                'value' => $customerMeta->Value,
            ];
        }
        return $customerMetasArray;

    }


}