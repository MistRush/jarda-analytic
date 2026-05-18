<?php
namespace common\logic\CertificateGenerator;

use common\logic\Eshop\Eshop;
use setasign\Fpdi\Fpdi;

class CertificateGenerator {

    public function generate(array $info) {
        $this->pdf = new FPDI('P', 'mm', array(2000,1500));
        $this->pdf->setSourceFile(__DIR__.'/certifikat.pdf');

        $tplidx = $this->pdf->importPage(1, '/MediaBox');
        $this->pdf->addPage();
        $this->pdf->useTemplate($tplidx, 0, 0, 1500);
        $this->pdf->AddFont('ar', '', 'cp1250_arial.php');

        $this->pdf->SetFont('ar', '', 110);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetY(420);
        $this->pdf->Cell(1);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['company']), align: 'C');

        $this->pdf->SetFont('ar', '', 110);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetY(470);
        $this->pdf->Cell(1);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['address']), align: 'C');

        $this->pdf->SetFont('ar', '', 110);
        $this->pdf->SetY(520);
        $this->pdf->Cell(1);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['postcode']." ".$info['city']), align: 'C');

        $this->pdf->SetY(570);
        $this->pdf->Cell(1);
        $this->pdf->SetFont('ar', '', 110);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", "IČO: ".$info['id']), align: 'C');

        $this->pdf->SetY(1270);
        $this->pdf->SetX(280);
        $this->pdf->Cell(1);
        $this->pdf->SetFont('ar', '', 110);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['date']));

        return $this->pdf->Output('S', '');
    }
}