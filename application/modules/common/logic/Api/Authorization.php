<?php
namespace common\logic\Api;

use common\logic\Configs;
use ReallySimpleJWT\Token;
use user\logic\UserClientSession;
use User_Model_LoginLog as LoginLog;
use User_Model_User as User;

class Authorization extends Base {
    /**
     * @throws \Exception
     */
    public static function authorize($data) {
        self::generateAccessToken($data);
    }

    /**
     * @throws \Exception
     */
    public static function isAuthorized($token, $permissionCode): bool {
        return self::checkTokenAndPermission($token, $permissionCode);
    }

    public static function clearUserxSession() {
        self::clearSession();
    }

    /**
     * @throws \Exception
     */
    private static function generateAccessToken($data) {
        $user = User::getUserForApiLogin($data['Username']);
        if ($user == null || !password_verify($data['Password'], $user['Hash'])) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization')), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
            return;
        }
        $secret = Configs::getApiTokenSecret();
        $payload = [
            'iat' => time(),
            'u_id' => $user['ID'],
            'exp' => time() + 3600,
            'iss' => $user['Name'],
            't' => 'api-user'
        ];

        $token = Token::customPayload($payload, $secret);
        \Admin_Model_ApiLog::insertRecord([
            'User'=> $data['Username'],
            'Url' => htmlentities($_SERVER['REQUEST_URI']),
            'StatusCode'=> '200 OK',
            'Message' => 'User authorized',
        ]);
        parent::sendOutput(json_encode(array("success" => "Access token for user ".$data['Username'], 'accessToken'=>$token)), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    private static function clearSession() {
        LoginLog::createLoginLog('Odhlášení', UserClientSession::getCurrentUserID());
        UserClientSession::resetCurrentUser();
        parent::sendOutput(json_encode(array("success" => "Úspěšně odhlášen")), array('Content-Type: application/json', 'HTTP/1.1 200 OK'));
    }

    /**
     * @throws \Exception
     */
    private static function checkTokenAndPermission($token, $permissionCode): bool {
        if(!Token::validateExpiration($token)) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization. Token has expired '.$token)), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }

        if(!Token::validate($token, Configs::getApiTokenSecret())) {
            parent::sendOutput(json_encode(array("msg" => 'Fail wrong authorization. Token is not valid '.$token)), array('Content-Type: application/json', 'HTTP/1.1 403 Forbidden'));
        }

        $payloadData = Token::getPayload($token);
        \Admin_Model_ApiLog::insertRecord([
            'User'=> $payloadData['iss'],
            'Url' => htmlentities($_SERVER['REQUEST_URI']),
            'StatusCode'=> '200 OK',
            'Message' => 'Perm '.$permissionCode.' accepted',
        ]);
        return self::authorizeUser($payloadData, $permissionCode);
    }

    private static function authorizeUser($payloadData, $permissionCode): bool {
        UserClientSession::setCurrentUser($payloadData['u_id'], $payloadData['iss'], $payloadData['t']);
        LoginLog::createLoginLog('Přihlášení', UserClientSession::getCurrentUserID());
        return self::isAuthorizedForSuchAction($permissionCode);
    }

    private static function isAuthorizedForSuchAction($permissionCode): bool {
        return UserClientSession::getCurrentUserType() == User::TYPE_API_USER && UserClientSession::hasPermission($permissionCode);

    }

}
