<?php

namespace Jolanda\Controller;

use Jolanda\Controls\Grid\Grid;
use PDO;
use Tracy\Debugger;
use Zend_Controller_Request_Abstract;
use Zend_Controller_Response_Abstract;

abstract class PresetController extends BaseController
{
    private $extendsController;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array(), string $module = 'admin', $extendsController = null)
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->extendsController = $extendsController;
    }

    public function __call($method, $args)
    {
        $this->extendsController->$method(...$args);
    }

    protected function getBaseParams(): array
    {
        if($this->extendsController)
            return $this->extendsController->getBaseParams();
        else
            return [];
    }

    public function saveAction(): void
    {
        $url = $this->_getParam('URL');
        $gridName = $this->_getParam('GridName');
        $userID = $this->_getParam('UserID');
        $presetName = $this->_getParam('PresetName');
        $data = $this->_getParam('Data');

        $sql = <<<SQL
SELECT * FROM `jolanda_preset`
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID AND PresetName = :presetName
SQL;

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'url' => $url,
            'gridName' => $gridName,
            'userID' => $userID,
            'presetName' => $presetName,
        ]);
        $exist = (bool) $smtp->fetchObject();

        if($exist){
$sql = <<<SQL
UPDATE `jolanda_preset` SET URL = :url, GridName = :gridName, Data = :data, User_ID = :userID, PresetName = :presetName
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID AND PresetName = :presetName
SQL;
        }else{
$sql = <<<SQL
INSERT INTO `jolanda_preset` (`URL`, `GridName`, `Data`, `User_ID`, `PresetName`) VALUES (:url, :gridName, :data, :userID, :presetName)
SQL;
        }

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'url' => $url,
            'gridName' => $gridName,
            'data' => $data,
            'userID' => $userID,
            'presetName' => $presetName,
        ]);

        echo 'ok';
    }

    public function renameAction(): void
    {
        $url = $this->_getParam('URL');
        $gridName = $this->_getParam('GridName');
        $userID = $this->_getParam('UserID');
        $oldPresetName = $this->_getParam('OldPresetName');
        $newPresetName = $this->_getParam('NewPresetName');


$sql = <<<SQL
UPDATE `jolanda_preset` SET PresetName = :newPresetName
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID AND PresetName = :oldPresetName
SQL;

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'newPresetName' => $newPresetName,
            'url' => $url,
            'gridName' => $gridName,
            'userID' => $userID,
            'oldPresetName' => $oldPresetName,
        ]);

        echo 'ok';
    }

    public function getAction(): void
    {
        $url = $this->_getParam('URL');
        $gridName = $this->_getParam('GridName');
        $userID = $this->_getParam('UserID');
        $presetName = $this->_getParam('PresetName');
        $all = $this->_getParam('All', false);

        if(!$all){
            $sql = <<<SQL
SELECT * FROM `jolanda_preset`
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID AND PresetName = :presetName
SQL;
            $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
            $smtp->execute([
                'url' => $url,
                'gridName' => $gridName,
                'userID' => $userID,
                'presetName' => $presetName,
            ]);
            $data = $smtp->fetchAll(PDO::FETCH_ASSOC);
        }else{
            $sql = <<<SQL
SELECT * FROM `jolanda_preset`
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID
SQL;

            $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
            $smtp->execute([
                'url' => $url,
                'gridName' => $gridName,
                'userID' => $userID,
            ]);
            $data = $smtp->fetchAll(PDO::FETCH_ASSOC);
        }

        if($data){
            echo json_encode($data);
        }else{
            echo '';
        }
    }

    public function deleteAction(): void
    {
        $url = $this->_getParam('URL');
        $gridName = $this->_getParam('GridName');
        $userID = $this->_getParam('UserID');
        $presetName = $this->_getParam('PresetName');

        $sql = <<<SQL
DELETE FROM `jolanda_preset`
WHERE URL = :url AND GridName = :gridName AND User_ID = :userID AND PresetName = :presetName
SQL;

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'url' => $url,
            'gridName' => $gridName,
            'userID' => $userID,
            'presetName' => $presetName,
        ]);

        echo 'ok';
    }

    public function initAction(): void
    {
        $sql = "SHOW TABLES LIKE 'jolanda_preset'";
        $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

        if(!$exist){
$sql = <<<SQL
CREATE TABLE `jolanda_preset` (
  `ID` int(11) NOT NULL,
  `URL` varchar(120) DEFAULT NULL,
  `GridName` varchar(120) DEFAULT NULL,
  `Data` text DEFAULT NULL,
  `User_ID` int(11) DEFAULT NULL,
  `PresetName` varchar(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `jolanda_preset`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `URL_GRIDNAME_USERID_PRESETNAME` (`URL`,`GridName`,`User_ID`,`PresetName`) USING BTREE;

ALTER TABLE `jolanda_preset`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

SQL;

            \Doctrine_Manager::connection()->getDbh()->exec($sql);
            $sql = "SHOW TABLES LIKE 'jolanda_preset'";
            $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

            if(!$exist){
                throw new \Exception('Table "jolanda_preset" can not be created');
            }
        }

        Debugger::dump($exist);
    }
}