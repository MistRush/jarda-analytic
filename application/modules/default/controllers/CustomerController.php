<?php
use Admin_Model_Address as Address;
use Admin_Model_Cart as Cart;
use Admin_Model_Coupon as Coupon;
use Admin_Model_NewsletterSubscriber as NewsletterSubscriber;
use Admin_Model_Order as Order;
use Admin_Model_Page as Page;
use common\logic\Configs;
use Common_Model_Country as Country;
use Common_Model_CountryLang as CountryLang;
use common\logic\Ares\Ares;
use common\logic\Ecomail\Newsletter;
use common\logic\Email\EmailFactory;
use common\logic\Eshop\Eshop;
use common\logic\Front\Captcha;
use common\logic\Helper\OldUserTransferHasher;
use user\logic\UserClientSession;
use User_Model_LoginLog as LoginLog;
use User_Model_User as User;
use User_Model_OldUser as OldUser;

class CustomerController extends BaseController {

    const MY_ACCOUNT_LINK = 'customer/my-account';
    const REGISTER_USER_EXISTS_SESSION = 'register-user-exists-session';

    public function myAccountAction() {
        if (UserClientSession::getCurrentUserID() == null) {
            $this->forward('no-access', 'error', 'default');
            return;
        }

        $this->renderLatte([
            'title' => translate('Můj účet'),
            'metaDescription' => translate('Můj účet'),
            'metaKeywords' => translate('Můj účet'),
            'user' => User::getUser(UserClientSession::getCurrentUserID()),
            'contentClass' => 'light-grey',
        ]);
    }

    public function myDayAction() {
        if (UserClientSession::getCurrentUserID() == null) {
            $this->forward('no-access', 'error', 'default');
            return;
        }

        $this->renderLatte([
            'title' => translate('Můj účet'),
            'metaDescription' => translate('Můj účet'),
            'metaKeywords' => translate('Můj účet'),
            'user' => User::getUser(UserClientSession::getCurrentUserID()),
            'contentClass' => 'light-grey',
        ]);
    }

    public function oldAccountAction() {
        $hash = $this->getRequest()->getParam('hash');
        if (empty($hash)) {
            $this->forward('no-access', 'error', 'default');
            return;
        }
        $hasher = new OldUserTransferHasher();
        if(!$hasher->verifyUserHash($hash)) {
            $this->forward('no-access', 'error', 'default');
            return;
        }
        $payload = json_decode(base64_decode($hash), true);
        $userID = $payload['user_id'];
        $user = OldUser::getOldUserByID($userID);

        if(!$user) {
            $this->forward('index', 'index', 'default');
            return;
        }
        $msg = '';
        $nameArray = explode(' ', $user->ContactPerson);
        $firstName = end($nameArray);
        $deliveryAddress = $user->DeliveryStreet && $user->DeliveryCity && $user->DeliveryZipCode;
        $lastName = $nameArray[0];

        $deliveryCountry_ID = $user->DeliveryCountry?Country::getCountryIDByEkonomisCode($user->DeliveryCountry):null;
        $invoiceCountry_ID = $user->CompanyCountry?Country::getCountryIDByEkonomisCode($user->CompanyCountry):null;

        $this->renderLatte([
            'title' => translate('Můj účet'),
            'metaDescription' => translate('Můj účet'),
            'metaKeywords' => translate('Můj účet'),
            'user' => $user,
            'deliveryAddress' => $deliveryAddress,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'contentClass' => 'light-grey',
            'countries' => CountryLang::getCountriesByIDs(Country::ALLOWED_COUNTRIES),
            'msg' => $msg,
            'deliveryCountry_ID' => $deliveryCountry_ID,
            'invoiceCountry_ID' => $invoiceCountry_ID,
        ]);
    }

