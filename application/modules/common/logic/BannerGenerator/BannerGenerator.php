<?php
namespace common\logic\BannerGenerator;

use common\logic\Eshop\Eshop;
use setasign\Fpdi\Fpdi;

class BannerGenerator {

    public function generate(array $info, Eshop $eshop) {
        $this->pdf = new FPDI('L', 'mm', array(1500,1000));
        if($eshop->getLangID()== 2) {
            $this->pdf->setSourceFile(__DIR__.'/cedule_sk.pdf');
        } else {
            $this->pdf->setSourceFile(__DIR__.'/cedule.pdf');
        }
        $tplidx = $this->pdf->importPage(1, '/MediaBox');
        $this->pdf->addPage();
        $this->pdf->useTemplate($tplidx, 0, 0, 1500);
        $this->pdf->AddFont('ar', '', 'cp1250_arial.php');

        $this->pdf->SetFont('ar', '', 230);
        $this->pdf->SetTextColor(243, 110, 14);
        $this->pdf->SetY(553);
        $this->pdf->Cell(133);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['company']));

        $this->pdf->SetFont('ar', '', 145);
        $this->pdf->SetTextColor(4, 46, 125);
        $this->pdf->SetY(628);
        $this->pdf->Cell(133);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['address']));

        $this->pdf->SetFont('ar', '', 145);
        $this->pdf->SetY(690);
        $this->pdf->Cell(133);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", $info['postcode']." ".$info['city']));

        $this->pdf->SetY(634);
        $this->pdf->Cell(855);
        $this->pdf->SetFont('ar', '', 105);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", "Web: ".$info['website']));

        $this->pdf->SetY(685);
        $this->pdf->Cell(855);
        $this->pdf->Cell(0, 0, iconv("UTF-8", "CP1250", "Tel.: ".$info['phone']));
        return $this->pdf->Output('S', '');
    }
}