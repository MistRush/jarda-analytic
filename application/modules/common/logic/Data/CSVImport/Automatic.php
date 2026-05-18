<?php
namespace common\logic\Data\CSVImport;

use common\logic\Data\CSVImport;
use Doctrine_Manager as DoctrineManager;
use Exception;

class Automatic extends CSVImport {

    protected string $tableName;
    protected array $settings = [];

    /**
     * @param string $fileName
     * @param string $tableName
     * @param array $settings
     */
    public function __construct(string $fileName, string $tableName, array $settings) {
        parent::__construct($fileName);
        
        $this->tableName = $tableName;
        $this->settings = $settings;        
    }

    /**
     * @param array $row
     */
    protected function proccesRow(array $row) {
        $tableName = $this->getTableName();
                
        try {            
            $connection = DoctrineManager::connection();
            $connection->beginTransaction();            
            
            $parameters = array();
            $values = array();
            
            foreach ( $this->getSettings() as $key => $parameter) {
                $parameters[] = $parameter;
                
                $values[] = $row[$key] ? "'" . $row[$key] . "'" : 'NULL';
            }
            
            $connection->execute('INSERT INTO ' . $tableName . ' (' . implode(',', $parameters) . ') VALUES (' . implode(',', $values) . ')');
            $connection->commit(); 
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
            die();
        }
    }

    /**
     * @return array
     */
    public function getSettings(): array {
        return $this->settings;
    }

    /**
     * @return string
     */
    public function getTableName(): string {
        return $this->tableName;
    }
}