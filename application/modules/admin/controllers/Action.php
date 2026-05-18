<?php
use admin\logic\Navigation;
use common\logic\Eshop\Eshop;
use common\logic\Languages;
use Jolanda\Controller\BaseController;
use user\logic\UserAdminSession;
use User_Model_User as User;

/**
 * Class Admin_Controller_Action
 */
class Admin_Controller_Action  extends BaseController {

    const MODULE = 'admin';

    /**
     * @var Eshop
     */
    protected $eshop;

    /**
     * @var Languages
     */
    protected $language;

    /**
     * @var
     */
    protected $translation;

    /**
     * @var User_Model_User
     */
    protected $user;

    /**
     * Admin_Controller_Action constructor.
     * @param Zend_Controller_Request_Abstract $request
     * @param Zend_Controller_Response_Abstract $response
     * @param array $invokeArgs
     */
    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array()) {
        parent::__construct($request, $response, $invokeArgs, self::MODULE);

        if (UserAdminSession::getCurrentUserID() && !in_array(UserAdminSession::getCurrentUserType(), User::getAdminTypes())) {
            $this->forward('no-access', 'error', 'default');
            return;
        }

        $this->vueLayout = 'layout-vue';
        $this->language = Languages::getInstance(false);
        $this->lang = $this->language->getCurrentLanguageCode();
        $this->lang_id = $this->language->getCurrentLanguageID();

        $this->initialize();

        Navigation::generateMenu($this->menu);

        $this->user = User::getUser(UserAdminSession::getCurrentUserID());
        $this->eshop = Eshop::getInstance();
    }

    /**
     * @return array
     */
    protected function getBaseParams(): array {
        $baseParams = [];
        $baseParams["filemanagerKey"] = null;

        if ( UserAdminSession::isCurrentUser() ) {
            $baseParams = [
                'user' => $this->user,
                'menu' => $this->menu->getMenu(),
                'path' => array_reverse($this->menu->getPath($this->getRequest())),
                'filemanagerKey' => 'KxrAjXPO5DihmPY7aUtqwBCed8OcvfYw'
            ];
        }

        $baseParams["basePath"] = _bu();
        $baseParams['eshop'] = $this->eshop;
        $baseParams['activeLanguages'] = $this->language->getActiveLanguages();
        $baseParams['lang'] = $this->lang;
        $baseParams['lang_id'] = $this->lang_id;

        return $baseParams;
    }

    protected function getVueParams(){
        $params = parent::getVueParams();

        if($this->user){
            $params['user'] = $this->user ? $this->user->toArray() : null;
            unset($params['user']['Hash']);
            unset($params['user']['PublicHash']);
        }

        $params['logo_path'] = _bu() . '/img/front/logo.svg';
        $params['appTitle'] = 'Denik pleti';

        $locale = Languages::getInstance()->getCurrentLanguageCode();

        $translations = [];
        if($locale !== 'CZ'){
            $strings = $this->translation->getStrings($locale, true);

            foreach ($strings as $id => $string) {
                $translations[$string['orig']] = $string['text'];
            }
        }

        $params['translations'] = [
            'origLocale' => 'CS',
            'locale' => [
                'ID' => Languages::getInstance()->getCurrentLanguageID(),
                'Name' => Languages::getInstance()->getCurrentLanguageName(),
                'Code' => Languages::getInstance()->getCurrentLanguageCode(),
            ],
            'activeLanguages' => Languages::getInstance()->getActiveLanguages(),
            'languages' => Languages::getInstance()->getLanguages(),
            'core' => \Jolanda\Translations\Lang::getInstance()->getLangsArray(),
            'translations' => $translations,
        ];

        return $params;
    }

}