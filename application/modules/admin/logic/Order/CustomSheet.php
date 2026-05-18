<?php
namespace admin\logic\Order;

use Admin_Model_Address as ModelAddress;
use Admin_Model_Order as ModelOrder;
use Clevis_Tcpdf_TCPDF as TCPDF;
use Common_Model_Eshop as ModelEshop;
use common\logic\Latte\LatteEngine;

/**
 * Module constants
 */
class CustomSheet {

    /**
     * @param int $orderID
     */
    public static function generatePDF(int $orderID): void {
        $order = ModelOrder::getOrderByID($orderID);
        $address = ModelAddress::getAddressByID($order['InvoiceAddress_ID']);
        $eshop = ModelEshop::getEshopByID($order['Eshop_ID']);

        // zacatek tisku
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->SetFont('freesans', '', 9);
        $pdf->setPrintHeader(false);
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $pdf->SetMargins(PDF_MARGIN_LEFT, 15, PDF_MARGIN_RIGHT);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
        $pdf->SetFont('freesans', '', 8);

        // add a page
        $pdf->AddPage();

        $latte = LatteEngine::getInstance($eshop->language->Code);
        $content = $latte->renderToString(__DIR__ . '/templates/custom-sheet.latte',
            [
                'order' => $order,
                'address' => $address,
                'eshop' => $eshop,
                'settings' => $eshop->settings,
                'lang' => $eshop->language->Code,
                'currencyLabel' => $eshop->currency->Label,
            ]);
        $pdf->writeHTML($content, true, false, false, false, '');

        $documentRoot = $_SERVER['DOCUMENT_ROOT'];
        if (!file_exists($documentRoot.'/files/orders/' . $order['Folder']))
            mkdir($documentRoot.'/files/orders/' . $order['Folder'], 0777, true);

        // -----------------------------------------------------------------------------
        // Close and output PDF document
        $pdf->Output($documentRoot.'/files/orders/'.$order['Folder'].'/'.$order['ID'].'.pdf', 'F');
    }
}