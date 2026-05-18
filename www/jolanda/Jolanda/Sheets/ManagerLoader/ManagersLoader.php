<?php

namespace Jolanda\Sheets\ManagerLoader;

class ManagersLoader
{
    public array $managers = [];
    public array $excludedManagers = [];

    public static ?self $instance = null;

    public function __construct()
    {

    }

    public function loadManagers(){
        $files = $this->getFiles('../application/modules/admin/managers');

        foreach ($files as $file){
            $managerName = $this->getManagerFromFileName($file);
            $this->loadManager($managerName);
        }


    }

    public function getFiles($folderPath){
        $files = scandir($folderPath);
        $allFiles = [];

        foreach ($files as $file) {
            if (is_file($folderPath . '/' . $file)) {
                $allFiles[] = $file;
            }
        }

        return $allFiles;
    }

    public function getManagerFromFileName($fileName){
        $managerName = str_replace('.php', '', $fileName);
        $managerName = 'Admin_Manager_' . $managerName;

        return $managerName;
    }

    public function loadManager(string $managerName){
        if(in_array($managerName, $this->excludedManagers)){
            return false;
        }

        if(!isset($this->managers[$managerName])){
            $this->managers[$managerName] = new Manager(new $managerName());
        }

        return $this->managers[$managerName];
    }

    public function getManagersForModel(string $model){
        $managers = [];

        foreach ($this->managers as $manager){
            if($manager->manager->getModel() === $model){
                $managers[] = $manager;
            }
        }

        return $managers;
    }

    public function setExcludedManagers(array $excludedManagers){
        $this->excludedManagers = $excludedManagers;
    }

    public static function getInstance(): self {
        if(!self::$instance){
            self::$instance = new self();
        }

        return self::$instance;
    }

}