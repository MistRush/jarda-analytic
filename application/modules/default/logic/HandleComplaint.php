<?php

use Admin_Model_ComplaintItem as ComplaintItem;
use common\logic\Email\EmailFactory;
use Admin_Model_Complaint as Complaint;

class Default_Logic_HandleComplaint {
    public  function processComplaint( $request)
    {
        $userData = $this->extractUserData($request);
        $companyData = $this->extractCompanyData($request);
        $addressData = $this->extractAddressData($request);
        $deliveryData = $this->extractDeliveryData($request);

        try {
            $complaint = Complaint::createComplaint(
                $userData,
                $companyData,
                $addressData,
                $deliveryData
            );

            $this->createComplaintItems($request, $complaint->ID);

            EmailFactory::sendComplaintEmail($complaint);
            return $complaint;

        } catch (Exception $e) {
            // Log the exception or handle it as needed
            throw new Exception("Error processing complaint: " . $e->getMessage());
        }

    }

    private function extractUserData($request): array
    {
        return [
            'Name' => $request->getParam('Name'),
            'Email' => $request->getParam('Email'),
            'Phone' => $request->getParam('Phone'),
            'Package' => $request->getParam('Package'),
        ];
    }

    private function extractCompanyData($request): ?array
    {
        return $request->getParam('IsCompany') == '1'
            ? [
                'CompanyName' => $request->getParam('CompanyName'),
                'IC' => $request->getParam('IC'),
                'DIC' => $request->getParam('DIC')
            ]
            : null;
    }

    private function extractAddressData($request): array
    {
        return [
            'Street' => $request->getParam('InvoiceStreet'),
            'City' => $request->getParam('InvoiceCity'),
            'ZipCode' => $request->getParam('InvoiceZipCode'),
            'Country_ID' => $request->getParam('InvoiceCountry_ID')
        ];
    }

    private function extractDeliveryData($request): ?array
    {
        return $request->getParam('IsDeliveryAddress') == '1'
            ? [
                'Name' => $request->getParam('DeliveryName'),
                'Street' => $request->getParam('DeliveryStreet'),
                'City' => $request->getParam('DeliveryCity'),
                'ZipCode' => $request->getParam('DeliveryZipCode'),
                'Country_ID' => $request->getParam('DeliveryCountry_ID')
            ]
            : null;
    }

    private static function createComplaintItems($request, $complaintId)
    {
        $index = 1;
        while ($request->getParam("InvoiceNumber{$index}") !== null) {
            $itemData = [
                'InvoiceNumber' => $request->getParam("InvoiceNumber{$index}"),
                'ProductCode' => $request->getParam("ProductCode{$index}"),
                'DefectDescription' => $request->getParam("DefectDescription{$index}"),
                'Quantity' => $request->getParam("Quantity{$index}")
            ];

            ComplaintItem::createItem($complaintId, $itemData);
            $index++;
        }
    }


}