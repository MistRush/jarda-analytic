<?php

namespace common\logic\Data;

abstract class CSVImport {

    private string $fileName;
    protected mixed $file;
    protected int $counter = 0;

    /**
     * @param string $fileName
     */
    public function __construct(string $fileName) {
        $this->fileName = $fileName;        
        $this->openFile();
    }

    public function readFile() {
        $file = $this->getFile();

        while (!feof($file)) {
            $rowExplode = fgets($file);
            $row = explode(';', trim($rowExplode));

            if (is_array($row) ) {
                $this->proccesRow($row);                
                $this->increaseCounter();
            }
        }
    }

    /**
     * @param array $row
     * @return mixed
     */
    abstract protected function proccesRow(array $row): mixed;

    protected function openFile() {
        $file = fopen($this->getFileName(), "r");       
        
        $this->file = $file;       
    }

    /**
     * @return string
     */
    protected function getFileName(): string {
        return $this->fileName;
    }

    /**
     * @return mixed
     */
    public function getFile(): mixed{
        return $this->file;
    }

    /**
     * @return int
     */
    public function getCounter(): int {
        return $this->counter;
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

    /**
     * @return int
     */
    protected function increaseCounter(): int {
        return $this->counter = $this->counter + 1;
    }
}