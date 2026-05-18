<?php
use admin\logic\Order\conversionCodes\ZboziCZ\ZboziKonverze;
use admin\logic\Order\conversionCodes\ZboziCZ\ZboziKonverzeException;
use admin\logic\Order\CustomSheet;
use admin\logic\Payment\Csob;
use admin\logic\Payment\Gopay;
use Admin_Model_Address as Address;
use Admin_Model_Order as Order;
use Admin_Model_Payment as Payment;
use Admin_Model_PPL as PPL;
use Admin_Model_Shipping as Shipping;
use Admin_Model_Zasilkovna as Zasilkovna;
use Admin_Model_Balikovna as Balikovna;
use common\logic\Eshop\Eshop;
use common\logic\Front\Cart as Cart;
use common\logic\Front\CartStep\CartStep as CartStep;
use Common_Model_Country as Country;
use Common_Model_CountryLang as CountryLang;
use default\components\Order as OrderComponents;
use Defr\QRPlatba\QRPlatba;
use user\logic\UserClientSession;
use User_Model_User as User;

class OrderController extends BaseController {

    const REGISTER_USER_EXISTS_SESSION = 'register-user-exists-session';
    const SHIPPING_PAYMENT_SESSION = 'shipping-payment-session';
    const USER_DETAILS_SESSION = 'user-detail-session';


    public function step1Action() {
        $cart = Cart::getInstance();
        if ($cart->getTotalCount() == 0) {
            $this->forward('empty', 'cart', 'default');
            return;
        }

        $rue = new Zend_Session_Namespace(self::REGISTER_USER_EXISTS_SESSION);
        $sps = new Zend_Session_Namespace(self::SHIPPING_PAYMENT_SESSION);
        $uds = new Zend_Session_Namespace(self::USER_DETAILS_SESSION);


        $userInfo = [
            'FirstName' => $uds->FirstName,
            'LastName' => $uds->LastName,
            'Street' => $uds->Street,
            'DescriptionNumber' => $uds->DescriptionNumber,
            'City' => $uds->City,
            'ZipCode' => $uds->ZipCode,
            'Country' => $uds->Country,
            'Email' => $uds->Email,
            'Phone' => $uds->Phone,
            'Description' => $uds->Description,
            'CompanyName' => $uds->CompanyName,
            'DIC' =>$uds->DIC,
            'IC' => $uds->IC,
            'DFirstName' => $uds->DFirstName,
            'DLastName' => $uds->DLastName,
            'DStreet' =>  $uds->DStreet,
            'DCity' => $uds->DCity,
            'DDescriptionNumber' =>  $uds->DDescriptionNumber,
            'DZipCode' =>  $uds->DZipCode,
            'DCountry' =>  $uds->DCountry,
            'CompleteOrder' => $uds->CompleteOrder,
        ];

        $user = User::getCurrentUser();
        $invoiceAddress = $user ? Address::getMainAddress($user->ID, Address::TYPE_INVOICE) : null;
        $deliveryAddress = $user ? Address::getMainAddress($user->ID, Address::TYPE_DELIVERY) : null;

        $invoiceAddresses = $user ? Address::getAddresses($user->ID, Address::TYPE_INVOICE):null;
        $deliveryAddresses = $user ? Address::getAddresses($user->ID, Address::TYPE_DELIVERY):null;

        $params = [
            'msg' => $rue->msg ?: null,
            'cartSteps' => OrderComponents::cartSteps(CartStep::ORDER_ADDRESS),
            'orderRecapitulation' => OrderComponents::orderRecapitulation(null, step: 1),
            'user' => $user,
            'userInfo' => $userInfo,
            'invoiceAddress' => $invoiceAddress,
            'invoiceAddresses' => $invoiceAddresses,
            'deliveryAddress' => $deliveryAddress,
            'deliveryAddresses' => $deliveryAddresses,
            'title' => translate('Informace o Vás'),
            'metaDescription' => translate('Informace o Vás'),
            'metaKeywords' => translate('Informace o Vás'),
            'countries' => CountryLang::getCountriesByIDs(Country::ALLOWED_COUNTRIES),
            'contentClass' => 'light-grey',
        ];

        $this->renderLatte($params);

        $rue->msg = '';
    }

