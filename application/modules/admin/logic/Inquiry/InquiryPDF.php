<?php
namespace admin\logic\Inquiry;

use Admin_Model_Address as ModelAddress;
use Admin_Model_Question as ModelQuestion;
use Clevis_Tcpdf_TCPDF as TCPDF;
use common\logic\Eshop\Eshop;

/**
 * Module constants
 */
class InquiryPDF {

    public static function generatePDF(int $inquiryID) {
        $inquiry = ModelQuestion::getInquiry($inquiryID)[0];
        $eshop = Eshop::getInstance();

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

        // -----------------------------------------------------------------------------
        // Tittle
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-size: 32px; border-bottom: 0.1px solid #999;"><br />';
        $content .= '<b>Provozovatel</b><br />';
        $content .= $eshop->getSettings('ProjectName') . '<br />';
        $content .= $eshop->getSettings('AddressStreet') . '<br />';
        $content .= $eshop->getSettings('AddressZipCode') . '  ' . $eshop->getSettings('AddressCity') . '<br />';
        $content .= 'IČ: ' . $eshop->getSettings('RegistrationNumber') . '</div>';
        $pdf->writeHTML($content, true, false, false, false, '');

        $headline = $inquiry['Type'] == 'Poptávka';

        $content = '<br /><div style="font-size: 60px; text-align: center; font-weight: bold;"><u>' . $headline . '</u></div>';
        $pdf->writeHTML($content, true, false, false, false, '');

        // -----------------------------------------------------------------------------
        // Informace o zakázce
        // -----------------------------------------------------------------------------
        // -----------------------------------------------------------------------------
        $content = '<div style="font-weight: bold; font-size: 40px;"><br />Informace o poptávce</div>';
        $content .= '<table border="0" cellpadding="4" cellspacing="4" style="border: 1px solid #888; width: 635px; font-size: 28px;">';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Datum:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . formatDate($inquiry['Date']) . '</td>';
        $content .= '</tr>';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Jméno a příjmení:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $inquiry['Name'] . '</td>';
        $content .= '</tr>';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Telefon:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $inquiry['Phone'] . '</td>';
        $content .= '</tr>';
        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Email:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . $inquiry['Email'] . '</td>';
        $content .= '</tr>';

        $content .= '<tr>';
        $content .= '<td width="25%" style="font-style: italic; border-bottom: 0.1em solid #ddd; text-align: right;"><b>Poptávka:</b></td>';
        $content .= '<td width="75%" style="border-bottom: 0.1em solid #ddd;" colspan="3">' . nl2br($inquiry['Description']) . '</td>';
        $content .= '</tr>';
        $content .= '</table>';
        $pdf->writeHTML($content, true, false, false, false, '');

        if (!file_exists('files/inquiry/' . $inquiry['Folder']))
            mkdir('files/inquiry/' . $inquiry['Folder'], 0777, true);

        // -----------------------------------------------------------------------------
        // Close and output PDF document
        $pdf->Output('files/inquiry/' . $inquiry['Folder'] . '/' . $inquiry['InquiryNumber'] . '.pdf', 'F');

        return true;
    }
}