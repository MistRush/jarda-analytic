<?php

namespace Jolanda\Traits;

trait InfoPhpTrait
{
    public function showPhpInfoAction(){
        if(!$this->allowShowPhpInfo()){
            echo 'Not allowed';
            die;
        }
        phpinfo();
    }

    abstract function allowShowPhpInfo(): bool;
}