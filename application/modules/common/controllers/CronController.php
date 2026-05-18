<?php

use admin\logic\Feed\Facebook;
use admin\logic\Feed\GoogleMerchant;
use admin\logic\Feed\Heureka;
use admin\logic\Feed\Mall;
use admin\logic\Feed\MallAvailability;
use admin\logic\Feed\Zbozi;
use admin\logic\Order\PohodaExport;
use admin\logic\Shipping\Balikobot as BalikobotApi;
use Admin_Model_BalikobotPackage as BalikobotPackage;
use Admin_Model_BalikobotState as BalikobotState;
use Admin_Model_Category as Category;
use Admin_Model_Order as Order;
use Admin_Model_OrderState as OrderState;
use Admin_Model_Page as Page;
use Admin_Model_Product as Product;
use Admin_Model_ApiLog as ApiLog;
use Admin_Model_ProductWatchDog as ProductWatchDog;
use Admin_Model_ProductStock as ProductStock;
use common\logic\Email\EmailFactory;
use User_Model_User as User;
use common\logic\Latte\LatteEngine;
use Common_Model_Eshop as Eshop;
use default\components\Instagram;
use Inspirum\Balikobot\Definitions\Shipper;
use Inspirum\Balikobot\Services\Client;
use Inspirum\Balikobot\Services\Requester;

class Common_CronController extends Clevis_Zend_Controller_Action {

    const SITEMAPS_DIR = 'files/sitemaps/';

    public function init() {
        parent::init();

        $this->disableLayout();
    }

    public function generateSitemapsAction(){
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        $latte = LatteEngine::getInstance();
        $date = date("c", time());

        foreach (Common_Model_Eshop::getEshops() as $eshop){
            $dir = self::SITEMAPS_DIR . $eshop->ID .'/';

            if (!file_exists($dir))
                mkdir($dir, 0777, true);
//
//            $products = Product::loadProductsSitemap($eshop);
//            $file = fopen($dir.'products.xml', 'w');
//            fwrite($file, $latte->renderToString(__DIR__."/../../common/views/latte/sitemap/products.latte", [
//                "products" => $products,
//                "date" => $date,
//                "eshop" => $eshop,
//            ]));
//            fclose($file);
//
//            $categories = Category::loadCategoriesSitemap($eshop);
//            $file = fopen($dir.'categories.xml', 'w');
//            fwrite($file, $latte->renderToString(__DIR__."/../../common/views/latte/sitemap/categories.latte", [
//                "categories" => $categories,
//                "date" => $date,
//                "eshop" => $eshop,
//            ]));
//            fclose($file);

            $pages = Page::loadPagesSitemap($eshop);
            $file = fopen($dir.'pages.xml', 'w');
            fwrite($file, $latte->renderToString(__DIR__."/../../common/views/latte/sitemap/pages.latte", [
                "pages" => $pages,
                "date" => $date,
                "eshop" => $eshop,
            ]));
            fclose($file);

        }
    }