    public function step1ProcessAction() {
        $request = $this->getRequest();

        if (!$request->getParam('FirstName')) {
            $this->_helper->redirector('step-1', 'order', 'default');
            return;
        }

        $isDelivery = $this->getRequest()->getParam('DStreet') &&
            $this->getRequest()->getParam('DCity') &&
            $this->getRequest()->getParam('DZipCode');

        $uds = new Zend_Session_Namespace(self::USER_DETAILS_SESSION);
        $uds->FirstName = $this->getRequest()->getParam('FirstName');
        $uds->LastName = $this->getRequest()->getParam('LastName');
        $uds->Street = $this->getRequest()->getParam('Street');
        $uds->DescriptionNumber = $this->getRequest()->getParam('DescriptionNumber');
        $uds->City = $this->getRequest()->getParam('City');
        $uds->ZipCode = $this->getRequest()->getParam('ZipCode');
        $uds->Country = $this->getRequest()->getParam('Country');
        $uds->DCountry = $this->getRequest()->getParam('DCountry');
        $uds->Email = $this->getRequest()->getParam('Email');
        $uds->Phone = $this->getRequest()->getParam('Phone');
        $uds->Description = $this->getRequest()->getParam('Description');
        $uds->IsCompany = $this->getRequest()->getParam('IsCompany');
        $uds->CompanyName = $this->getRequest()->getParam('CompanyName');
        $uds->DIC = $this->getRequest()->getParam('DIC');
        $uds->IC = $this->getRequest()->getParam('IC');
        $uds->IsDelivery = $isDelivery?1:0;
        $uds->DFirstName = $this->getRequest()->getParam('DFirstName');
        $uds->DLastName = $this->getRequest()->getParam('DLastName');
        $uds->DStreet = $this->getRequest()->getParam('DStreet');
        $uds->DCity = $this->getRequest()->getParam('DCity');
        $uds->DDescriptionNumber = $this->getRequest()->getParam('DDescriptionNumber');
        $uds->DZipCode = $this->getRequest()->getParam('DZipCode');


        // vytvoreni uzivatele
        if (!UserClientSession::getCurrentUserID() && $request->getParam('IsUser') == 'on') {
            if (User::getUserByEmail($request->getParam('Email'))) {
                $rue = new Zend_Session_Namespace(self::REGISTER_USER_EXISTS_SESSION);
                $rue->msg = translate('Registraci se nepodařilo provést zadaný e-mail se již v systému nachází.');

                $this->_helper->redirector('step-2', 'order', 'default');
                return;
            }

            $user = User::createUser($request->getParam('Email'), $request->getParam('Password'), User::TYPE_CUSTOMER, Eshop::getInstance()->getEshop()->ID);
            $userID = $user->ID;

            Address::createAddress(Address::TYPE_INVOICE, $request, $userID);
            if ($this->getRequest()->getParam('IsDeliveryAddress'))
                Address::createAddress(Address::TYPE_DELIVERY, $request, $userID);
        }
        $this->_helper->redirector('step-2', 'order', 'default');

    }

