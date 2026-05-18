<?php
use Admin_Model_Currency as Currency;
use common\logic\Configs;
use common\logic\Eshop\Eshop;
use common\logic\Front\Cart;
use common\logic\Latte\LatteEngine;
use default\components\Common;
use default\components\Layout;
use Latte\Engine;
use user\logic\UserClientSession;
use user\logic\UserSettings;

class BaseController extends Zend_Controller_Action {

    /**
     * @var Engine
     */
    protected Engine $latte;

    /**
     * @var bool|float|int|mixed|string
     */
    protected Currency $currentCurrency;

    /**
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @param array $invokeArgs
     */
    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array()) {
        parent::__construct($request, $response, $invokeArgs);

        //new Eshop();

        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->layout->disableLayout();
        $this->latte = LatteEngine::getInstance();
        $this->currentCurrency = Eshop::getInstance()->getCurrency();

        $requestUri = $request->getRequestUri();
        if ( substr($requestUri, -1) == '/' && strlen($requestUri) > 1 ) {
            $newUrl = substr($requestUri, 0, -1);

            header("Location: " . $newUrl, TRUE, 301);
            return;
        }
    }

    /**
     * @return array
     */
    public static function getBaseParams(): array {
        $baseParams = [];
        $baseParams['bp'] = _bu();
        $baseParams['currentPage'] = Zend_Json::encode(['controller' => '', 'action' => '']);
        $baseParams['uri'] =  $_SERVER['REQUEST_URI'];
        $baseParams['eshop'] = Eshop::getInstance();
        $baseParams['currency'] = Eshop::getInstance()->getCurrency();
        $baseParams['userID'] = UserClientSession::getCurrentUserID();
        $baseParams['userSettings'] = UserSettings::getInstance();
        $baseParams['isDevelopment'] = Clevis_Helper::isDevelopmentEnvironment();
        $baseParams['cartInstance'] = Cart::getInstance();

        $baseParams['cookiesConfirm'] = Common::cookiesConfirm();
        //$baseParams['announcement'] = Common::announcement(Eshop::getInstance()->getEshop());

        $baseParams['currentUrl'] = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $baseParams['headLink'] = '';
        $baseParams['headScript'] = '';

        $baseParams['headerContact'] = Layout::headerContact();
        $baseParams['headerControl'] = Layout::headerControl();
        $baseParams['headerMenu'] = Layout::headerMenu();
        $baseParams['mobileMenu'] = Layout::mobileMenu();

        $baseParams['footerContact'] = Layout::footerContact();
        $baseParams['footerMenu'] = Layout::footerMenu();
        $baseParams['footerMenu2'] = Layout::footerMenu2();
        $baseParams['footerCopyright'] = Layout::footerCopyright();
        $baseParams['headerMainMenu'] = Layout::headerMainMenu();
        $baseParams['frontendConfig'] = [
            'vue' => null,
        ];

        try{
            $baseParams['frontendConfig']["vue"] = Configs::loadVue();
        } catch (\Exception $e){
            $baseParams['frontendConfig']["vue"] = null;
        }

        $baseParams['benefits'] = Common::benefits();
        $baseParams['contactBox'] = Common::contactBox();
        $baseParams['title'] = 'Denik pleti';
        $baseParams['metaDescription'] = 'Denik pleti';

        return $baseParams;
    }


    /**
     * @param array $params
     * @param string|null $custom_path
     */
    protected function renderLatte(array $params = [], string $custom_path = null,): void {
        $baseParams = self::getBaseParams();

        $controller = $this->getRequest()->getControllerName();
        if ( $controller == 'index' )
            $baseParams['headLink'] = '<link href="/js/assets/responsiveslides/responsiveslides.css" rel="stylesheet" type="text/css">';

        if ( $controller == 'product' )
            $baseParams['headLink'] = '<link href="/js/assets/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css">';

        $baseParams['headScript'] = $this->view->headScript()->toString();
        $baseParams['currentPage'] = Zend_Json::encode(['controller' => $this->getRequest()->getControllerName(), 'action' => $this->getRequest()->getActionName(),]);

        $params = array_merge($baseParams, $params);

        try {
            if ($custom_path != null) {
                $this->latte->render(__DIR__ . '/../views/latte/' . $custom_path . '.latte', $params);
            } else {
                $this->latte->render(__DIR__ . '/../views/latte/' . $this->getRequest()->getControllerName() . '/' . $this->getRequest()->getActionName() . '.latte', $params);
            }
        } catch (Exception $e) {
            throw ($e);
        }
    }

    protected function sendJsonResponse(array $data) {
        header('Content-Type: application/json');
        echo json_encode($data);
        die();
    }
}