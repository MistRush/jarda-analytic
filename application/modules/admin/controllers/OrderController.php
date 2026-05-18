<?php
use admin\logic\Order\CustomSheet;
use admin\logic\Order\InvoicePdf;
use admin\logic\Order\PohodaExport;
use admin\logic\Order\PrintOrders;
use Admin_Model_Order as Order;
use Admin_Model_OrderState as OrderState;
use Admin_Model_OrderStateType as OrderStateType;
use Clegginabox\PDFMerger\PDFMerger;
use common\logic\Data\CSVExport;
use common\logic\Eshop\Eshop;
use common\logic\PPL\PackageListPdf;
use common\logic\PPL\PplApiHandler;
use common\logic\Zasilkovna\ZasilkovnaApiHandler;

class Admin_OrderController extends Admin_Controller_Action {

    public function orderAction() {
        $this->renderVue(
            ['orderStateTypes' => OrderStateType::getOrderStateTypes()]
        );
    }

    public function editOrderAction() {
        $this->renderVue([], false);
    }

    public function gopayAction() {
        $this->renderVue();
    }

    public function balikobotAction() {
        $this->renderVue();
    }

    public function csobAction() {
        $this->renderVue();
    }

    public function getOrderByIdAction() {
        $orderID = $this->getParam('Order_ID');
        $order = Order::getOrderByID($orderID);

        echo json_encode($order);
    }

    public function setOrderStateAction() {
        $orderStateID = $this->getParam('OrderStateType_ID');
        $orderIDs = json_decode($this->getParam('Order_IDs'));

        foreach ($orderIDs as $orderID) {
            OrderState::createOrderState($orderID, (int) $orderStateID);
        }
    }

    public function printOrdersAction() {
        $orders = Order::getOrdersByIDs($this->getParam('OrderIDs'));

        PrintOrders::performPrint($orders);
    }

    public function regenerateCustomSheetAction() {
        CustomSheet::generatePDF($this->getRequest()->getParam('Order_ID'));
    }

    public function showInvoiceAction() {
        $Order_ID = $this->getParam('Order_ID');
        $pdf = new InvoicePdf($Order_ID);
        $pdf->Output();
    }

    public function exportPohodaAction() {
        if (!$order = Order::getOrderByIDFull($this->getRequest()->getParam('id')))
            die ('Order not found');

        $export = new PohodaExport($order);
        $export->exportXML();

        try {

        } catch (\Exception $ex) {
            die ('Export Failed');
        }
    }

    public function exportCsvAction() {
        $eshop = Eshop::getInstance()->getEshop();
        $eshopID = $eshop->ID;
        $eshopName = $eshop->Name;
        $headerData = ['E-shop', 'Číslo objednávky', 'Daň', 'Datum', 'Čas','Pohoda', 'Zákazník', 'Společnost', 'IČ', 'DIČ', 'Celková cena bez DPH', 'Celková cena s DPH'];
        $dataForExport = Admin_Model_Order::getDataForExport($eshopID);
        $csv = new CSVExport('export-objednávky-'.$eshopName, $dataForExport, $headerData);
        $csv->performExport();
    }

    /**
     * @throws \Salamek\PplMyApi\Exception\OfflineException
     * @throws \Salamek\PplMyApi\Exception\WrongDataException
     * @throws \Salamek\PplMyApi\Exception\SecurityException
     * @throws Doctrine_Query_Exception
     */
    public function newPplShipmentAction() {
        $orderIDs = $this->getRequest()->getParam('OrderIDs');
        $orderIDs = explode(',', $orderIDs);
        $parcelNos = [];
        foreach ($orderIDs as $orderID) {
            $order = Admin_Model_Order::getOrder($orderID);
            if(!Admin_Model_Shipping::isPPLShipping($order->Shipping_ID)) {
                continue;
            }
            $parcelNo = PplApiHandler::sendOrderToPPL($order);
            if(strlen($parcelNo) > 0) {
                $parcelNos[] = $parcelNo;
                Admin_Model_Order::updatePPLParcelInfo($orderID, $parcelNo);
            }

        }
        if($parcelNos[0]) {
            $pdf = new PDFMerger;

            foreach($parcelNos as $parcelNo) {
                $pdf->addPDF(APPLICATION_PATH.'/../data/ppl/labels/'.$parcelNo . '.pdf');
            }
            $pdf->merge('browser', APPLICATION_PATH.'/../data/ppl/labels/'.implode('-',$parcelNos) . '.pdf', 'L');
        } else {
            echo 'Zásilku pro PPL nebylo možné podat. Zkontrolujte, zdali zásilka už nebyla u PPL podána (v tom případě stačí zobrazit štítky), či dopravce u objednávky je PPL';
        }
    }