    public function loginAction() {
        $name = $this->getRequest()->getParam('Name');
        $password = $this->getRequest()->getParam('Password');
        $msg = '';

        if (UserClientSession::getCurrentUserID() != null) {
            $this->forward('index', 'index', 'default');
            return;
        }

        if (isset($_POST['Send'])) {
            $valid = true;

            if (!$name || !$password)
                $valid = false;

            if ($valid) {
                $user = User::getUserByEmailForLogin($name);

                if ($user == null || !password_verify($password, $user[0]['Hash']) ) {
                    $msg = 'Neplatné přihlašovací údaje';
                } else {
                    UserClientSession::setCurrentUser($user[0]['ID'], $user[0]['Name'], $user[0]['Type'], $user[0]['User_ID']);
                    LoginLog::createLoginLog('Přihlášení', UserClientSession::getCurrentUserID());
                    Cart::updateCartAfterLogin();
                    Admin_Model_WishList::updateWishListAfterLogin();

                    $this->forward('index', 'index', 'default');
                    return;
                }
            } else {
                $msg = translate('Nejsou vyplněné všechny údaje.');
            }
        }

        $this->renderLatte([
            'mainContainer' => false,
            'name' => $name,
            'msg' => $msg,
            'title' => translate('Přihlášení'),
            'metaDescription' => translate('Přihlášení'),
            'metaKeywords' => translate('Přihlášení'),
        ]);
    }

    public function processLoginAction() {
        header('Content-Type: application/json');

        if (UserClientSession::getCurrentUserID() != null) {
            echo json_encode([
                'status' => 'success',
                'redirect' => '/'
            ]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? null;
        $password = $input['password'] ?? null;

        if (!$name || !$password) {
            echo json_encode([
                'status' => 'error',
                'message' => translate('Nejsou vyplněné všechny údaje.')
            ]);
            exit;
        }

        $user = User::getUserByEmailForLogin($name);

        bdump($user);

        if ($user == null || !password_verify($password, $user['Hash'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatné přihlašovací údaje'
            ]);
            exit;
        }

        UserClientSession::setCurrentUser($user['ID'], $user['Name'], $user['Type'], $user['User_ID']);
        LoginLog::createLoginLog('Přihlášení', UserClientSession::getCurrentUserID());

        echo json_encode([
            'status' => 'success',
            'redirect' => '/'
        ]);
        exit;
    }

    public function registerUserAction() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode([
                'status' => 'error',
                'message' => 'Neplatná metoda požadavku.'
            ]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['email']) || empty($input['email'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Email je povinný.'
            ]);
            exit;
        }

        if (!isset($input['password']) || empty($input['password'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Heslo je povinné.'
            ]);
            exit;
        }

        if (!isset($input['passwordAgain']) || empty($input['passwordAgain'])) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Potvrzení hesla je povinné.'
            ]);
            exit;
        }

        if (!isset($input['terms']) || $input['terms'] !== true) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Musíte souhlasit s obchodními podmínkami.'
            ]);
            exit;
        }

        if (!isset($input['gdpr']) || $input['gdpr'] !== true) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Musíte souhlasit se zpracováním osobních údajů.'
            ]);
            exit;
        }

        $email = trim($input['email']);
        $password = $input['password'];
        $passwordAgain = $input['passwordAgain'];
        $newsletter = isset($input['newsletter']) ? $input['newsletter'] : false;
        $token = isset($input['recaptchaToken']) ? $input['recaptchaToken'] : '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Vyplňte e-mail ve správném formátu.'
            ]);
            exit;
        }

        if (strlen($password) < 5) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Heslo musí obsahovat alespoň 5 znaků.'
            ]);
            exit;
        }

        if ($password !== $passwordAgain) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Zadaná hesla se neshodují.'
            ]);
            exit;
        }

