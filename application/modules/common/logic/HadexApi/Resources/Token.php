<?php

namespace common\logic\HadexApi\Resources;
use User_Model_User as User;
use common\logic\Configs;

class Token {

    /**
     * @throws \Exception
     */
    public function getAccessToken($data): array {
        if (!isset($data['Username']) || !isset($data['Password'])) {
            return [
                "code" => 400,
                "status" => "error",
                "message" => "Username and password are required"
            ];
        }
        return $this->generateAccessToken($data);
    }

    /**
     * @throws \Exception
     */
    public function checkToken($token): array {
        if (!\ReallySimpleJWT\Token::validateExpiration($token)) {
            return [
                "code" => 403,
                "status" => "error",
                "message" => "Token expired"
            ];
        }

        if (!\ReallySimpleJWT\Token::validate($token, Configs::getApiTokenSecret())) {
            return [
                "code" => 403,
                "status" => "error",
                "message" => "Token is not valid"
            ];
        }

        return \ReallySimpleJWT\Token::getPayload($token);

    }

    /**
     * @throws \Exception
     */
    private function generateAccessToken($data): array {
        $user = User::getUserForApiLogin($data['Username']);
        if ($user == null || !password_verify($data['Password'], $user['Hash'])) {
            return [
                "code" => 403,
                "status" => "error",
                "message" => "Fail wrong authorization"
            ];
        }
        $secret = Configs::getApiTokenSecret();
        $payload = [
            'iat' => time(),
            'u_id' => $user['ID'],
            'exp' => time() + 3600,
            'iss' => $user['Name'],
            't' => 'api-user'
        ];

        $token = \ReallySimpleJWT\Token::customPayload($payload, $secret);

        return [
            "code" => 200,
            "status" => "success",
            "message" => "Access token for user " . $data['Username'],
            'accessToken' => $token
        ];
    }


}