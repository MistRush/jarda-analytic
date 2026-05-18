<?php

class Common_ToolController extends Clevis_Zend_Controller_Action implements Clevis_Zend_Doctrine_Import_ImportListener {

    /**
     * Index action.
     */
    public function indexAction() {
        $this->disableLayout();
        echo '<h1>Tools:</h1>';
        echo '<h2>1) Doctrine:</h2>';
        echo '<ul>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'generate-models')) . '">Generate Models</a></li>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'migrate')) . '">Migrate</a></li>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'generate-migration')) . '">Generate Migration for Changes</a></li>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'generate-migration-empty')) . '">Generate Empty Migration</a></li>';
        echo '</ul>';
        echo '<h2>2) Dojo:</h2>';
        echo '<ul>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'clean-dojo-release')) . '">Clean Release</a></li>';
        echo '</ul>';
        echo '<h2>3) Database:</h2>';
        echo '<ul>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'import-data')) . '">Import data</a></li>';
        echo '<li><a href="' . Clevis_Helper::formatUrl(array('action' => 'export-data')) . '">Export data</a></li>';
        echo '</ul>';        
    }


    /**
     * Import data
     */
    public function importDataAction() {
        $this->disableLayout();        
        
        if (!array_key_exists('file', $_FILES)) {
            $this->disableLayout();
            echo '<html><head><title>Import data</title></head><body>';
            echo '<h1>Import data</h1>';
            echo '<form method="post" enctype="multipart/form-data">';
            echo '<input type="file" name="file" id="file"><br>';
            echo '<input type="submit" value="Submit">';
            echo '</form>';
            echo '</body></html>';
            return;
        }
        set_time_limit(300);

        try {
            $uploadedFile = $_FILES['file'];
            $timer = get_time_ms();
            Common_Logic_BackupManager::restoreBackup($uploadedFile['tmp_name'], $uploadedFile['name']);
            $timer = get_time_ms() - $timer;
            echo '<h1>Import byl úspěšně proveden za ' . round($timer / 1000, 2) . ' sekund!</h1>';
        } catch (Exception $exception) {
            dmp($exception);
            echo '<h1>Načtení zálohy se nezdařilo</h1>';
            echo '<p  style="color: red; font-weight: bold;">';
            echo $exception->getMessage();
            
            
            echo '</p>';
        }
    }
    
    
    /**
     * Export data
     */
    public function exportDataAction() {
        $this->disableLayout();
        set_time_limit(300);

        $includeFiles = $this->getRequest()->getParam('includefiles');

        try {
            $backupFileName = tempnam(sys_get_temp_dir(), 'kpo_data_') . '.zip';
            Common_Logic_BackupManager::createBackup($backupFileName, $includeFiles);
            $backupContent = file_get_contents($backupFileName);
            unlink($backupFileName);

            header('Cache-Control: public');
            header('Content-Description: File Transfer');
            header('Content-Disposition: attachment; filename=data_' . date('Ymd') . '.zip');
            header('Content-Type: application/x-sql');
            header('Content-Transfer-Encoding: binary');
            echo $backupContent;
        } catch (Exception $exception) {
            echo '<h1>Uložení zálohy se nezdařilo</h1>';
            echo '<p  style="color: red; font-weight: bold;">';
            echo $exception->getMessage();
            echo '</p>';
        }
    }
    
    
    /**
     * Get migration path.
     *
     * @return string
     */
    public static function getMigrationPath() {
        return APPLICATION_PATH . '/configs/migrations';
    }

    /**
     * Get schema path.
     *
     * @return string
     */
    public static function getSchemaPath() {
        return APPLICATION_PATH . '/configs/schema';
    }

    /**
     * Migrate
     */
    public function migrateAction() {
        $this->disableLayout();
        $this->printHeader('Migration');

        set_time_limit(300);

        try {
            $migration = new Doctrine_Migration($this->getMigrationPath());
            $version = $migration->migrate();

            $this->printLine('[Doctrine] Migrated to version #' . $version . '.', 'green');
        } catch (Exception $exception) {
            $this->printLine($exception->getMessage(), 'red');
        }
    }

    /**
     * Generate models
     */
    public function generateModelsAction() {
        $this->disableLayout();
        $this->printHeader('Models Generation');

        $this->buildCount = 0;
        $import = new Clevis_Zend_Doctrine_Import_Schema();
        $import->setListener($this);
        $import->importSchema($this->getSchemaPath(), 'yml');
    }

    private $buildCount;

    public function notifyRecordBuilt($className, $moduleName) {
        $this->printLine('[Doctrine] Generated record "' . $className . '".', 'green');
        $this->buildCount++;
    }

    public function notifyImportCompleted() {
        $this->printLine('[Doctrine] Successfully generated ' . $this->buildCount . ' record classes.', 'green');
    }

    /**
     * Generate migration for changes
     */
    public function generateMigrationAction() {
        $this->disableLayout();
        $this->printHeader('Generate migration class(es)');

        $migrationsPath = $this->getMigrationPath();
        $schemaPath = $this->getSchemaPath();
        $schemaPreviousPath = $schemaPath . '_previous';
        $migration = new Doctrine_Migration($migrationsPath);
        $numChanges = 0;

        // If generating first version
        if (!count($migration->getMigrationClasses())) {
            $frontController = Zend_Controller_Front::getInstance();
            $modelDirectories = array();
            foreach ($frontController->getControllerDirectory() as $directory) {
                $directory .= '/../models/';
                if (is_dir($directory)) {
                    $modelDirectories[] = $directory;
                }
            }
            $result = Doctrine_Core::generateMigrationsFromModels($migrationsPath, $modelDirectories);
            if ($result)
                $numChanges = 1;
            else
                throw new Exception('Can\'t generate first migration!');
        }
        // Else if generating next version
        else {
            $connections = array();
            foreach (Doctrine_Manager::getInstance() as $connection) {
                $connections[] = $connection->getName();
            }
            $changes = Doctrine_Core::generateMigrationsFromDiff($migrationsPath, $schemaPreviousPath, $schemaPath);
            $numChanges = 0;
            foreach ($changes as $item) {
                $numChanges += count($item);
            }
        }

        // Copy schema to previous
        $d = dir($schemaPath);
        while (FALSE !== ( $entry = $d->read() )) {
            if ($entry == '.' || $entry == '..') {
                continue;
            }
            $Entry = $schemaPath . '/' . $entry;
            if (is_dir($Entry)) {
                continue;
            }
            copy($Entry, $schemaPreviousPath . '/' . $entry);
        }
        $d->close();

        // Print result
        if ($numChanges > 0) {
            $this->printLine('Generated migration successfully (' . $numChanges . ' changes).', 'green');
        } else {
            $this->printLine('No need for migration, no changes made.', 'green');
        }
    }

    /**
     * Generate empty migration
     */
    public function generateMigrationEmptyAction() {
        $this->disableLayout();
        $this->printHeader('Generate empty migration class');

        $migrationPath = $this->getMigrationPath();
        $migration = new Doctrine_Migration($migrationPath);
        $migrationVersion = count($migration->getMigrationClasses()) + 1;
        Doctrine_Core::generateMigrationClass("version" . $migrationVersion, $migrationPath);

        $this->printLine('Generated migration successfully.', 'green');
    }

    /**
     * Remove all unnecessary files from public/clevis/release
     */
    public function cleanDojoReleaseAction() {
        $this->disableLayout();
        $result = Clevis_DojoReleaseCleaner::clean(APPLICATION_PATH . '/../public/clevis/release');

        self::printHeader('Keeping Files:');
        foreach ($result['keep-file'] as $fileName) {
            self::printLine('Kept file ' . $fileName, 'green');
        }
        self::printHeader('Deleting Files:');
        foreach ($result['delete-file'] as $fileName) {
            self::printLine('Deleted file ' . $fileName, 'red');
        }
        self::printHeader('Deleting Empty Folders:');
        foreach ($result['delete-folder'] as $fileName) {
            self::printLine('Deleted empty folder ' . $fileName, 'orange');
        }
    }

    /**
     * Print log header
     *
     * @param $header
     */
    private static function printHeader($header) {
        if (defined('INDEX_TOOL')) {
            echo strtoupper($header) . PHP_EOL;
        } else {
            echo '<h1>' . $header . '</h1>';
        }
    }

    /**
     * Print log line
     *
     * @param $header
     */
    private static function printLine($line, $color) {
        if (defined('INDEX_TOOL')) {
            echo $line . PHP_EOL;
        } else {
            echo '<span style="color: ' . $color . ';">' . $line . '</span><br>';
        }
    }

}