//        if (!empty($token)) {
//            $captcha = new Captcha($token);
//            if (!$captcha->isSuccess()) {
//                echo json_encode([
//                    'status' => 'error',
//                    'message' => 'Captcha ověření se nezdařilo.'
//                ]);
//                exit;
//            }
//        }

        try {
            $existingUser =  User_Model_User::getUserByEmail($email);

            if (!empty($existingUser)) {
                echo json_encode([
                    'status' => 'error',
                    'message' => $existingUser
                ]);
                exit;
            }

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $customer = User_Model_User::createUser($email, $password, "customer", Eshop::getInstance()->getEshop()->ID);;

            if ($customer) {

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Registrace byla úspěšně dokončena. Můžete se nyní přihlásit.',
                    'redirect' => '/customer/login'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Chyba při vytváření uživatelského účtu.'
                ]);
            }

        } catch (Exception $e) {
            error_log('Registration error: ' . $e->getMessage());

            echo json_encode([
                'status' => 'error',
                'message' => 'Došlo k chybě při registraci. Zkuste to prosím znovu.'
            ]);
        }

        exit;
    }

    public function transferOldUserAction() {
        $hash = $this->getRequest()->getParam('Hash');
        $isLoginEmailChanged = false;
        $loginEmail = $this->getRequest()->getParam('Email');
        $password = $this->getRequest()->getParam('Password');
        if (empty($hash)) {
            $this->forward('no-access', 'error', 'default');
            return;
        }
        $hasher = new OldUserTransferHasher();

        if(!$hasher->verifyUserHash($hash)) {
            $this->forward('no-access', 'error', 'default');
            return;
        }

        $payload = json_decode(base64_decode($hash), true);
        $oldUserID = $payload['user_id'];
        $oldUser = OldUser::getOldUserByID($oldUserID);
        if($loginEmail !== $oldUser->LoginName) {
           $isLoginEmailChanged = true;
        }
        $user = $this->transferOldAccount($oldUserID, $loginEmail, $password, $isLoginEmailChanged);
        if($isLoginEmailChanged) {
            EmailFactory::sendConfirmRegistrationEmail($user);
        } else {
            UserClientSession::setCurrentUser($user->ID, $loginEmail, User::TYPE_CUSTOMER);
        }

        $this->renderLatte([
            'page' => Page::getPageByID(Page::ID_REGISTER),
            'title' => translate('Převedení účtu do nového systému'),
            'metaDescription' => translate('Registrace'),
            'metaKeywords' => translate('Registrace'),
            'contentClass' => 'light-grey',
            'isLoginEmailChanged' => $isLoginEmailChanged,
        ]);
    }


    public function step1RegisterAction() {
        $rue = new Zend_Session_Namespace(self::REGISTER_USER_EXISTS_SESSION);

        $this->renderLatte([
            'mainContainer' => false,
            'page' => Page::getPageByID(Page::ID_REGISTER),
            'msg' => $rue->msg,
            'title' => translate('Registrace'),
            'metaDescription' => translate('Registrace'),
            'metaKeywords' => translate('Registrace'),
        ]);

        $rue->msg = null;
    }


    public function registerAction() {
        $rue = new Zend_Session_Namespace(self::REGISTER_USER_EXISTS_SESSION);

        $this->renderLatte([
            'mainContainer' => false,
            'page' => Page::getPageByID(Page::ID_REGISTER),
            'msg' => $rue->msg,
            'title' => translate('Registrace'),
            'metaDescription' => translate('Registrace'),
            'metaKeywords' => translate('Registrace'),
        ]);

        $rue->msg = null;
    }

    public function registerDoneAction() {
        $request = $this->getRequest();
        $token = $request->getParam('Token');
        $captcha = new Captcha($token);

        if (!$captcha->isSuccess())
            return;

        if ( User::getUserByEmail($request->getParam('Email')) || OldUser::getOldUserByLogin($request->getParam('Email')) ) {
            $rue = new Zend_Session_Namespace(self::REGISTER_USER_EXISTS_SESSION);
            $rue->msg = 'Registraci se nepodařilo provést zadaný e-mail se již v systému nachází.';

            $this->_helper->redirector('register', 'customer', 'default');
            return;
        } else {
            $user = User::createUser($request->getParam('Email'), $request->getParam('Password'), User::TYPE_CUSTOMER, Eshop::getInstance()->getEshop()->ID);

            if(filter_var($this->getRequest()->getParam('newsletter'), FILTER_VALIDATE_BOOLEAN)) {
               $user->Newsletter = true;
               $user->save();
            }

            Address::createAddress(Address::TYPE_INVOICE, $request, $user->ID);
            if ( $this->getRequest()->getParam('IsDelivery') == 'on' )
                Address::createAddress(Address::TYPE_DELIVERY, $request, $user->ID);
            EmailFactory::sendConfirmRegistrationEmail($user);
        }

        $this->renderLatte([
            'title' => translate('Registrace'),
            'metaDescription' => translate('Registrace'),
            'metaKeywords' => translate('Registrace'),
            'contentClass' => 'light-grey',
            'mainContainer' => false,
        ]);
    }

    public function loginProcessAction() {
        $email = $this->getRequest()->getParam('Email');
        $password = $this->getRequest()->getParam('Password');
        $user = User::getUserByEmailForLogin($email);
        if (!$user) {
            $validOldLogin = $this->checkOldLoginDetails($email, $password);
            if ($validOldLogin) {
                $needSetLoginEmail = !$this->isEmail($email);
                $oldUserDetails = OldUser::getOldUserByLogin($email);
                $hasher = new OldUserTransferHasher();
                $securityHash = $hasher->createUserHash($oldUserDetails->ID, $oldUserDetails->Password);
                echo json_encode(['userFromOldAccount' => true, 'success' => true, 'needSetLoginEmail' => $needSetLoginEmail, 'hash' => $securityHash]);
                return;
            } else {
                $user = null;
            }
        }

        if ($user == null || !password_verify($password, $user->Hash)) {
            echo json_encode(['userFromOldAccount' => false, 'success' => false]);
        } else {
            UserClientSession::setCurrentUser($user->ID, $user->Name, $user->Type);
            LoginLog::createLoginLog('Přihlášení', $user->ID);
            Cart::updateCartAfterLogin();

            echo json_encode(['userFromOldAccount' => false, 'success' => true]);
        }
    }

    public function checkIcAction() {
        $ic = $this->getRequest()->getParam('IC');
        if (empty($ic)) {
            $this->sendJsonResponse(['status' => 'error', 'msg' => translate('Zadejte IČ')]);
            return;
        }

        $aresData = Ares::getCustomerByIn($ic);
        if($aresData['status'] === 'error') {
            $this->sendJsonResponse(['status' => 'error', 'msg' => $aresData['errmsg']]);
            return;
        }

       $this->sendJsonResponse(['status' => 'success', 'data' => $aresData]);

    }

    public function logoutAction() {
        if (UserClientSession::getCurrentUserID() == null) {
            $this->forward('index', 'index', 'default');
            return;
        }

        LoginLog::createLoginLog('odhlášení', UserClientSession::getCurrentUserID());
        UserClientSession::resetCurrentUser();

        $this->renderLatte([
            'user' => User::getCurrentUser(),
            'title' => translate('Odhlášení'),
            'metaDescription' => translate('Odhlášení'),
            'metaKeywords' => translate('Odhlášení'),
            'contentClass' => 'light-grey',
            'mainContainer' => false,
        ]);
    }

    public function lostPasswordAction() {
        $valid = true;
        $msg = '';
        $msgSuccess = '';
        $name = $this->getRequest()->getParam('Name');

        if (isset($_POST['Send'])) {
            if (!$name) {
                $valid = false;
                $msg = translate('Vyplňte uživatelský účet.');
            }

            if ($valid) {
                $user = User::getUserByEmail($name);
                if (sizeof($user) < 1) {
                    $msg = translate('Zadaný uživatel neexistuje.');
                } else {
                    EmailFactory::sendLostPassword($user, $this->getRecoverPasswordHash($user));
                    $msgSuccess = translate('Odkaz na nastavení nového hesla Vám byl odeslán na Váš e-mail');
                    }
                }
            }

        $this->renderLatte([
            'name' => $name,
            'msg' => $msg,
            'msgSuccess' => $msgSuccess,
            'title' => translate('Zapomenuté heslo'),
            'metaDescription' => translate('Zapomenuté heslo'),
            'metaKeywords' => translate('Zapomenuté heslo'),
            'mainContainer' => false,
        ]);
    }

    /**
     * Stranka pro zadani novehlo hesla (odkazem z mailu o obnoveni hesla)
     */
    public function setNewPasswordAction() {
        $request = $this->getRequest();
        $user = User::getUserByEmail($request->getParam('recoverEmail'));

        if (empty($user) || !$this->verifyRecoverPasswordHash($user, $request->getParam('recoverHash'))) {
            $this->forward('no-access', 'error', 'default');
            return;
        }

        $this->renderLatte([
            'title' => translate('Obnova zapomenutého heslo'),
            'metaDescription' => translate('Obnova zapomenútého hesla'),
            'user' => $user,
            'hash' => $request->getParam('hash'),
        ]);
    }

    /**
     * Zpracování zadani novehlo hesla (ze stranky po odkazu z mailu o obnoveni hesla)
     */
    public function processSetNewPasswordAction() {
        $request = $this->getRequest();
        $user = User::getUserByEmail($request->getParam('recoverEmail'));

        if (empty($user) || $request->getParam('recoverHash') !== $this->getRecoverPasswordHash($user))
            $this->forward('no-access', 'error', 'default');

        $salt = User::generateSalt();
        User::changePassword($user, $request->getParam('Password'), $salt);
        $this->sendJsonResponse(['response' => 'OK']);
    }

    public function lostPasswordDoneAction() {
        $this->renderLatte([
            'title' => translate('Zapomenuté heslo'),
            'metaDescription' => translate('Zapomenuté heslo'),
            'metaKeywords' => translate('Zapomenuté heslo'),
            'contentClass' => 'light-grey',
        ]);
    }

    /**
     * @throws Doctrine_Query_Exception
     */
    public function orderListAction() {
        if (UserClientSession::getCurrentUserID() == null)
            $this->forward('no-access', 'error', 'default');

        $activeOrders = Order::getActiveOrders(UserClientSession::getCurrentUserID());
        $finishedOrders = Order::getFinishedOrders(UserClientSession::getCurrentUserID());

        $this->renderLatte([
            'user' => User::getUser(UserClientSession::getCurrentUserID()),
            'activeOrders' => $activeOrders,
            'finishedOrders' => $finishedOrders,
        ], 'customer/my-account/page/order-list');
    }

    public function orderDetailAction() {
        $orderID = $this->getRequest()->getParam('id');
        if (!is_numeric(($orderID))) {
            $this->forward('not-found', 'error', 'default');
            return;
        }
        $order = Order::getOrderByID($this->getRequest()->getParam('id'));

        $showOrder = true;
        if (UserClientSession::getCurrentUserID() != $order['User_ID'])
            $showOrder = false;

        if (!$showOrder)
            $this->forward('no-access', 'error', 'default');

        $this->renderLatte([
            'order' => $order,
            'coupon' => Coupon::getCouponByOrder($order['ID']),
        ], 'customer/my-account/page/order-detail');
    }

    public function editPasswordAction() {
        if (UserClientSession::getCurrentUserID() == null)
            $this->forward('no-access', 'error', 'default');

        $this->renderLatte([
            'user' => User::getUser(UserClientSession::getCurrentUserID()),
        ], 'customer/my-account/page/password-edit');
    }



    // TODO: change personal dat, udelej form
    public function editPasswordProcessAction() {
        if (isset($_POST['FirstName']))
            Address::updateCurrentUserPersonalData($this->getRequest()->getParams());

        if (!empty($_POST['CurrentPassword']) && !empty($_POST['Password']) && !empty($_POST['PasswordAgain'])) {
            $msg='';
            $valid = true;
            $request = $this->getRequest();
            $currentPassword = $request->getParam('CurrentPassword');
            $password = $request->getParam('Password');
            $passwordAgain = $request->getParam('PasswordAgain');

            if (!$currentPassword) {
                $msg = translate("Vyplňte všechny položky formuláře");
                $valid = false;
            }

            if (strlen($password) < 5) {
                $msg = translate("Heslo musí mít min. 5 znaků");
                $valid = false;
            }

            if ($password != $passwordAgain) {
                $msg = translate("Zadaná hesla se neshodují");
                $valid = false;
            }

            if ($valid) {
                $user = User::getUserByEmail(UserClientSession::getCurrentUserName());
                if (!password_verify($currentPassword, $user[0]['Hash'])) {
                    $valid = false;
                    $msg = translate("Zadané heslo neodpovídá originálu");
                } else {
                    $salt = User::generateSalt();
                    User::changePassword($user, $password, $salt);
                    $msg = translate("Heslo změněno");
                }
            }
        } else {
            $msg = translate("Vyplňte všechny položky formuláře");
            $valid = false;
        }

        $this->renderLatte([
            'msg'=> $msg,
            'valid' => $valid
        ],'customer/my-account/page/password-edit-process');
    }

    public function addressListAction() {
        if (UserClientSession::getCurrentUserID() == null)
            $this->forward('no-access', 'error', 'default');

        $invoiceAddresses = Address::getAddresses(UserClientSession::getCurrentUserID(), Address::TYPE_INVOICE);
        $deliveryAddresses = Address::getAddresses(UserClientSession::getCurrentUserID(), Address::TYPE_DELIVERY);

        $this->renderLatte([
            'user' => User::getCurrentUser(),
            'invoiceAddresses' => $invoiceAddresses,
            'deliveryAddresses' => $deliveryAddresses,
        ], 'customer/my-account/page/address-list');
    }

    public function addressEditAction() {
        if (!$userID = UserClientSession::getCurrentUserID())
            $this->forward('no-access', 'error', 'default');

        $addressID = $this->getRequest()->getParam('addressId');
        $type = $this->getRequest()->getParam('type');

        if($addressID) {
            $address = Address::getAddress($addressID);
            if($address['User_ID'] != $userID)
                $this->forward('no-access', 'error', 'default');
        }


        $this->renderLatte([
            'address'=> $address??null,
            'type' => $type,
            'user' => User::getCurrentUser(),
            'countries' => CountryLang::getCountriesByIDs(Country::ALLOWED_COUNTRIES)
        ], 'customer/my-account/page/address-edit');
    }

    public function addressEditProcessAction() {
        if (UserClientSession::getCurrentUserID() == null)
            $this->forward('no-access', 'error', 'default');

        $isDelivery = filter_var($this->getRequest()->getParam('IsDelivery'), FILTER_VALIDATE_BOOLEAN);
        $addressID = $this->getRequest()->getParam('AddressId');
        $userID = UserClientSession::getCurrentUserID();

        if ($addressID) {
            Address::updateAddress($addressID, $this->getRequest(), $userID, $isDelivery);
        }
        else {
            if($main = filter_var($this->getRequest()->getParam('MainAddress'), FILTER_VALIDATE_BOOLEAN)) {
                Address::clearMainAddress($userID, $isDelivery ? Address::TYPE_DELIVERY : Address::TYPE_INVOICE);
            }
            Address::createAddress($isDelivery ? Address::TYPE_DELIVERY : Address::TYPE_INVOICE, $this->getRequest(), $userID, $main);
        }

        $this->renderLatte([
            'user' => User::getCurrentUser(),
        ], 'customer/my-account/page/address-edit-process');
    }

    public function removeAddressAction() {
        if (!$userID = UserClientSession::getCurrentUserID())
            $this->forward('no-access', 'error', 'default');
        $addressID = $this->getRequest()->getParam('addressId');
        $address = Address::getAddress($addressID);
        if($address['User_ID'] != $userID)
            $this->forward('no-access', 'error', 'default');

        if($address['Main']) {
            $type = $address['Type'] == Address::TYPE_INVOICE ? 'fakturační' : 'dodací';
            $msg = "Nelze smazat hlavní $type adresu";
            echo json_encode(['status' => 'error', 'msg' => $msg]);
            return;
        }

        Address::deleteAddress($userID, $addressID);

        echo json_encode(['status' => 'success']);
    }

    /**
     * @throws Zend_Json_Exception
     */
    public function newsletterSubscribeAction() {
        $newsletterSubscriber = $this->getRequest()->getParam('NewsletterSubscriber');

        if (NewsletterSubscriber::isAllreadySubscribed($newsletterSubscriber)) {
            $message = translate('E-mail je již v systému evidován.');
        } else {
            NewsletterSubscriber::createSubscriber($newsletterSubscriber);
            $message = translate('E-mail byl úspěšně přidán do systému newsletteru.');
            // Newsletter::addNewEmailContactToNewsletterList($newsletterSubscriber);
        }

        echo $message;
    }

    public function checkEmailAction() {
        $email = $this->getRequest()->getParam('email');

        if ($email) {
            $user = User::getUserByEmail($email);

            if ($user) {
                echo 1;
                return;
            }
        }

        echo 0;
    }

    public function checkRegisterEmailAction() {
        header('Content-Type: application/json');

        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? null;

        bdump($email, 'email');

        if ($email) {
            $user = User::getUserByEmail($email);
            echo json_encode(['exists' => (bool)$user]);
            return;
        }

        echo json_encode(['exists' => false]);
    }

    public function registrationInfoAction() {
        $title = $this->getRequest()->getParam('title');
        $content = $this->getRequest()->getParam('content');
        $this->renderLatte([
            'title' => $title,
            'content' => $content,
        ]);
    }

    /**
     * @throws Exception
     */
    public function confirmRegistrationAction() {
        $token = $this->getRequest()->getParam('token');
        try {
            $user = User::confirmUserRegistration($token);
            $registrationStatus = true;
        } catch (Exception $e) {
            $registrationStatus = false;
        }
        if ($user) {
            UserClientSession::setCurrentUser($user->ID, $user->Name, $user->Type);
            EmailFactory::sendRegister($user);
        }
        else
            $registrationStatus = false;
        $this->forward('index', 'index', 'default', ['RegistrationConfirmed' => $registrationStatus]);
    }


    /**
     * @param array $user
     * @return string
     */
    private function getRecoverPasswordHash(array $user): string {
        return hash('sha256', $user[0]['Name'] . $user[0]['Salt']);
    }

    private function verifyRecoverPasswordHash(array $user, string $providedHash): bool {
        $computedHash = hash('sha256', $user[0]['Name'] . $user[0]['Salt']);
        return hash_equals($computedHash, $providedHash);
    }

    private function transferOldAccount(int $oldUserID, string $login, string $password, bool $isLoginEmailChanged):?User {
        $oldUser = OldUser::getOldUserByID($oldUserID);
        if ($oldUser) {
            $user = User::createUser($login, $password, User::TYPE_CUSTOMER, Eshop::getInstance()->getEshop()->ID, $oldUser->Code);
            $user->BasePriceTypeCode = $this->setPriceType($oldUser->PriceType);
            if ($oldUser->Discount > 0) {
                $user->Discount = $oldUser->Discount;
            }
            if ($isLoginEmailChanged)
                $user->Active = false;
            else
                $user->Active = true;
            $user->Newsletter = $oldUser->Newsletter;

            $user->save();
            //userovi nastavit allowinvoicepayment
            //TODO raději upřesnit
//                if($oldUser->PaymentAvailability) {
//                    $user->AllowInvoicePayment = $this->setAllowInvoicePayment($oldUser->PaymentAvailability);
//                }
            //userovi nastavit deactivateQuantityMin ?
            $oldUser->Transfered = true;
            $oldUser->save();

            Address::createAddressFromOldAccount(Address::TYPE_INVOICE, $oldUser, $user->ID);
            if ($oldUser->DeliveryStreet && $oldUser->DeliveryCity && $oldUser->DeliveryZipCode) {
                Address::createAddressFromOldAccount(Address::TYPE_DELIVERY, $oldUser, $user->ID);
            }
            return $user;

        }

    }

    private function isEmail(string $string): bool {
        return filter_var($string, FILTER_VALIDATE_EMAIL) !== false;
    }

    private function setPriceType(mixed $PriceType): string {
        return match($PriceType) {
            '2' => 'B',
            '3' => 'C',
            '4' => 'D',
            default => 'A',
        };
    }

    private function setAllowInvoicePayment(string $paymentAvailability) {
        return match($paymentAvailability) {
            'PP' => true,
            'PREDEM' => 1,
            default => false,
        };
    }

    private function checkOldLoginDetails(string $email, string $password): bool {
        $oldUser = OldUser::getOldUserByLogin($email);
        return $oldUser && md5($password) === $oldUser->Password;
    }
}