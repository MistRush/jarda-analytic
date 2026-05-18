<?php

class Clevis_CustomClass {
    public function __construct($test) {
        if ($test < 10)
            throw new Clevis_CustomException('Jakyska chyba');
        else
            echo "ahoj";
    }
}
