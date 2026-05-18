<?php

namespace Jolanda\Controller;

use Tracy\Debugger;
use PDO;

trait MenuController
{
    public function saveFavoritesAction(): void
    {
        $items = $this->_getParam('Items');
        $userID = $this->_getParam('UserID');

        $sql = <<<SQL
SELECT * FROM `jolanda_menu_favorites`
WHERE User_ID = :userID
SQL;

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'userID' => $userID,
        ]);
        $exist = (bool) $smtp->fetchObject();

        if($exist){
            $sql = <<<SQL
UPDATE `jolanda_menu_favorites` SET Items = :items, User_ID = :userID
WHERE User_ID = :userID
SQL;
        }else{
            $sql = <<<SQL
INSERT INTO `jolanda_menu_favorites` (`Items`, `User_ID`) VALUES (:items, :userID)
SQL;
        }

        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'items' => $items,
            'userID' => $userID,
        ]);

        echo 'ok';
    }

    public function getFavoritesAction(): void
    {
        $userID = $this->_getParam('UserID');

        $data = static::getFavorites($userID);

        if($data){
            echo json_encode($data);
        }else{
            echo json_encode(null);
        }
    }

    public function initFavoritesAction(): void
    {
        $sql = "SHOW TABLES LIKE 'jolanda_menu_favorites'";
        $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

        if(!$exist){
            $sql = <<<SQL
CREATE TABLE `jolanda_menu_favorites` (
  `ID` int(11) NOT NULL,
  `Items` text DEFAULT NULL,
  `User_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `jolanda_menu_favorites`
  ADD PRIMARY KEY (`ID`);

ALTER TABLE `jolanda_menu_favorites`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

SQL;

            \Doctrine_Manager::connection()->getDbh()->exec($sql);
            $sql = "SHOW TABLES LIKE 'jolanda_menu_favorites'";
            $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

            if(!$exist){
                throw new \Exception('Table "jolanda_menu_favorites" can not be created');
            }
        }

        Debugger::dump($exist);
    }

    public static function getFavorites($userID): ?array{
        $sql = <<<SQL
SELECT * FROM `jolanda_menu_favorites`
WHERE User_ID = :userID
SQL;
        $smtp = \Doctrine_Manager::connection()->getDbh()->prepare($sql);
        $smtp->execute([
            'userID' => $userID,
        ]);

        $data = $smtp->fetch(PDO::FETCH_ASSOC);

        if($data){
            return $data;
        }else{
            return null;
        }
    }
}