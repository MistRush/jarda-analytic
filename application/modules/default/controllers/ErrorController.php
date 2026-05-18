<?php

class ErrorController extends BaseController {

    public function errorAction() {
        $error = $this->_getParam('error_handler');

        switch ($error->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ROUTE:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                $this->getResponse()->setHttpResponseCode(404);
                $this->_forward('not-found', 'error', 'default');
                return;
                break;
            default:
                $this->getResponse()->setHttpResponseCode(500);

                if ($error->exception != null) {
                    Clevis_Error::renderProductionError(
                        'Exception', $error->exception->getMessage(), $error->exception->getFile(), $error->exception->getLine(), $error->exception->getTrace(), $error->exception
                    );

                    $this->_forward('error-500', 'error', 'default');
                } else {
                    Clevis_Error::renderProductionError(0, 'Neznámá chyba!');
                }
                break;
        }
    }

    public function noAccessAction() {
        $this->renderLatte([
            'contentClass' => 'light-grey',
        ]);
    }

    public function notFoundAction() {
        $this->getResponse()->setHttpResponseCode(404);
        $this->renderLatte([
            'contentClass' => 'light-grey',
        ]);
    }

    public function error500Action() {
        $this->getResponse()->setHttpResponseCode(500);
        $this->renderLatte([
            'contentClass' => 'light-grey',
        ]);
    }
}