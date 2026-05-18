<?php
namespace common\logic\Front;

/**
 * Module constants
 */
class Captcha {

    const RECAPTCHA_SECRET = '6LdSvYUsAAAAAMIVn8UyVRe1N6Dd_c3UVa4yXSQU';

    /**
     * success
     *
     * @var bool
     */
    private bool $success = false;

    /**
     * Constructor
     */
    public function __construct($recaptchaResponse) {
        $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . self::RECAPTCHA_SECRET . '&response=' . $recaptchaResponse);
        $responseData = json_decode($verifyResponse);

        $this->setSuccess($responseData->success);
    }

    /**
     * @return bool
     */
    public function isSuccess(): bool {
        return $this->success;
    }

    /**
     * @param bool $success
     */
    public function setSuccess(bool $success) {
        $this->success = $success;
    }
}