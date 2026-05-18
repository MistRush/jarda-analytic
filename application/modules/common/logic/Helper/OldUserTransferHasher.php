<?php
namespace common\logic\Helper;
use common\logic\Configs;
use Exception;
use User_Model_OldUser as OldUser;

class OldUserTransferHasher {
    private $secret_key;
    private $algorithm;

    /**
     * @throws Exception
     */
    public function __construct($algorithm = 'sha256') {
        $this->secret_key = Configs::getHasherSecretKey();
        $this->algorithm = $algorithm;
    }

    /**
     * Vytvoří bezpečný hash z ID a hesla
     */
    public function createUserHash($user_id, $password_hash): string {
        $timestamp = time();
        $data = $user_id . '|' . $password_hash . '|' . $timestamp;
        $hash = hash_hmac($this->algorithm, $data, $this->secret_key);

        $payload = json_encode([
            'hash' => $hash,
            'timestamp' => $timestamp,
            'user_id' => $user_id
        ]);

        return base64_encode($payload);
    }


    public function verifyUserHash($received_hash, $max_age_seconds = 3600): bool {
        try {
            // Dekódujeme payload
            $payload = json_decode(base64_decode($received_hash), true);

            if (!$payload || !isset($payload['hash'], $payload['timestamp'], $payload['user_id'])) {
                return false;
            }

            if (!$payload['user_id'] ) {
                return false;
            }

            // Ověříme věk tokenu
            if (time() - $payload['timestamp'] > $max_age_seconds) {
                return false; // Token je příliš starý
            }

            $oldUser = OldUser::getOldUserByID($payload['user_id']);

            if (!$oldUser) {
                return false;
            }
            $password_hash = $oldUser->Password;

            $data = $payload['user_id'] . '|' . $password_hash . '|' . $payload['timestamp'];
            $expected_hash = hash_hmac($this->algorithm, $data, $this->secret_key);

            return hash_equals($expected_hash, $payload['hash']);

        } catch (Exception $e) {
            return false;
        }
    }
}