<?php
use common\logic\Eshop\Eshop;

class SitemapController extends BaseController {

    const SITEMAPS_DIR = 'files/sitemaps/';

    public function indexAction() {
        $this->renderLatte([
            "sitemapDir" => self::SITEMAPS_DIR,
            "date" => (date("Y-m-d", strtotime("this week")).'T17:00:00+01:00'),
            "eshop" => Eshop::getInstance()->getEshop(),
        ]);
        header("Content-type: text/xml");
    }

    public function robotsAction() {
//        if ( Eshop::getInstance()->getSettings('ProductionMode') ) {
            $robots = "User-agent: *\n";
            $robots .= "Allow: /\n";
            $robots .= "Disallow: /admin/\n";
            $robots .= "Disallow: /customer/\n";
            $robots .= "Disallow: /*?f=*\n";
            $robots .= "Disallow: /search/?searchTerm*\n";
            header("Content-Type: text/plain");
            $robots .= "Sitemap: " . Eshop::getInstance()->getURL() . "/sitemap.xml";
//        } else {
//            $robots = "User-agent: *\n";
//            $robots .= "Disallow: /\n";
//            header("Content-Type: text/plain");
//        }

        echo $robots;
    }

    public function getAction() {
        if (!($type = $this->getParam('type')))
            $this->_helper->redirect('index');

        $file = self::SITEMAPS_DIR . Eshop::getInstance()->getEshopID() . '/' . $type;

        if (!file_exists($file)) {
            http_response_code(404);
            die('Sitemap not found');
        }

        echo file_get_contents(self::SITEMAPS_DIR . Eshop::getInstance()->getEshopID() . '/' . $type);
        header("Content-type: text/xml");
        exit;
    }
}
