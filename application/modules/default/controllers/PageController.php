<?php
use Admin_Model_Manufacturer as Manufacturer;
use Admin_Model_Page as Page;
use Admin_Model_Question as Question;
use common\logic\Email\EmailFactory;
use common\logic\Eshop\Eshop;
use common\logic\Front\Captcha;
use default\components\Common as CommonComponent;
use default\components\Layout as LayoutComponent;

class PageController extends BaseController {

    public function indexAction() {
        $slug = $this->getRequest()->getParam('slug');

        if ( !$slug ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        if ( !$page = Page::getPageBySlug($slug) ) {
            $this->forward('not-found', 'error', 'default');
            return;
        }

        if ( isset($_POST['Description']) ) {
            $question = Question::createQuestion($this->getRequest());
            EmailFactory::sendQuestion($question);
        }

        $this->renderLatte([
            'breadcrumb' => LayoutComponent::breadcrumb([['link' => \URL::PAGE . '/' . $page['slug'], 'title' => $page['Name']]]),
            'page' => $page,
            'eshop' => Eshop::getInstance(),
            'contactBox' => CommonComponent::contactBox('line'),
            'title' => $page['Title'],
            'metaDescription' => $page['MetaDescription'],
            'metaKeywords' => $page['MetaKeywords'],
            'manufacturers' => Manufacturer::getManufacturersForHomepage(),
        ]);
    }

    public function mainContactUsAction(){
        $token = $this->getRequest()->getParam('Token');

        $captcha = new Captcha($token);

        if ( $captcha->isSuccess() ) {
            $request = $this->getRequest();
            EmailFactory::sendMainContactUsForm($request);
        }
    }

    public function contactUsAction(){
        $token = $this->getRequest()->getParam('Token');

        $captcha = new Captcha($token);

        if ( $captcha->isSuccess() ) {
            $request = $this->getRequest();
            EmailFactory::sendMainContactUsForm($request);
        }
    }

    public function oldPagesSeoRedirectAction() {
        $slug = $this->getRequest()->getParam('slug');
        $page = Page::getPageBySlug($slug);
        if (isset($page['slug']) && $page['slug']) {
            header("Location: /page/" . $page['slug'], TRUE, 301);
        } else {
            $this->forward('not-found', 'error', 'default');
        }
    }

}