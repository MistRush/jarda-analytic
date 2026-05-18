<?php
namespace Clevis\Zend;

use Admin_Model_EmailLog as EmailLog;
use common\logic\Configs;

class Mail extends \Zend_Mail {
    const CHARSET = 'UTF-8';

    private $logSubject;
    private $logBody;
    private $onAfterSend = array();

    public function __construct() {
        parent::__construct(self::CHARSET);
        
        // TODO: po prechodu na nove PHP  se bude puyivat toto
        $this->onAfterSend[] = function () {
            EmailLog::createLog($this->logBody, $this->logSubject, $this->_from, implode(',', $this->_to));
        };
    }

    public function setSubject($subject) {
        parent::setSubject($subject);

        $this->logSubject = $subject;
    }

    public function setBodyHtml($html, $charset = null, $encoding = \Zend_Mime::ENCODING_BASE64) {
        parent::setBodyHtml($html, $charset, $encoding);

        $this->logBody = $html;
    }

    public function send($transport = null) {        
        parent::send($transport ? $transport : $this->getTransport());                
        
        EmailLog::createLog($this->logBody, $this->logSubject, $this->_from, implode(',', $this->_to));
        
        // TODO: po prechodu na nove PHP  se bude puyivat toto        
        /*foreach ( $this->onAfterSend as $onAfterSend ) {
            $onAfterSend();
        }*/
    }
    
    private function getTransport() {
        $config = array();

        if ( Configs::getSmtpName() ) {
            $config = array (
                'auth' => 'plain',
                'username' => Configs::getSmtpName(),
                'password' => Configs::getSmtpPassword(),
                'port' => 25,);
        }        
        return new \Zend_Mail_Transport_Smtp(Configs::getSmtpServer(), $config);
    }
}
