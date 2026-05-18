<?php

namespace admin\logic\Order;

use common\logic\Eshop\Eshop;
use common\logic\Latte\LatteEngine;
use Common_Model_Eshop as EshopModel;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;

class CreatePdf extends Mpdf {
    const FILE_NAME = 'document';

    const COMPANY_NAME = "Hlavně v klidu, s.r.o.";

    public $latte;

    public function __construct(array $config = [], ?EshopModel $eshop = null) {
        $config = array_merge($this->getDefaultConfig(), $config);

        if (!$eshop)
            $eshop = Eshop::getInstance()->getEshop();

        $this->latte = LatteEngine::getInstance();
//        $this->latte->language = $eshop->language;

        parent::__construct($config);
    }

    private function getDefaultConfig() {
        $cfg = [];
        $cfg['tempDir'] = '/tmp';
        $cfg['mode'] = 'utf-8';
        $cfg['default_font'] = 'Helvetica';
        $cfg['default_font_size'] = 11;

        $cfg['setAutoBottomMargin'] = 'stretch';
        $cfg['setAutoTopMargin'] = 'stretch';
        $cfg['autoMarginPadding'] = 2;

        return $cfg;
    }

    public function getFileName() {
        return self::FILE_NAME . '.pdf';
    }

    public function renderTemplate(string $template, array $params) {
        return $this->latte->renderToString(__DIR__ . '/templates' . $template . '.latte', $params);
    }


    public function setupHeader(string $headerText) {
        $header = $this->latte->renderToString(__DIR__ . '/templates/invoice/header.latte', ['headerText'=> $headerText, 'companyName' => self::COMPANY_NAME]);
        $this->SetHTMLHeader($header);
        $this->SetTitle($headerText);
    }

    public function Output($name = '', $dest = '') {
        $dest = strtoupper($dest);
        if (empty($name)) {
            $name = 'hadex.pdf';
        }

        if (empty($dest)) {
            $dest = Destination::INLINE;
        }

        return parent::Output($name, $dest);
    }
}