<?php
require_once 'Bootstrap.php';

class Clevis_BootstrapCli extends Clevis_Bootstrap {

    /**
     * Init error handling
     */
    protected function _initErroHandling() {
        register_shutdown_function('Clevis_BootstrapCli::cli_handle_shutdown');
        set_error_handler('Clevis_BootstrapCli::cli_handle_error', E_ALL | E_STRICT);
    }

    /**
     * Handle shutdown in production and pass error to error handler if presented
     *
     * @return void
     */
    public static function cli_handle_shutdown() {
        $error = error_get_last();
        if ($error != null) {
            self::cli_handle_error($error['type'], $error['message'], $error['file'], $error['line']);
        }
    }

    public static function cli_handle_error($errno, $errstr, $errfile, $errline) {
        Clevis_Error::renderCliError($errno, $errstr, $errfile, $errline);
        return true;
    }
}
