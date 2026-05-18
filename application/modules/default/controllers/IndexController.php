<?php
use Admin_Model_Banner as Banner;
use Admin_Model_News as News;
use Admin_Model_Page as Page;
use Admin_Model_Product as Product;
use common\logic\Email\Email;
use default\components\Common;

class IndexController extends BaseController {

    public function indexAction() {
        $page = Page::getPageByID(Page::ID_HOMEPAGE);
        $registrationConfirmed = $this->getRequest()->getParam('RegistrationConfirmed');

        $params = [
            'mainContainer' => false,
            'registrationConfirmed' => $registrationConfirmed,
            'newsletter' => Common::newsletter(),
            'registerAction' => Common::registerAction(),
            'reviews' => Common::reviews(),
            'page' => $page,
            'title' => $page['Title'] ?? "Your Trusted Partner in Aircraft Management",
            'metaDescription' => $page['MetaDescription'] ?? "Your Trusted Partner in Aircraft Management",
            'metaKeywords' => $page['MetaKeywords'] ?? "Your Trusted Partner in Aircraft Management",
        ];

        $this->renderLatte($params);
    }

    public function testErrorAction() {
        $this->renderLatte();

        throw new Exception('x');
    }

    public function testEmailAction() {
        Email::sendEmail('trym test', 'trym test', 'melecky@evidsoft.cz');
    }
}