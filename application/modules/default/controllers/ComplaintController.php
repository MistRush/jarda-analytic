<?php

use common\logic\Email\EmailFactory;
use common\logic\Eshop\Eshop;
use default\components\Layout as LayoutComponent;
use common\logic\Front\Captcha;

class ComplaintController extends BaseController {

    public function indexAction() {
        $countries = Common_Model_Country::getCountries();

        $this->renderLatte([
            'breadcrumb' => LayoutComponent::breadcrumb([
                ['link' => URL::COMPLAINT, 'title' => 'Reklamace'],
            ]),
            'title' => translate('Reklamace'),
            'eshop' => Eshop::getInstance(),
            'countries' => $countries,
            'metaDescription' => translate('Reklamace'),
            'metaKeywords' => translate('Reklamace'),
            'contentClass' => 'light-grey',
        ]);
    }

    /**
     * @throws Exception
     */
    public function complaintSendAction() {
        $request = $this->getRequest();
        $token = $request->getParam('Token');
        $captcha = new Captcha($token);

        if (!$captcha->isSuccess())
            return;

        $complaintHandler = new Default_Logic_HandleComplaint();
        $complaint = $complaintHandler->processComplaint($request);

        $this->renderLatte([
            'title' => translate('Reklamace odeslána'),
            'metaDescription' => translate('Reklamace byla úspěšně odeslána'),
            'metaKeywords' => translate('Reklamace, potvrzení'),
            'contentClass' => 'light-grey',
            'complaint' => $complaint,
        ]);
    }
}