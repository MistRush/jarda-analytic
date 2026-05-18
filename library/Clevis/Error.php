<?php

use common\logic\Email\Email;
use common\logic\Latte\LatteEngine;
use Tracy\Debugger;

class Clevis_Error {

    /**
     * Print runtime error
     *
     * @param $text
     * @return string
     */
    public static function renderRuntimeError($text, $debug = null) {
        $error = array();
        $error['error'] = true;
        $error['description'] = $text;
        $error['debug'] = $debug;
        echo json_encode($error);
        die();
    }

    public static function renderProductionError($type, $message, $file = null, $line = null, $trace = null, $exception = null) {
        Debugger::enable(Debugger::PRODUCTION, __DIR__ . '/../../data/log/tracy'); // aktivujeme Laděnku

        if ( $exception )
            Debugger::log($exception);

        // Prepare view
        $view = new Zend_View();
        $view->setScriptPath(APPLICATION_PATH . '/layouts/scripts');

        // Set type
        $view->type = 'Exception';
        switch ($type) {
            case E_ERROR:
                $view->type = 'Error';
                break;
            case E_NOTICE:
            case E_WARNING:
                $view->type = 'Warning';
                break;
            case E_PARSE:
                $view->type = 'Parse';
                break;
            default:
                if (is_string($type))
                    $view->type = $type;
                else
                    $view->type = 'Error(' . $type . ')';
                break;
        }

        // Set other parameters
        $view->message = $message;
        $view->file = $file;
        $view->line = $line;
        $view->trace = $trace;

        $output = $view->render('error.phtml');

        if (!Clevis_Helper::isDevelopmentEnvironment()) {
//            $mail = new Email()
//            $mail->setBodyHtml($output);
//            $mail->setFrom('info@filokalista.com', 'Filokalista');
//            $mail->addTo('vojkuvka@evidsoft.cz', "Filokalista");
//            $mail->setSubject($view->type . ': Chyba na serveru filokalista.com');
//            $mail->send();

           Email::sendEmail($view->type . ': Chyba na serveru trym.cz', $output, 'melecky@evidsoft.cz');

            if ( $view->type == 'Exception' || $view->type == 'Error' ) {
                $latte = LatteEngine::getInstance();
                $latte->render(__DIR__ . '/../../application/modules/default/views/latte/error/error-500.latte', BaseController::getBaseParams());

                die();
            }
        }
    }

    public static function renderCliError($type, $message, $file = null, $line = null, $trace = null) {
        print self::getErrorType($type) . PHP_EOL;
        print 'Message: ' . $message . PHP_EOL;
        print 'File: ' . $file . PHP_EOL;
        print 'Line: ' . $line . PHP_EOL;
    }
}