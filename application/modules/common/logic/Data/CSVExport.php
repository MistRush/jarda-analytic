<?php
namespace common\logic\Data;

class CSVExport {

    const DELIMITER = ';';
    const LINE_BREAKER = "\r\n";

    private string $fileName;
    private string $output = '';
    private array $header = [];
    protected array $data = [];

    /**
     * @param string|null $fileName
     * @param array $data
     * @param array $header
     */
    public function __construct(string $fileName = null, array $data = [], array $header = []) {
        $this->setFileName($fileName);

        if ($data) {
            if ( $header )
                $this->addRow($header);
            
            foreach ($data as $dataItem) {
                $this->addRow($dataItem);
            }
        } else {
            $this->proccesHeader();
            $this->prepareData();

            foreach ($this->getData() as $data) {
                $this->addRow($data);
            }
        }
    }

    protected function proccesHeader() {
        $this->defineHeader();

        $this->addRow($this->getHeader());
    }

    protected function defineHeader() {
    }

    protected function prepareData() {
    }

    /**
     * @param array $rowItem
     */
    protected function addRow(array $rowItem) {
        $this->addOutput(preg_replace( "/\r|\n/", " ", implode(self::DELIMITER, $rowItem) ) . self::LINE_BREAKER);
    }

    /**
     * @param string $fileName
     */
    public function setFileName(string $fileName) {
        $this->fileName = $fileName;
    }

    /**
     * @return string
     */
    public function getFileName(): string{
        return $this->fileName;
    }

    /**
     * @param $header
     */
    public function setHeader($header) {
        $this->header = $header;
    }

    /**
     * @return array
     */
    public function getHeader(): array {
        return $this->header;
    }

    /**
     * @param $data
     */
    public function setData($data) {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function getData(): array {
        return $this->data;
    }

    /**
     * @param string $output
     */
    private function addOutput(string $output) {
        $this->output .= $output;
    }

    /**
     * @return string
     */
    private function getOutput(): string{
        return $this->output;
    }

    public function performExport() {
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . $this->getFileName() . '-' . time() . '.csv');
        header('Content-Transfer-Encoding: binary');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Pragma: public');

        echo "\xEF\xBB\xBF";
        echo $this->getOutput();
    }

    public function writeToFile() {
        file_put_contents($this->getFileName() . '.csv', $this->getOutput());
    }

}