    public function step2Action() {
        $cart = Cart::getInstance();
        if ($cart->getTotalCount() == 0) {
            $this->forward('empty', 'cart', 'default');
            return;
        }

        $sps = new Zend_Session_Namespace(self::SHIPPING_PAYMENT_SESSION);
        $shippingID = $sps->Shipping_ID;
        $paymentID = $sps->Payment_ID;

        if ($shippingID == Admin_Model_Zasilkovna::ZASILKOVNA_CZ_ID ||
            $shippingID == Admin_Model_Zasilkovna::ZASILKOVNA_SK_ID ||
            $shippingID == Admin_Model_PPL::PPL_PARCEL_ID ||
            $shippingID == Admin_Model_Balikovna::BALIK_NA_POSTU_ID ||
            $shippingID == Admin_Model_Balikovna::BALIKOVNA_ID) {
            $pickupPointID = $sps->PickupPoint_ID;
            $pickupPointName = $sps->PickupPoint_Name;
            $pickupPointAddress = $sps->PickupPoint_Address;
            $pickupPointCode = $sps->PickupPoint_Code;
        }

        $activeShippings = Shipping::getActiveShippings(null, $cart);
        $activePayments = Payment::getActivePayments();

        $uds = new Zend_Session_Namespace(self::USER_DETAILS_SESSION);
        $userInfo = [
            'FirstName' => $uds->FirstName,
            'LastName' => $uds->LastName,
            'Street' => $uds->Street,
            'DescriptionNumber' => $uds->DescriptionNumber,
            'City' => $uds->City,
            'ZipCode' => $uds->ZipCode,
            'Country' => $uds->Country,
            'Email' => $uds->Email,
            'Phone' => $uds->Phone,
            'Description' => $uds->Description,
            'IsCompany' => $uds->IsCompany,
            'CompanyName' => $uds->CompanyName,
            'DIC' =>$uds->DIC,
            'IC' => $uds->IC,
            'IsDelivery' => $uds->IsDelivery,
            'DFirstName' => $uds->DFirstName,
            'DLastName' => $uds->DLastName,
            'DStreet' =>  $uds->DStreet,
            'DCity' => $uds->DCity,
            'DDescriptionNumber' =>  $uds->DDescriptionNumber,
            'DZipCode' =>  $uds->DZipCode,
            'DCountry' =>  $uds->DCountry,
            'UserID' => $uds->UserID,
            'CompleteOrder' => $uds->CompleteOrder,
        ];

        $this->renderLatte([
            'orderRecapitulation' => OrderComponents::orderRecapitulation(null, $shippingID??$activeShippings[0]['ID'], $paymentID??$activePayments[0]['ID'], step: 2),
            'cartSteps' => OrderComponents::cartSteps(CartStep::ORDER_PAYMENT_SHIPPING),
            'shippings' => $activeShippings,
            'sps' => $sps,
            'payments' => $activePayments,
            'title' => translate('Doprava a platba'),
            'metaDescription' => translate('Doprava a platba'),
            'metaKeywords' => translate('Doprava a platba'),
            'shippingID' => $shippingID,
            'paymentID' => $paymentID,
            'pickupPointID' => $pickupPointID ?? null,
            'pickupPointName' => $pickupPointName ?? null,
            'pickupPointAddress' => $pickupPointAddress ?? null,
            'pickupPointCode' => $pickupPointCode ?? null,
            'contentClass' => 'light-grey',
            'userInfo'=> $userInfo

        ]);
    }