    public function googleMerchantAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        foreach (Eshop::getEshops() as $eshop) {
            $googleExport = new GoogleMerchant(Product::getProductsForFeeds($eshop), $eshop);
            file_put_contents('files/feeds/google-merchant-' . $eshop->language->Code . '.xml', $googleExport->getXml());
        }
    }

    public function heurekaFeedAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        foreach (Eshop::getEshops() as $eshop) {
            $heureka = new Heureka(Product::getProductsForFeeds($eshop), $eshop);
            file_put_contents('files/feeds/heureka-feed-' . $eshop->language->Code . '.xml', $heureka->getXml());
        }
    }

    public function zboziFeedAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        foreach (Eshop::getEshops() as $eshop) {
            $zbozi = new Zbozi(Product::getProductsForFeeds($eshop), $eshop);
            file_put_contents('files/feeds/zbozi-feed-' . $eshop->language->Code . '.xml', $zbozi->getXml());
        }
    }

    public function facebookFeedAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        foreach (Eshop::getEshops() as $eshop) {
            $facebook = new Facebook(Product::getProductsForFeeds($eshop), $eshop);
            file_put_contents('files/feeds/facebook-feed-' . $eshop->language->Code . '.xml', $facebook->getXml());
        }
    }

    public function mallFeedAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');
        $forbiddenCategories = [9823];

        foreach (Eshop::getEshops() as $eshop) {
            $mall = new Mall(Product::getProductsForFeeds($eshop, $forbiddenCategories), $eshop);
            file_put_contents('files/feeds/mall-feed-' . $eshop->language->Code . '.xml', $mall->getXml());
        }
    }

    public function mallAvailabilityAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');
        $forbiddenCategories = [9823];

        foreach (Eshop::getEshops() as $eshop) {
            $mall = new MallAvailability(Product::getProductsForFeeds($eshop, $forbiddenCategories), $eshop);
            file_put_contents('files/feeds/mall-availability-feed-' . $eshop->language->Code . '.xml', $mall->getXml());
        }
    }

    public function clearApiLogAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        ApiLog::clearApiLog();

        echo 'API log cleared';
    }

    public function balikobotTrackOrderAction() {
        $query = Doctrine_Query::create();
        $query->from('Admin_Model_Order object');
        $query->where('object.BalikobotCarrierID IS NOT NULL');
        $query->andWhere('object.OrderStateType_ID NOT IN (4,5)');
        $orders = $query->execute()->toArray();

        foreach ( $orders as $orderItem ) {
            $order = Order::getOrder($orderItem['ID']);
            $result = false;

            $client = new Client(new Requester(BalikobotApi::API_USER, BalikobotApi::API_KEY));
            try {
                $result = $client->trackPackage(Shipper::DPD, $order->BalikobotCarrierID);
            } catch (Exception $exception) {}

            $balikobotPackage = BalikobotPackage::getBalikobotPackageByPackageID($order->BalikobotPackageID);

            if ( $result ) {
                foreach (array_reverse($result) as $resultItem) {
                    $message = $resultItem['date'] . ' ' . $resultItem['name'];

                    $query = Doctrine_Query::create();
                    $query->from('Admin_Model_BalikobotState object');
                    $query->where('object.BalikobotPackage_ID = ?', $balikobotPackage->ID);
                    $query->andWhere('object.Message = ?', $message);
                    $balikobotState = $query->execute()->toArray();

                    if (!$balikobotState) {
                        if ($resultItem['status_id'] == '2.1' || $resultItem['status_id'] == '2.2') {
                            if ($order->DateShipmentTransit == null) {
                                OrderState::createOrderState($order->ID, 3, OrderState::USER_BALIKOBOT);
                            }
                        }

                        if ($resultItem['status_id'] == '1.1' || $resultItem['status_id'] == '1.2') {
                            if ($order->DateShipped == null) {
                                OrderState::createOrderState($order->ID, 4, OrderState::USER_BALIKOBOT);
                            }
                        }

                        BalikobotState::createBalikobotState($balikobotPackage->ID, $resultItem['name_internal'], $resultItem['status_id'], $message);
                    }
                }
            }
        }
    }

    public function updateStockAction() {
        ini_set('memory_limit','-1');
        ini_set('max_execution_time','0');

        $content = file_get_contents('../data/stock/djzd-stock-update.xml');

        $contentArray = xml2array($content);
        $stockItems = $contentArray['rsp:responsePack']['rsp:responsePackItem']['lStk:listStock']['lStk:stock'];

        $allowedStocks = ['01', '04', '07', '13', '14'];

        foreach ( $stockItems as $stockItem ) {
            if ( isset($stockItem['stk:stockHeader']) && isset($stockItem['stk:stockHeader']['stk:storage']) ) {
                $pohodaStock = $stockItem['stk:stockHeader']['stk:storage']['typ:ids'];
                if ( !in_array($pohodaStock , $allowedStocks) )
                    continue;

                $code = $stockItem['stk:stockHeader']['stk:code'];
                $count = $stockItem['stk:stockHeader']['stk:count'];

                $query = Doctrine_Query::create();
                $query->update('Admin_Model_Product object');
                $query->set('object.OnStock', '?', $count);
                $query->set('object.PohodaStock', '?', $pohodaStock);
                $query->where('object.Code = ?', $code);
                $query->execute();
            }
        }

        //Email::sendEmail('Update stock', 'Stock aktualizovan: ' . date('H:i:s'), '');
    }

    // /common/cron/orders-to-pohoda?hash=46s54f5s64fsa9f4sd56f4sa6f8s4e6fas
    public function ordersToPohodaAction() {
        parent::disableLayout();

        if ( $this->getRequest()->getParam('hash') == '46s54f5s64fsa9f4sd56f4sa6f8s4e6fas') {
            $orders = Order::getOrdersToPohoda();
            try {
                $export = new PohodaExport($orders);
                $export->exportXML();

                foreach ($orders as $order) {
                    $order->InPohoda = true;
                    $order->save();
                }

            } catch (\Exception $ex) {
                die ('Order error: ' . $ex->getMessage());
            }
        }

    }

    public function invoiceToPohodaAction() {
        parent::disableLayout();

        if ( $this->getRequest()->getParam('hash') == '46s54f5s64fsa9f4sd56f4sa6f8s4e6fas') {
            $orders = Order::getAllOrdersToPohoda();
            try {
                $export = new \admin\logic\Order\PohodaInvoiceExport($orders);
                $export->exportXML();

            } catch (\Exception $ex) {
                die ('Order error: ' . $ex->getMessage());
            }
        }

    }

    /**
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function checkProductWatchDogAction() {
        $watchDogs = ProductWatchDog::getAllWatchDogsForEmailNotificationByUsers();

        foreach($watchDogs as $userID => $productIDs) {
            $user = User::getUser($userID);
            $productsToBeReported = ProductStock::getProductsQuantityInfoByProductIDs($productIDs);
            if($productsToBeReported) {
                EmailFactory::sendWatchDogNotificationEmail($user, $productsToBeReported);
                ProductWatchDog::setWatchDogAsReported($userID, $productsToBeReported);
            }
        }
    }

    public function fetchNewBankTransactionAction() {
//        $imap = new Imap(
//            Configs::getTransactionMailImapHost(),
//            Configs::getTransactionMailImapLogin(),
//            Configs::getTransactionMailImapPassword());
//        $messages = $imap->emailsToParse();
//        foreach(array_reverse($messages) as $message){
//            if($message['header'] == "Oznámení o platbách"){
//                $message = Bank::kb($message['message']);
//                if(isset($message['vs']))
//                    $order = Admin_Model_Order::getOrderByOrderNumber($message['vs']);
//                if(isset($order)) {
//                    $message['amount'] = Bank::processAmountToDecimal($message['amount']);
//                    if(Admin_Model_BankTransaction::isTransactionDuplicated($message))
//                        return;
//                    if(!Admin_Model_Order::checkSum($order['ID'], $message['amount']))
//                        return;
//                    Admin_Model_OrderState::createOrderState($order['ID'], OrderStateType::ID_STATE_PAYMENT_ACCEPTED);
//                    $bankTransaction = new Admin_Model_BankTransaction();
//                    $bankTransaction->Date = $message['date'];
//                    $bankTransaction->ToAccount = $message['toAccount'];
//                    $bankTransaction->FromAccount = $message['fromAccount'];
//                    $bankTransaction->Amount = $message['amount'];
//                    $bankTransaction->KS = $message['ks'];
//                    $bankTransaction->VS = $message['vs'];
//                    $bankTransaction->Message = $message['message'];
//                    $bankTransaction->AccountName = $message['fromAccount'];
//                    $bankTransaction->save();
//                }
//
//            }
//        }
    }

    // /common/cron/get-availability?hash=5fe5e83b65be03a0597a59226e8628cd
    public function getAvailabilityAction() {
        if ( $this->getRequest()->getParam('hash') == '5fe5e83b65be03a0597a59226e8628cd') {
            $products = Product::getProductsForAvailability();
            echo Zend_Json::encode($products);
        } else {
            die('Unauthorizzed request');
        }
    }

    /**
     * @throws Zend_Json_Exception
     * Nový token platí vždy 60 dní, doporučuji cron volat jednou za měsíc
     */
    public function refreshInstagramApiTokenAction() {
        $randomSecret = 'df5as4fsa564f6sa54f6sa54fsa5444854ef*';
        if (md5($randomSecret) !== $_GET['auth']) {
            echo "Nemáte oprávnění volat tuto akci";
            exit;
        }
        $instagram = new Instagram();
        $instagram->refreshToken();
    }

    /**
     * @throws Zend_Json_Exception
     */
    public function fetchNewInstagramMediaAction() {
        $randomSecret = 'df5as4fsa564f6sa54f6sa54fsa5444854ef*';
        if (md5($randomSecret) !== $_GET['auth']) {
            echo "Nemáte oprávnění volat tuto akci";
            exit;
        }
        $instagram = new Instagram();
        $instagram->fetchMedia();
    }

    public function compareEkonomisVsEshopAction() {
        $ekonomisFeedUrl = 'https://hadex.cz/hadexstavy.xml';
        $missingCodesInEshop = [];
        $options = array(
            "uniqueNode" => "STAV"
        );
        $streamer =  Prewk\XmlStringStreamer::createUniqueNodeParser($ekonomisFeedUrl, $options);
        while ($node = $streamer->getNode()) {
            $simpleXmlNode = simplexml_load_string($node);
            $eshopProduct = Product::getProductByCodeForAPI((string)$simpleXmlNode->PRODUCTID);
            if (!$eshopProduct) {
                $missingCodesInEshop[] = (string)$simpleXmlNode->PRODUCTID;
            }
        }
        if (count($missingCodesInEshop) > 0) {
            EmailFactory::sendMissingProductCodesInEshopEmail($missingCodesInEshop);
            echo "Následující kódy nejsou v e-shopu: " . implode(', ', $missingCodesInEshop);
        } else {
            echo "Všechny kódy z Ekonomis feedu jsou v e-shopu.";
        }

    }

}
