<?php

namespace common\logic\Cli;

use common\logic\Email\EmailFactory;
use common\logic\Configs;
use user\logic\UserAdminSession as UserSession;

/**
 * Class MoveRequestToCli
 * @package common\logic\Cli
 */
class MoveRequestToCli
{

    const FILE_CSV = 'file';

    /**
     * @param string $uniqid
     * @param string $nameAction
     * @param int|null $userID
     */
    public static function callCliOverUser(string $uniqid, string $nameAction, ?int $userID): void
    {
        if ($userID === null) {
            $userID = UserSession::getCurrentUserID();
        }

        if (isset($_SERVER['SystemRoot']) && strpos($_SERVER['SystemRoot'], 'WINDOWS') !== false) {
            bdmp("Neumím zavolat cli pro WINDOWS");
            return;
        } else {
            try {
                $executable = Configs::getPhpExecutable();
                exec("/usr/bin/nohup $executable -f cli.php $nameAction $uniqid $userID >/dev/null 2>&1 &");
            } catch (\Exception $e) {
                self::sendCallCliError($e);
            }
        }
    }

    /**
     * @param string $param
     * @param string $nameAction
     */
    public static function callCli(string $param, string $nameAction): void
    {
        //save param to file
        $fileName = tempnam(APP_TEMP_FOLDER, 'par');

        file_put_contents($fileName, $param);
        try {
            $executable = Configs::getPhpExecutable();
            $command = "$executable -f cli.php $nameAction $fileName";

            if (isset($_SERVER['SystemRoot']) && strpos(mb_strtoupper($_SERVER['SystemRoot']), 'WINDOWS') !== false) {
                pclose(popen("start /b $command", 'r'));
            } else {
//                $logFile = APPLICATION_PATH . "/../data/temp/cron.log";
//                touch($logFile);
                $logFile = "/dev/null";
                exec("/usr/bin/nohup $command >$logFile 2>&1 &");
            }
        } catch (\Exception $e) {
            self::sendCallCliError($e);
        }
    }

    private static function sendCallCliError(\Exception $e)
    {
        EmailFactory::sendEmail('Error during call cli', $e->getMessage() . print_r(debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 2)), array(
            EmailFactory::getDeveloperEmail(),
            EmailFactory::getDeveloperEmail('DS')
        ));
    }

    public static function callCronCli(string $action, ?array $params = null)
    {
        $params = json_encode($params ?? []);

        $action = preg_replace('/[A-Z]/', '-$0', $action);
        $action = mb_strtolower('cron' . $action);

        self::callCli($params, 'cron' . $action);
    }

    /**
     * @param string $fileName
     *
     * @return string
     */
    public static function getParam(string $fileName): string
    {
        $param = file_get_contents($fileName);

        unlink($fileName);

        return $param;
    }
}
