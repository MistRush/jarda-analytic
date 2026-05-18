<?php

include('Crypt/RSA.php');

/**
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Cryptography
{
    public static function generateKeys()
    {
        $rsa = new Crypt_RSA();
        $rsa->setPrivateKeyFormat(CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
        $rsa->setPublicKeyFormat(CRYPT_RSA_PUBLIC_FORMAT_PKCS1);

        $privatekey = null;
        $publickey = null;
        extract($rsa->createKey(512));

        echo '<pre>' . $privatekey . '</pre>';
        echo '<pre>' . $publickey . '</pre>';
    }

    public static function encode($data, $key)
    {
        $rsa = new Crypt_RSA();
        if ( !$rsa->loadKey($key) ) {
            die("\nFailed to load key:\n" . substr($key, 0, 30));
        }
        $rsa->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
        set_error_handler(array('Cryptography', 'errorHandler'));
        $data = $rsa->encrypt($data);
        restore_error_handler();
        return base64_encode($data);
    }

    public static function decode($data, $key)
    {
        $data = base64_decode($data);
        $rsa = new Crypt_RSA();
        if ( !$rsa->loadKey($key) ) {
            die("\nFailed to load key:\n" . substr($key, 0, 30));
        }
        $rsa->setEncryptionMode(CRYPT_RSA_ENCRYPTION_PKCS1);
        set_error_handler(array('Cryptography', 'errorHandler'));
        $result = $rsa->decrypt($data);
        restore_error_handler();
        return $result;
    }

    public static function errorHandler($number, $message, $file, $line)
    {
    }
}