    public function getPplLabelsAction() {
        $orderIDs = $this->getRequest()->getParam('OrderIDs');
        $orderIDs = explode(',', $orderIDs);
        $parcelNos = [];
        foreach ($orderIDs as $orderID) {
            $order = Admin_Model_Order::getOrderByID($orderID);
            if(!Admin_Model_Shipping::isPPLShipping($order['Shipping_ID'])) {
                continue;
            }
            $parcelNos[] =  $order['ParcelNumber'];
        }
        if($parcelNos[0]) {
            $pdf = new PDFMerger;

            foreach($parcelNos as $parcelNo) {
                $pdf->addPDF(APPLICATION_PATH.'/../data/ppl/labels/'.$parcelNo . '.pdf');
            }
            $pdf->merge('browser', APPLICATION_PATH.'/../data/ppl/labels/'.implode('-',$parcelNos) . '.pdf', 'L');
        }
        else {
            echo "Štítek nelze zobrazit. Zkontrolujte, zdali byla pro objednávku vytvořena zásilka v PPL.";
        }
    }

    /**
     * @throws \Mpdf\MpdfException
     * @throws \PHPMailer\PHPMailer\Exception
     * @throws Doctrine_Query_Exception
     */
    public function getPplPackageListAction() {
        $orderIDs = $this->getRequest()->getParam('OrderIDs');
        $orderIDs = explode(',', $orderIDs);
        $pplOrderIDs = [];
        foreach ($orderIDs as $orderID) {
            $order = Admin_Model_Order::getOrderByID($orderID);
            if(!Admin_Model_Shipping::isPPLShipping($order['Shipping_ID'])) {
                continue;
            }
            $pplOrderIDs[] =  $order['ID'];
        }
        if($pplOrderIDs[0]) {
            new PackageListPdf($pplOrderIDs);
        }
        else {
            echo "Seznam nelze zobrazit. Zkontrolujte, zdali byla pro objednávku vytvořena zásilka v PPL.";
        }
    }

    public function sendOrderToZasilkovnaAction() {
        $orderIDs = $this->getRequest()->getParam('OrderIDs');

        foreach ($orderIDs as $orderID) {
            $order = Admin_Model_Order::getOrder($orderID);
            $order->ParcelNumber = ZasilkovnaApiHandler::sendOrderToZasilkovna($order);
            $order->TrackingUrl = 'https://tracking.packeta.com/cs_CZ/?id=' .  $order->ParcelNumber;
            $order->save();
        }
    }

    public function getLabelsAction() {
        $zasilkovna = new ZasilkovnaApiHandler();
        $orderIDs = $this->getRequest()->getParam('OrderIDs');
        $orderIDs = explode(',', $orderIDs);
        $parcelNos = [];
        foreach ($orderIDs as $orderID) {
            $order = Admin_Model_Order::getOrderByID($orderID);
            if(!$order[0]['Zasilkovna_ID'] && $order[0]['shipping']['ID']!= Admin_Model_Zasilkovna::ZASILKOVNA_HOUSE_DELIVERY_ID) {
                continue;
            }
            $parcelNos[] =  $order[0]['ParcelNumber'];
        }

        if(sizeof($parcelNos) > 0 && $parcelNos[0]) {
            try {
                $data = base64_decode($zasilkovna->getLabels($parcelNos));
            }
            catch(Exception $e) {
                echo "Štítek nelze zobrazit. Zkontrolujte, zda-li je jako dopravce nastavena Zásilkovna";
                return;
            }
            header('Content-Type: application/pdf');
            echo $data;
        }
        else {
            echo "Štítek nelze zobrazit. Zkontrolujte, zda-li je jako doprace nastavena Zásilkovna";
        }
    }
}