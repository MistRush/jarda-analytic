<?php

namespace Jolanda\Controller;

use Doctrine_Manager;
use Jolanda\Config\Config;
use PDO;
use Tracy\Debugger;
use Zend_Controller_Request_Abstract;
use Zend_Controller_Response_Abstract;

abstract class DocsController extends \Zend_Controller_Action
{
    protected string $docsTable = 'docs';
    protected string $jolandaDocsDatabaseName;
    protected string $jolandaDocsTable;
    protected string $SessionUserKey = 'app_user';

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array(), string $module = 'admin', $extendsController = null)
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->jolandaDocsDatabaseName = Config::jolandaDocsDatabase();
        $this->jolandaDocsTable = 'jolanda_docs';
    }

    private function getShowTableQuery(string $tableName, bool $isJolandaDocsTable) : string {
        return $isJolandaDocsTable ?
            "SHOW TABLES IN $this->jolandaDocsDatabaseName LIKE 'jolanda_docs'"
            :
            "SHOW TABLES LIKE '$tableName'";
    }

    private function createTableIfNotExists(string $tableName, bool $isJolandaDocsTable = false): void
    {
        $sql = $this->getShowTableQuery($tableName, $isJolandaDocsTable);

        $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

        if(!$exist){
            if($isJolandaDocsTable)
                $sql = "USE `$this->jolandaDocsDatabaseName`;";
            else $sql = '';

            $sql .= <<<SQL
                CREATE TABLE `$tableName` (
                  `id` int(11) UNSIGNED NOT NULL,
                  `parentdoc_id` int(11) UNSIGNED DEFAULT NULL,
                  `urlpattern` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                  `content` mediumtext CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                  `createdat` datetime DEFAULT current_timestamp(),
                  `createdby` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                  `updatedat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                  `updatedby` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        
        
                ALTER TABLE `$tableName`
                    ADD PRIMARY KEY (`id`);
        
                ALTER TABLE `$tableName`
                  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
                COMMIT;
        SQL;

            \Doctrine_Manager::connection()->getDbh()->exec($sql);
            $sql = $this->getShowTableQuery($tableName, $isJolandaDocsTable);
            $exist = (bool) \Doctrine_Manager::connection()->getDbh()->query($sql)->fetchObject();

            if(!$exist){
                throw new \Exception('Table "' . $tableName . '" can not be created');
            }
        }

        Debugger::dump($exist);
    }

    public function initAction(): void
    {
        echo 'docs table present:';
        $this->createTableIfNotExists('docs');
        echo 'jolanda_docs table present:';
        $this->createTableIfNotExists($this->jolandaDocsTable, true);
        die('ok');
    }


    protected function checkIfUserIsAdmin() : bool {
        return (isset($_SESSION[$this->SessionUserKey]) && in_array($_SESSION[$this->SessionUserKey]['Type'], ['admin', 'superadmin']));
    }

    public function getPageAction(): void
    {
        $pageID = $this->getRequest()->getParam('id');
        $route = $this->getRequest()->getParam('route');
        $isJolanda = $this->getParam('isJolanda');
        $docsTable = $isJolanda ? $this->jolandaDocsDatabaseName . '.' . $this->jolandaDocsTable : $this->docsTable;


        $sql = "SELECT * FROM {$docsTable}";
        $params = [];

        if (!empty($pageID)) {
            $sql .= " WHERE id = ?";
            $params[] = $pageID;
        } else if (!empty($route)) {
            $sql .= " WHERE urlpattern = ?";
            $params[] = $route;
        }

        $connection = Doctrine_Manager::connection();
        $statement = $connection->getDbh()->prepare($sql);
        $statement->execute($params);

        $result = $statement->fetch(PDO::FETCH_ASSOC);


        // Send response as JSON
        echo json_encode($result);
        die();
    }

    private function getPages() {
        $searchTerm = $this->getParam('searchTerm') ?? '';
        $isJolanda = $this->getParam('isJolanda');
        $docsTable = $isJolanda ? $this->jolandaDocsDatabaseName . '.' . $this->jolandaDocsTable : $this->docsTable;



        // TODO Normalize tags and implement a select option into the docs edit form
        $sql = "SELECT
            id,
            parentdoc_id,
            title,
            tags
            FROM {$docsTable}
            WHERE (
                :searchTerm = ''
                OR title LIKE :likeTerm
                OR tags LIKE :likeTerm
                )
                ";

        $connection = Doctrine_Manager::connection();
        $statement = $connection->getDbh()->prepare($sql);
        $likeSearch = "%{$searchTerm}%";

        $statement->bindParam(':searchTerm', $searchTerm);
        $statement->bindParam(':likeTerm', $likeSearch);
        $statement->execute();

        return $statement;
    }

    /**
     * @throws Doctrine_Manager_Exception
     */
    public function getPageListAction(): void
    {
        $statement = $this->getPages();
        die(json_encode($statement->fetchAll(PDO::FETCH_ASSOC)));
    }

    public function getPageListForSelectAction(): void
    {
        $results = $this->getPages()->fetchAll(PDO::FETCH_ASSOC);
        die(json_encode(
            [
                'identifier' => "ID",
                'items' => $results,
                'numRows' => count($results)
            ]
        ));

    }

    public function updatePageAction()
    {
        if(!$this->checkIfUserIsAdmin()) {
            $this->getResponse()->setHttpResponseCode(403);
            return die(json_encode(['success' => false, 'message' => 'Access denied - ' . json_encode($_SESSION)]));
        }

        $data = json_decode($this->getParam('data'), true);

        $docsTable = $data['isJolanda'] ? $this->jolandaDocsDatabaseName . '.' . $this->jolandaDocsTable : $this->docsTable;

        $sql = "REPLACE INTO {$docsTable} 
                    (id, parentdoc_id, urlpattern, title, content, tags, createdby, updatedby) 
                VALUES 
                    (:id, :parentdoc_id, :urlpattern, :title, :content, :tags, :createdby, :updatedby)";


        $currentUser = $_SESSION[$this->SessionUserKey]['Name'];

        // If ID is not provided or empty, set it to null for auto-increment
        $id = !empty($data['id']) ? $data['id'] : null;
        $isNewRecord = ($id === null);

        $params = [
            ':id' => $id,
            ':parentdoc_id' => isset($data['parentdoc_id']) && $data['parentdoc_id'] !== '' ? $data['parentdoc_id'] : null,
            ':urlpattern' => $data['urlpattern'] ?? null,
            ':title' => $data['title'] ?? null,
            ':content' => $data['content'] ?? null,
            ':tags' => $data['tags'] ?? null,
            // Set createdby only if it's a new record (or if REPLACE acts like INSERT)
            ':createdby' => $isNewRecord ? $currentUser : ($data['createdby'] ?? $currentUser), // Keep existing createdby if replacing?
            ':updatedby' => $currentUser, // Always update updatedby
        ];

        $connection = Doctrine_Manager::connection()->getDbh();
        try {
            $statement = $connection->prepare($sql);
            $success = $statement->execute($params);

            if ($success) {
                $finalId = $isNewRecord ? $connection->lastInsertId() : $id;
                return die(json_encode(['success' => true, 'id' => $finalId, 'message' => 'Page saved successfully.']));
            } else {
                return die(json_encode(['success' => false, 'message' => 'Failed to save page.', 'errorInfo' => $statement->errorInfo()]));
            }
        } catch (\PDOException $e) {
            return die(json_encode(['success' => false, 'message' => 'An error occurred while saving the page.', 'error' => $e->getMessage()]));
        }
    }

    public function deletePageAction() {
        if(!$this->checkIfUserIsAdmin()) {
            $this->getResponse()->setHttpResponseCode(403);
            return die(json_encode(['success' => false, 'message' => 'Access denied.']));
        }

        $id = $this->getRequest()->getParam('page_id');
        $isJolanda = $this->getParam('isJolanda');
        $docsTable = ($isJolanda == 'true') ? $this->jolandaDocsDatabaseName . '.' . $this->jolandaDocsTable : $this->docsTable;

        $sql = "DELETE FROM {$docsTable} WHERE id = ?";

        Doctrine_Manager::connection()->execute($sql, [$id]);

        return die(json_encode(['success' => true, 'id' => $id, 'message' => 'Page deleted successfully.']));
    }
}