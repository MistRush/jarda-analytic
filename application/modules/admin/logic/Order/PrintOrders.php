<?php
namespace admin\logic\Order;

/**
 * Module constants
 */
class PrintOrders {

    /**
     * @param array $orders
     */
    public static function performPrint(array $orders): void{
        $pdf = new \Clevis_Tcpdf_TCPDF('L','mm','ANNENV_A4');
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $pdf->SetMargins(10, 10, 10, 10);
        $pdf->AddPage();
        $pdf->SetFont('freesans', '', 8);

        $content = '<div style="font-size: 24px; font-weight: bold; border-bottom: 0.1em solid;">Seznam objednávek</div><br />';
        $pdf->writeHTML($content, true, false, false, false, '');

        $pdf->SetFont('freesans', '', 10);
        $content = '';
        $content .= '<table border="1" cellpadding="3" cellspacing="0" style="border-collapse: collapsed; font-size: 8px">';
        $content .= '<thead>';
        $content .= '<tr>';
        $content .= '<td style="width: 75px; font-weight: bold">Č. objednávky</td>';
        $content .= '<td style="width: 64px; font-weight: bold">Datum</td>';
        $content .= '<td style="width: 70px; font-weight: bold">Cena dopravy</td>';
        $content .= '<td style="width: 70px; font-weight: bold">Cena platby</td>';
        $content .= '<td style="width: 75px; font-weight: bold">Celková cena s DPH</td>';
        $content .= '<td style="width: 80px; font-weight: bold">Zákazník</td>';
        $content .= '<td style="width: 70px; font-weight: bold">Telefon</td>';
        $content .= '<td style="width: 150px; font-weight: bold">Email</td>';
        //$content .= '<td style="width: 80px; font-weight: bold">Stav</td>';
        $content .= '</tr>';
        $content .= '</thead>';

        foreach($orders as $order) {
            $content .= '<tr>';
            $content .= '<td style="width: 75px;">' . $order['OrderNumber'] . '</td>';
            $content .= '<td style="width: 64px;">' . formatDate($order['Date']) . '</td>';
            $content .= '<td style="width: 70px;">' . price($order['PriceShippingWithVat']) . '</td>';
            $content .= '<td style="width: 70px;">' . price($order['PricePaymentWithVat']) . '</td>';
            $content .= '<td style="width: 75px;">' . price($order['PriceTotalWithVat']) . '</td>';
            $content .= '<td style="width: 80px;">' . $order['invoiceAddress']['LastName'] . ' ' . $order['invoiceAddress']['FirstName'] . '</td>';
            $content .= '<td style="width: 70px;">' . $order['invoiceAddress']['Phone'] . '</td>';
            $content .= '<td style="width: 150px;">' . $order['invoiceAddress']['Email'] . '</td>';
            //$content .= '<td style="width: 80px;">' . $order['orderStateType']['Name'] . '</td>';
            $content .= '</tr>';
        }

        $content .= '</table>';
        $pdf->writeHTML($content, true, false, false, false, '');
        $pdf->Output('confidant-export-' . time() .'.pdf', 'I');
    }
}