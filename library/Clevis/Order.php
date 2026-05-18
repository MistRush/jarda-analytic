<?php

/**
 * Module constants
 */
class Clevis_Order {

    const SESSION = 'order';

    /**
     * Constructor
     */
    public function __construct() {

    }

    /**
     * Set current order
     *
     */
    public static function setCurrentOrder($params) {
        $order = new Zend_Session_Namespace(self::SESSION);
        $order->Description = $params['Description'];
    }

    /**
     * Get current order
     *
     * @return Zend_Session_Namespace
     */
    public static function getCurrentOrder() {
        $order = new Zend_Session_Namespace(self::SESSION);

        $orderArray['Description'] = $order->Description;

        return $orderArray;
    }

    /**
     * Reset current order
     */
    public static function resetCurrentOrder() {
        $order = new Zend_Session_Namespace(self::SESSION);
        $order->unsetAll();
    }

    public static function generatePDF($id) {

        // nacti info o objednavcer
        $query = Doctrine_Query::create();
        $query->from("Admin_Model_Order object");
        $query->leftJoin("object.orderItems orderItems");
        $query->leftJoin("orderItems.product product");
        $query->leftJoin("orderItems.productVariant productVariant");
        $query->leftJoin("object.shipping shipping");
        $query->leftJoin("object.payment payment");
        $query->where("object.ID = ?", $id);
        $order = $query->execute()->toArray();

        // nacti info o fakturační adrese
        $query = Doctrine_Query::create();
        $query->from("Admin_Model_Address object");
        $query->where("object.ID = ?", $order[0]['InvoiceAddress_ID']);
        $address = $query->execute()->toArray();

        // nacti info o doručovací adrese
        if ($order[0]['DeliveryAddress_ID']) {
            $query = Doctrine_Query::create();
            $query->from("Admin_Model_Address object");
            $query->where("object.ID = ?", $order[0]['DeliveryAddress_ID']);
            $deliveryAddress = $query->execute()->toArray();
        }

        // zacatek tisku
        $pdf = new Clevis_Tcpdf_TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
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

        // -----------------------------------------------------------------------------
        // Tittle
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-size: 32px; border-bottom: 0.1px solid #999;"><br />';
        $content .= '<b>Provozovatel</b><br />';
        $content .= 'Evidsoft s.r.o.<br />';
        $content .= 'Na Hrobkách 54<br />';
        $content .= '747 41  Hradec nad Moravicí<br />';
        $content .= 'IČ: 29454816</div>';
        $pdf->writeHTML($content, true, false, false, false, '');

        $content = '<br /><div style="font-size: 60px; text-align: center; font-weight: bold;"><u>Objednávka</u></div>';
        $pdf->writeHTML($content, true, false, false, false, '');

        // -----------------------------------------------------------------------------
        // Informace o zakázce
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-weight: bold; font-size: 40px;"><br />Informace o objednávce</div>';
        $content .= '<table border="0" cellpadding="4" cellspacing="4" style="border: 1px solid #888; width: 635px; font-size: 28px;">';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Datum:</b></td>';
        $content .= '<td width="20%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . formatDate($order[0]['Date']) . '</td>';
        $content .= '<td width="20%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Č. objednávky:</b></td>';
        $content .= '<td width="35%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $order[0]['OrderNumber'] . '</td>';
        $content .= '</tr>';
        $content .= '</table>';
        $pdf->writeHTML($content, true, false, false, false, '');

        // -----------------------------------------------------------------------------
        // Fakturacni adresa
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-weight: bold; font-size: 40px;"><br />Fakturační adresa</div>';
        $content .= '<table border="0" cellpadding="4" cellspacing="4" style="border: 1px solid #888; width: 635px; font-size: 28px;">';
        if ($address[0]['CustomerType'] == 'person') {
            $content .= '<tr>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Jméno a příjmení:</b></td>';
            $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $address[0]['FirstName'] . ' ' . $address[0]['LastName'] . '</td>';
            $content .= '</tr>';
        } else {
            $content .= '<tr>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Společnost:</b></td>';
            $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $address[0]['CompanyName'] . '</td>';
            $content .= '</tr>';
        }
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Adresa:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $address[0]['Street'] . ' ' . $address[0]['DescriptionNumber'] . ', ' . $address[0]['City'] . ' ' . $address[0]['ZipCode'] . '</td>';
        $content .= '</tr>';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Email:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $address[0]['Email'] . '</td>';
        $content .= '</tr>';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Telefon:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $address[0]['Phone'] . '</td>';
        $content .= '</tr>';
        if ($address[0]['CustomerType'] == 'company') {
            $content .= '<tr>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>IČ:</b></td>';
            $content .= '<td width="20%" style="border-bottom: 0.1em solid #ddd;">' . $address[0]['IC'] . '</td>';
            $content .= '<td width="20%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>DIČ:</b></td>';
            $content .= '<td width="35%" style="border-bottom: 0.1em solid #ddd;">' . $address[0]['DIC'] . '</td>';
            $content .= '</tr>';
        }
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Poznámka:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $order[0]['Description'] . '</td>';
        $content .= '</tr>';
        $content .= '</table>';
        $pdf->writeHTML($content, true, false, false, false, '');

        // -----------------------------------------------------------------------------
        // Dorucovaci adresa
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        if ($order[0]['DeliveryAddress_ID']) {
            $content = '<div style="font-weight: bold; font-size: 40px;"><br />Doručovací adresa</div>';
            $content .= '<table border="0" cellpadding="4" cellspacing="4" style="border: 1px solid #888; width: 635px; font-size: 28px;">';
            if ($deliveryAddress[0]['CustomerType'] == 'person') {
                $content .= '<tr>';
                $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Jméno a příjmení:</b></td>';
                $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $deliveryAddress[0]['FirstName'] . ' ' . $deliveryAddress[0]['LastName'] . '</td>';
                $content .= '</tr>';
            } else {
                $content .= '<tr>';
                $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Společnost:</b></td>';
                $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $deliveryAddress[0]['CompanyName'] . '</td>';
                $content .= '</tr>';
            }
            $content .= '<tr>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Adresa:</b></td>';
            $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $deliveryAddress[0]['Street'] . ' ' . $deliveryAddress[0]['DescriptionNumber'] . ', ' . $deliveryAddress[0]['City'] . ' ' . $deliveryAddress[0]['ZipCode'] . '</td>';
            $content .= '</tr>';
            $content .= '</table>';

            $pdf->writeHTML($content, true, false, false, false, '');
        }

        // -----------------------------------------------------------------------------
        // Informace o zboží
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-weight: bold; font-size: 40px;"><br />Seznam zboží</div>';
        $content .= '<table border="0" cellpadding="4" cellspacing="4" style="border: 1px solid #888; width: 635px; font-size: 28px;">';
        $content .= '<tr>';
        $content .= '<td width="40%" style="font-style: italic; border-bottom: 0.1em solid #aaa; text-align: left;">Název zboží</td>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #aaa; text-align: right;">Cena za kus</td>';
        $content .= '<td width="10%" style="font-style: italic; border-bottom: 0.1em solid #aaa; text-align: center;">Počet</td>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #aaa; text-align: right;">Cena celkem</td>';
        $content .= '</tr>';

        foreach ($order[0]['orderItems'] as $orderItem) {
            $variant = '';
            if ($orderItem['ProductVariant_ID'])
                $variant = ' - ' . $orderItem['productVariant']['Name'];

            $content .= "<tr>";
            $content .= '<td width="40%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: left;">' . $orderItem['product']['Name'] . $variant . "</td>";
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;">' . number_format($orderItem['PriceDPH'] / 100, 2, ',', ' ') . ' Kč</td>';
            $content .= '<td width="10%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: center;">' . $orderItem['Quantity'] . "</td>";
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;">' . number_format($orderItem['PriceDPH'] / 100 * $orderItem['Quantity'], 2, ',', ' ') . ' Kč</td>';
            $content .= "</tr>";
        }
        
        if (array_key_exists('shipping', $order[0]) ) {
            $content .= "<tr>";
            $content .= '<td width="75%" colspan="3" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: left;">Doprava (' . $order[0]['shipping']['Name'] . ')</td>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: right;">' . number_format($order[0]['PriceShipping'] / 100, 2, ',', ' ') . ' Kč</td>';
            $content .= "</tr>";
        }
        
        if (array_key_exists('payment', $order[0]) ) {        
            $content .= "<tr>";
            $content .= '<td width="75%" colspan="3" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: left;">Platba (' . $order[0]['payment']['Name'] . ')</td>';
            $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: right;">' . number_format($order[0]['PricePayment'] / 100, 2, ',', ' ') . ' Kč</td>';
            $content .= "</tr>";
        }
        
        $content .= "<tr>";
        $content .= '<td width="75%" colspan="3" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: left;">Celkem</td>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #aaa; border-top: 0.1em solid #aaa; text-align: right;">' . number_format($order[0]['PriceTotalDPH'] / 100, 2, ',', ' ') . ' Kč</td>';
        $content .= "</tr>";
        $content .= '</table>';
        $pdf->writeHTML($content, true, false, false, false, '');


        if (!file_exists('orders/' . $order[0]['Folder'])) {
            mkdir('orders/' . $order[0]['Folder'], 0777, true);
        }

        // -----------------------------------------------------------------------------
        // Close and output PDF document
        $pdf->Output('orders/' . $order[0]['Folder'] . '/' . $order[0]['OrderNumber'] . '.pdf', 'F');

        return true;
    }

}

?>