    public function step2ProcessAction() {
        $request = $this->getRequest();
        $cart = Cart::getInstance();
        $userID = $this->getRequest()->getParam('UserID');

        if (!$request->getParam('Shipping_ID') || !$request->getParam('Payment_ID')) {
            $this->_helper->redirector('step-2', 'order', 'default');
            return;
        }

        $sps = new Zend_Session_Namespace(self::SHIPPING_PAYMENT_SESSION);
        $sps->Shipping_ID = $request->getParam('Shipping_ID');
        $sps->Payment_ID = $request->getParam('Payment_ID');
        $sps->PickupPoint_ID = $request->getParam('PickupPoint_ID');
        $sps->PickupPoint_Name = $request->getParam('PickupPoint_Name');
        $sps->PickupPoint_Address = $request->getParam('PickupPoint_Address');
        $sps->PickupPoint_Code = $request->getParam('PickupPoint_Code');


        $eshop = Eshop::getInstance();

        if (UserClientSession::getCurrentUserID())
            $userID = UserClientSession::getCurrentUserID();
        // shipping & payment
        $shipping = Shipping::getShippingByID($request->getParam('Shipping_ID'), $cart, $request->getParam('Country'));
        $shippingPriceWithoutVat = $shipping ? $shipping['PriceWithoutVat'] : 0;
        $shippingPriceWithVat = $shipping ? $shipping['PriceWithVat'] : 0;
        $shippingID = $request->getParam('Shipping_ID');
        $paymentID = $request->getParam('Payment_ID');

        $payment = Payment::getPaymentByID($request->getParam('Payment_ID'));
        $paymentPriceWithoutVat = $payment ? $payment['PriceWithoutVat'] : 0;
        $paymentPriceWithVat = $payment ? $payment['PriceWithVat'] : 0;

        // total price
        $priceTotalWithoutVat = $cart->getTotalPriceWithoutVat() + $shippingPriceWithoutVat + $paymentPriceWithoutVat;
        $priceTotalWithVat = $cart->getTotalPriceWithVat() + $shippingPriceWithVat + $paymentPriceWithVat;

        // create Order
        $order = new Order();
        $order->Eshop_ID = $eshop->getEshop()->ID;
        $order->Vat_ID = $eshop->getEshop()->Vat_ID;
        $order->Currency_ID = $this->currentCurrency['ID'];
        $order->Language_ID = $eshop->getEshop()->Language_ID;
        $order->Shipping_ID = $shippingID;

        if ($shippingID == Zasilkovna::ZASILKOVNA_CZ_ID || $shippingID == Zasilkovna::ZASILKOVNA_SK_ID)
            $order->Zasilkovna_ID = Zasilkovna::assignZasilkovna($sps->PickupPoint_ID, $sps->PickupPoint_Name, $sps->PickupPoint_Address)->ID;

        if ($shippingID == Balikovna::BALIKOVNA_ID || $shippingID == Balikovna::BALIK_NA_POSTU_ID)
            $order->Balikovna_ID = Balikovna::assignBalikovna($sps->PickupPoint_ID, $sps->PickupPoint_Name, $sps->PickupPoint_Address)->ID;

        if ($shippingID == PPL::PPL_PARCEL_ID)
            $order->PPL_ID = PPL::assignPPL($sps->PickupPoint_ID, $sps->PickupPoint_Name, $sps->PickupPoint_Address, $sps->PickupPoint_Code)->ID;

        $order->Payment_ID = $paymentID;
        $order->Description = $request->getParam('Description');
        $order->CompleteOrder = !empty($request->getParam('CompleteOrder')) ? 1 : 0;
        $order->PriceShippingWithoutVat = $shippingPriceWithoutVat;
        $order->PriceShippingWithVat = $shippingPriceWithVat;
        $order->PricePaymentWithoutVat = $paymentPriceWithoutVat;
        $order->PricePaymentWithVat = $paymentPriceWithVat;
        $order->InvoiceAddress_ID = Address::createAddress(Address::TYPE_INVOICE, $request)->ID;
        if ( $request->getParam('IsDelivery'))
            $order->DeliveryAddress_ID = Address::createAddress(Address::TYPE_DELIVERY, $request)->ID;

        $order->PriceProductWithoutVat = $cart->getTotalPriceWithoutVat();
        $order->PriceProductWithVat = $cart->getTotalPriceWithVat();
        $order->PriceTotalWithoutVat = $priceTotalWithoutVat;
        $order->PriceTotalWithVat = $priceTotalWithVat;

        if ($userID)
            $order->User_ID = $userID;
        $order->save();

        // overeno zakazniky
        /*if ($eshop->getSettings('HeurekaOverenoZakazniky') && $eshop->getSettings('HeurekaSecretKey')) {
            $shopCertification = new ShopCertification($eshop->getSettings('HeurekaSecretKey'));
            $shopCertification->setEmail($request->getParam('Email'));
            $shopCertification->setOrderId((int)$order->ID);
            foreach ($order->orderItems as $orderItem)
                $shopCertification->addProductItemId($orderItem->Product_ID);
            $shopCertification->logOrder();
        }*/

        $cart->resetCart($userID);
        CustomSheet::generatePDF($order->ID);

        if (in_array($order['payment']['Type'], [Payment::TYPE_CSOB])) {
            $showCsobRedirectionModal = true;
        } else {
            $showCsobRedirectionModal = false;
        }
        $this->_helper->redirector('step-3', 'order', 'default', ['order' => $order->Folder, 'orderNumber' => $order->OrderNumber, 'showCsobRedirectionModal' => $showCsobRedirectionModal]);
    }

    public function step3Action() {
        $orderHash = $this->getRequest()->getParam('order');
        $order = Order::getOrderByHash($orderHash);
        $showCsobRedirectionModal = $this->getRequest()->getParam('showCsobRedirectionModal');
        if (!$order)
            throw new Exception('Order not found');

        $order = $order[0];
        $paymentState = '';

        if (in_array($order['payment']['Type'], [Payment::TYPE_CSOB])) {
            foreach ($order['csobPayments'] as $csobPayment) {
                $csobResponse = Csob::getInstance();
                $statusID = $csobResponse->client->paymentStatus($csobPayment['CsobID']);

                if (isset($statusID) && ($statusID == 4 || $statusID == 7)) {
                    if (!$order['DatePayed']) {
                        Order::setOrderPaid($order['ID']);
                    }
                    $paymentState = 'PAID';
                    }
                }
        }

        $qrPlatba = false;
        if ( $order['payment']['Type'] == Payment::TYPE_BANK ) {
            $qrPlatba = new QRPlatba();
            $qrPlatba->setAccount('xxxxxxxxxx/xxxx'); // nastavení č. účtu
            $qrPlatba->setVariableSymbol($order['OrderNumber']);
            $qrPlatba->setAmount($order['PriceTotalWithVat']);
            $qrPlatba->setCurrency('CZK');
            $qrPlatba->setDueDate(new \DateTime());
            $qrPlatba->getQRCodeImage();
        }

        $this->renderLatte([
            'eshop' => Eshop::getInstance(),
            'state' => $paymentState,
            'qrPlatba' => $qrPlatba,
            'order' => $order,
            'showCsobRedirectionModal' => $showCsobRedirectionModal,
            'cartSteps' => OrderComponents::cartSteps(CartStep::ORDER_COMPLETED),
            'orderRecapitulation' => OrderComponents::orderRecapitulation($this->getRequest()->getParam('order'), step: 3),
            'orderNumber' => $this->getRequest()->getParam('orderNumber'),
            'title' => translate('Objednávka dokončena'),
            'metaDescription' => translate('Objednávka dokončena'),
            'metaKeywords' => translate('Objednávka dokončena'),
            'contentClass' => 'light-grey',
        ]);
    }

    public function getAddressAction() {
        $addressID = $this->getRequest()->getParam('AddressID');
        if (!$addressID) {
            echo Zend_Json::encode(['error' => 'Address ID is required']);
            return;
        }
        $address = Address::getAddressByID($addressID);
        echo Zend_Json::encode($address);
    }

    public function shippingPaymentsAction() {
        $payments = Payment::getPaymentsForShipping($this->getRequest()->getParam('ShippingID'));

        echo Zend_Json::encode($payments);
    }

    private function zboziConversion(Order $order) {
        try {
            // Initialize
            $zbozi = new ZboziKonverze(54930, "stvAepsVeiWqRm/5wavsrwAXlJuYxYGu");

            // Set order details
            $zbozi->setOrder(array(
                "orderId" => $order->OrderNumber,
                "email" => $order->deliveryAddress->Email,
                "deliveryType" => $order->shipping->Name,
                "deliveryPrice" => $order->shipping->Price,
                "otherCosts" => 0,
                "paymentType" => $order->payment->Type,
            ));

            foreach ($order->orderItems as $orderItem) {
                if ($orderItem['Product_ID'] == null) {
                    continue;
                }
                $zbozi->addCartItem(array(
                    "itemId" => $orderItem['Product_ID'],
                    "productName" => Admin_Model_ProductLang::getProductNameByIDAndLanguageID($orderItem['Product_ID'], 1),
                    "quantity" => $orderItem['Quantity'],
                    "unitPrice" => $orderItem['PriceWithoutVat']
                ));
            }

            // Finally send request
            $zbozi->send();

        } catch (ZboziKonverzeException $e) {
            // Error should be handled according to your preference
            error_log("Chyba konverze: " . $e->getMessage());
        }
    }
}