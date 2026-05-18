<?php

namespace Jolanda\Controls\Import;

use Exception;
use Jolanda\Controls\Form\Form;
use Jolanda\Controls\Grid\Grid;
use Jolanda\Controls\Import\Exceptions\FileException;
use Jolanda\Controls\Import\Exceptions\ImportException;
use Jolanda\Latte\Latte;
use Jolanda\Translations\Lang;
use Nette\Utils\Html;
use stdClass;
use Throwable;
use Zend_File_Transfer_Adapter_Http;

/**
 * Class Import
 *
 * @package Jolanda\Controls\Import
 */
class Import
{

    const AVAILABLE_FUNCTIONS = ["getFiles", "getFileCount", "generateDataTable", "downloadFile", "deleteFile", "importFile", "downloadOutputFile", "addTemplate", "removeTemplate", "getTemplate", "getPreviewData"];

    const PREVIEW_LIMIT = 10;

    const IMPORT_FOLDER = '../data/importer';

    /** @var string $uid */
    private string $uid;

    /** @var string $class */
    private string $class;

    /** @var string $type */
    private string $type;

    /** @var string|null $selected */
    private string|null $selected = null;

    /** @var string $folder */
    private string $folder;

    /** @var Grid $fileGrid */
    private Grid $fileGrid;

    /** @var ImportColumn[] $columns */
    private array $columns;

    /** @var Form $form */
    private Form $form;

    /** @var string[] $allowedExtensions */
    private array $allowedExtensions;

    /** @var array|null $selectedColumns */
    private array|null $selectedColumns;

    /** @var string|null $importClass */
    private string|null $importClass;

    /** @var ImportFile|null $file */
    private ImportFile|null $file;

    /** @var int $chunkOffset */
    private int $chunkOffset;

    /** @var int $row */
    private int $row;

    /** @var bool $hasOutput */
    private bool $hasOutput;

    /** @var bool $hasHeader */
    private bool $hasHeader;

    /** @var array $formAttributes */
    private array $formAttributes;

    /** @var int $previewOffset */
    private int $previewOffset;

    /** @var bool $returnBlob */
    private bool $returnBlob;
    /** @var ?string $handleUrl */
    private ?string $handleUrl;

    /**
     * @param string $type
     * @param string $folder
     * @throws Exception
     */
    public function __construct(string $type, string $folder = self::IMPORT_FOLDER)
    {
        $this->uid = uniqid();
        $this->class = str_replace(__NAMESPACE__ . '\\', '', __CLASS__);
        $this->columns = [];
        $this->allowedExtensions = ['csv', 'xls', 'xlsx'];
        $this->importClass = null;
        $this->file = null;
        $this->chunkOffset = 1;
        $this->row = 1;
        $this->hasOutput = false;
        $this->hasHeader = false;
        $this->returnBlob = false;
        $this->handleUrl = null;

        $this->setType($type);
        $this->setFolder($folder);
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $this->setupFileGrid();
        $this->setupForm();

        $this->handleRequest();
    }

    /**
     * @param string $type
     * @return void
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * @param string $handleUrl
     * @return void
     */
    public function setHandleURL(string $handleUrl): void
    {
        $this->handleUrl = $handleUrl;
    }

    /**
     * @param string|null $selected
     * @return void
     */
    public function setSelected(?string $selected = null): void
    {
        $this->selected = $selected;
    }

    /**
     * @param string $folder
     * @return void
     */
    public function setFolder(string $folder): void
    {
        $this->folder = $folder;
    }

    /**
     * @return string
     */
    public function getUID(): string
    {
        return $this->uid;
    }

    /**
     * @return string
     */
    public function getClass(): string
    {
        return $this->class;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @return ?string
     */
    public function getHandleURL(): ?string
    {
        return $this->handleUrl;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->type;
    }

    /**
     * @return string|null
     */
    public function getSelected(): ?string
    {
        return $this->selected;
    }

    /**
     * @return string
     */
    public function getFolder(): string
    {
        return $this->folder;
    }

    /**
     * Render gridu do HTML
     *
     * @return Html|string
     * @throws Exception
     */
    public function render(): Html|string
    {
        $latte = Latte::getInstance()->getEngine();

        $class = strtolower($this->getClass());

        $html = new Html();
        $html->setHtml($latte->renderToString(__DIR__ . "/latte/$class.latte", ["import" => $this]));

        return $html;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return "import_{$this->getUID()}";
    }

    /**
     * @return void
     * @throws Exception
     */
    public function setupFileGrid(): void
    {
        $trans = Lang::getInstance();

        $this->fileGrid = new Grid("import_{$this->getType()}", $trans->translate("FILE_HISTORY") . ": {$this->getName()}");
        $this->fileGrid->setId("import_{$this->getUID()}");
        $this->fileGrid->setAjax(false);
        $this->fileGrid->setData([]);
        $this->fileGrid->setDataSaveType(Grid::SAVE_DATA_LOCAL);
        $this->fileGrid->enableControls();
        $this->fileGrid->disableRefresh();
        $this->fileGrid->setInfiniteScroll(false);
        $this->fileGrid->setHeight('250px');
        $this->fileGrid->setOrder('createdDate', 'DESC');

        $this->fileGrid->addColumn(COLUMN_TEXT, 'fileName', $trans->translate("FILE"), 220);
        $this->fileGrid->addColumn(COLUMN_NUMBER, 'fileSize', $trans->translate("SIZE"), 30)
            ->setFormatFunction("{$this}_formatSize");
        $this->fileGrid->addColumn(COLUMN_TEXT, 'createdDate', $trans->translate("DATE_CREATE"), 100);
        $this->fileGrid->addColumn(COLUMN_TEXT, 'modifiedDate', $trans->translate("DATE_MODIFIED"), 100);

        $downloadAction = $this->fileGrid->addAction('refresh', '', "import_{$this->getUID()}.refreshFiles()", [true, false, false]);
        $downloadAction->getHeaderButton()->setAttribute('class', 'btn btn-icon');
        $downloadAction->setIcon('refresh m-0');
        $downloadAction->setHelp($trans->translate('REFRESH'));

        $downloadAction = $this->fileGrid->addAction('download', $trans->translate('DOWNLOAD'), "import_{$this->getUID()}.downloadFile()", [false, true, true]);
        $downloadAction->getRowButton()->setAttribute('class', 'btn btn-icon');
        $downloadAction->setIcon('download');
        $downloadAction->setHelp($trans->translate('DOWNLOAD'));

        $deleteAction = $this->fileGrid->addAction('delete', $trans->translate('REMOVE'), "import_{$this->getUID()}.deleteFile()", [false, true, true]);
        $deleteAction->getRowButton()->setAttribute('class', 'btn btn-icon btn-icon--red');
        $deleteAction->setIcon('trash');
        $deleteAction->setHelp($trans->translate('REMOVE'));
    }

    /**
     * @return void
     */
    public function handleUpload(): void
    {
        $transfer = new Zend_File_Transfer_Adapter_Http();

        $fileInfo = $transfer->getFileInfo();

        if (!isset($fileInfo['file'])) {
            httpResponseCode(404);
            exit;
        }

        $fileInfoName = pathinfo($fileInfo['file']['name'], PATHINFO_FILENAME);
        $fileInfoExtension = pathinfo($fileInfo['file']['name'], PATHINFO_EXTENSION);
        $filename = uniqid("{$fileInfoName}_") . ".$fileInfoExtension";
        $folder = "$this->folder/$this->type";

        if (!file_exists($folder)) {
            mkdir($folder);
            chmod($folder, 0777);
        }

        move_uploaded_file($fileInfo['file']['tmp_name'], "$folder/$filename");

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['filename' => $filename]);

        exit;
    }

    /**
     * @return void
     * @throws Exception
     */
    public function handleRequest(): void
    {
        if ('xmlhttprequest' != strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''))
            return;

        $data = json_decode(file_get_contents('php://input'), false);

        if ($data) {
            if (in_array($data->function ?? null, self::AVAILABLE_FUNCTIONS)) {
                $fn = $data->function;
                unset($data->function);
                $this->setSelected($data->fileName ?? null);
                $this->handleFunction($fn, $data);
            } else {
                throw new Exception("Function \"$data->function\" is not supported");
            }
        } else {
            $this->handleUpload();
        }
    }

    /**
     * @param string|null $functionName
     * @param $args
     * @return void
     * @throws Exception
     */
    private function handleFunction(?string $functionName, $args): void
    {
        if (!method_exists($this, $functionName))
            throw new Exception("Function \"$functionName\" is not implemented");

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($this->$functionName($args));
        exit;
    }

    /**
     * @return array
     */
    public function getFiles(): array
    {
        if (file_exists("$this->folder/$this->type/")) {
            $files = [];
            foreach (glob("$this->folder/$this->type/*", GLOB_BRACE) as $fileName) {
                if (!$this->isAllowedExtension($fileName))
                    continue;
                $files[] = ImportFile::createFromFile($fileName);
            }

            /** @var ImportFile $fileA */
            usort($files, function ($fileA, $fileB) {
                return strtotime($fileB->getCreatedDate()) - strtotime($fileA->getCreatedDate());
            });

            return $files;
        } else
            return [];
    }

    /**
     * @return int
     */
    public function getFileCount(): int
    {
        return count($this->getFiles());
    }

    /**
     * @return Grid
     */
    public function getFileGrid(): Grid
    {
        return $this->fileGrid;
    }

    /**
     * @return string
     * @throws FileException
     */
    public function generateDataTable(): string
    {
        $latte = Latte::getInstance()->getEngine();
        $class = strtolower($this->getClass());

        $rows = $this->getPreview();

        $html = new Html();
        $html->setHtml($latte->renderToString(__DIR__ . "/latte/$class-data.latte", [
            'import' => $this,
            'rows' => $rows,
            'firstRow' => $rows[0] ?? null,
        ]));

        return $html->render();
    }

    /**
     * @param string $name ID sloupce
     * @param string $title Název sloupce
     * @param string|null $matchName Spojit s názvem v hlavičce
     * @param bool $important Požadované
     * @param string|null $description Popis sloupce
     * @return ImportColumn
     */
    public function addColumn(string $name, string $title, ?string $matchName = null, bool $important = false, ?string $description = null): ImportColumn
    {
        return $this->columns[] = new ImportColumn($name, $title, $matchName, $important, $description);
    }

    /**
     * Vrátí array sloupců pro Select2
     * @param bool $asJson
     * @return array|string
     */
    public function getColumns(bool $asJson = false): array|string
    {
        $arr = array_map(function ($val) {
            return $val->toArray();
        }, $this->columns);

        return $asJson ? json_encode($arr) : $arr;
    }

    /**
     * @param string|null $col
     * @return string|null
     */
    public function getSelectedColumn(?string $col = null): ?string
    {
        if ($col === null)
            return null;


        foreach ($this->columns as $column) {
            if ($column->getMatchName() == $col) {
                return $column->getName();
            }
        }

        return null;
    }

    /**
     * @return string|false|null
     */
    public function getSelectedFile(): string|null|false
    {
        if (!$this->getSelected())
            return null;

        $rp = realpath("{$this->getFolder()}/{$this->getType()}/{$this->getSelected()}");

        if (!file_exists($rp))
            return null;

        return $rp;
    }

    /**
     * @param int|null $limit
     * @param int|null $offset
     * @return array|null|false
     * @throws Exceptions\FileException
     */
    public function getData(int|null $limit = null, int|null $offset = null): array|null|false
    {
        $this->openFile();

        $data = $this->file?->loadRows($limit ?? 0, $offset ?? 0);

        $this->closeFile();

        return $data;
    }

    /**
     * @param int $size
     * @return array|null
     * @throws Exceptions\FileException
     */
    public function getChunk(int $size = 0): array|null
    {
        $this->openFile();

        $data = $this->file?->loadRows($size, $this->chunkOffset);
        $this->chunkOffset += count($data ?? []);

        return $data;
    }

    /**
     * @return ImportFile|false|null
     * @throws Exceptions\FileException
     */
    public function openFile(): ImportFile|false|null
    {
        if (!$this->file) {
            if (!$selected = $this->getSelectedFile()) {
                return null;
            }

            $this->file = ImportFile::createFromFile($selected);

            if (!$this->isAllowedExtension($this->file->getFileName()))
                return false;

            $this->file->open();
            $this->chunkOffset = 0;
        }

        return $this->file;
    }

    /**
     * @return static
     */
    public function closeFile(): static
    {
        $this->file?->close();

        return $this;
    }

    /**
     * @return array|false|null
     * @throws Exceptions\FileException
     */
    public function getPreview(): array|null|false
    {
        return $this->getData(self::PREVIEW_LIMIT, $this->previewOffset ?? 0);
    }

    /**
     * Returns preview data for use in Vue importer
     *
     * status:
     *  - ok            => rows available (may be empty)
     *  - not_accepted  => file exists but extension/format not accepted
     *  - not_found     => selected file not found on disk
     *  - empty         => no rows in file
     *
     * @return array
     * @throws Exceptions\FileException
     */
    public function getPreviewData(): array
    {
        $rows = $this->getPreview();
        $status = 'ok';

        if ($rows === false) {
            $status = 'not_accepted';
            $rows = [];
        } elseif ($rows === null) {
            $status = 'not_found';
            $rows = [];
        } elseif (!is_array($rows) || count($rows) === 0) {
            $status = 'empty';
            $rows = [];
        }

        return [
            'status' => $status,
            'rows' => $rows,
        ];
    }

    /**
     * @return void
     * @throws Exception
     */
    public function setupForm(): void
    {
        $trans = Lang::getInstance();

        $this->form = new Form();
        $this->form->setId("import_{$this->getUID()}_form");
//        $this->form->addFormGroup()->addHidden('Columns');
        $group = $this->form->addFormGroup();
        $group->addBoolRadioButton('HasHeader', $trans->translate('CONTAINS_HEADER'))->setValue(true);
    }

    /**
     * @return Form
     */
    public function getForm(): Form
    {
        return $this->form;
    }

    /**
     * @return array
     */
    public function getAllowedExtensions(): array
    {
        return $this->allowedExtensions;
    }

    /**
     * @param array|null $allowedExtensions
     * @return static
     */
    public function setAllowedExtensions(array|null $allowedExtensions = null): static
    {
        $this->allowedExtensions = $allowedExtensions ?? [];

        return $this;
    }

    /**
     * @param string $allowedExtension
     * @return static
     */
    public function addAllowedExtension(string $allowedExtension): static
    {
        $this->allowedExtensions[] = $allowedExtension;

        return $this;
    }

    /**
     * @return bool
     */
    public function hasAllowedExtensions(): bool
    {
        return count($this->getAllowedExtensions()) > 0;
    }

    /**
     * @param string $fileName
     * @return bool
     */
    public function isAllowedExtension(string $fileName): bool
    {
        return !$this->hasAllowedExtensions() || preg_match("/\.(" . implode('|', $this->getAllowedExtensions()) . ")$/i", $fileName);
    }

    /**
     * @param string|null $fileName
     * @param bool $output
     * @return string|null
     */
    private function getFile(?string $fileName, bool $output = false): string|null
    {
        if ($output) {
            $fullFileName = "$this->folder/$this->type/output/$fileName";
        } else {
            $fullFileName = "$this->folder/$this->type/$fileName";
        }
        return (!empty($fileName) && file_exists($fullFileName) && is_writable($fullFileName)) ? $fullFileName : null;
    }

    /**
     * @param stdClass|null $args
     * @return void
     */
    public function downloadFile(stdClass $args = null): void
    {
        if ($fileName = $this->getFile($args->fileName ?? null)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($fileName) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($fileName));
            readfile($fileName);
        } else {
            httpResponseCode(404);
        }

        exit;
    }

    /**
     * @param stdClass|null $args
     * @return void
     */
    public function deleteFile(stdClass $args = null): void
    {
        if ($fileName = $this->getFile($args->fileName ?? null)) {
            unlink($fileName);
            die(json_encode(['fileName' => $fileName]));
        } else {
            httpResponseCode(404);
        }

        exit;
    }

    /**
     * Vrácí akceptované soubory
     * @return string
     */
    public function getInputAccept(): string
    {
        if ($allowed = $this->getAllowedExtensions())
            return '.' . implode(',.', $allowed);
        else
            return '';
    }

    /**
     * Vrácí zvolené sloupce
     * @return array|null
     */
    public function getSelectedColumns(): ?array
    {
        return $this->selectedColumns;
    }

    /**
     * @param array|null $selectedColumns
     * @return static
     */
    public function setSelectedColumns(?array $selectedColumns): static
    {
        $this->selectedColumns = $selectedColumns;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImportClass(): ?string
    {
        return $this->importClass;
    }

    /**
     * @param string|null $importClass
     * @return static
     */
    public function setImportClass(?string $importClass): static
    {
        $this->importClass = $importClass;

        return $this;
    }

    /**
     * Naimportuje soubor
     * @param stdClass $data
     * @return void
     */
    public function importFile(stdClass $data): void
    {
        $trans = Lang::getInstance();

        try {
            $this->setSelectedColumns((array)$data->columns ?? null);
            $this->openFile();
            $this->setHasHeader($data->form->HasHeader);
            $this->setFormAttributes(get_object_vars($data->form));
            $this->setChunkOffset($this->getHasHeader() ? 2 : 1);
            $this->setRow($this->getHasHeader() ? 2 : 1);
            $outputFileName = null;

            $message = "";

            if ($this->importClass && class_exists($this->importClass)) {
                $cls = new $this->importClass($this, $data);
                if ($cls instanceof ImportBase) {
                    $cls->import($message);
                    if ($this->hasOutput()) {
                        $outputFileName = $cls->saveOutput();
                    }
                }
            } else {
                throw new ImportException('Import class is not defined');
            }

            echo json_encode([
                'error' => false,
                'msg' => $message,
                'outputFile' => $outputFileName,
                'debug' => null, 'trace' => null,
            ]);
        } catch (ImportException $ex) {
            echo json_encode([
                'error' => true,
                'msg' => $ex->getMessage(),
                'outputFile' => null,
                'debug' => $ex->getMessage(),
                'trace' => isDevelopment() ? $ex->getTrace() : null,
            ]);
        } catch (Throwable $ex) {
            echo json_encode([
                'error' => true,
                'msg' => $trans->translate("IMPORT_ERROR"),
                'outputFile' => null,
                'debug' => isDevelopment() ? $ex->getMessage() : null,
                'trace' => isDevelopment() ? $ex->getTrace() : null,
            ]);
        }

        exit;
    }

    /**
     * @param string $column
     * @return int|null
     */
    public function getColumn(string $column): int|null
    {
        $ind = array_search($column, $this->getSelectedColumns());
        if ($ind !== false) {
            return $ind;
        }

        return null;
    }

    /**
     * @return bool
     */
    public function hasOutput(): bool
    {
        return $this->hasOutput;
    }

    /**
     * @param bool $hasOutput
     * @return static
     */
    public function enableOutput(bool $hasOutput = true): static
    {
        $this->hasOutput = $hasOutput;

        return $this;
    }

    /**
     * @return string|null
     */
    public function generateOuputFileName(): string|null
    {
        if (!$selected = $this->getSelectedFile())
            return null;

        $dir = pathinfo($selected, PATHINFO_DIRNAME);
        $o_dir = "$dir/output/";
        $file = pathinfo($selected, PATHINFO_FILENAME) . uniqid('_') . '.' . pathinfo($selected, PATHINFO_EXTENSION);

        if (!file_exists($dir))
            return null;

        if (!file_exists($o_dir)) {
            mkdir($o_dir);
            chmod($o_dir, 0777);
        }

        if (!file_exists($o_dir)) {
            return null;
        }

        return "$o_dir$file";
    }

    /**
     * @param stdClass|null $args
     * @return void
     */
    public function downloadOutputFile(stdClass $args = null): void
    {
        if ($fileName = $this->getFile($args->fileName ?? null, true)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($fileName) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Content-Transform-Encoding: binary');
            header('Pragma: public');
            header('Content-Length: ' . filesize($fileName));

            $handle = fopen($fileName, 'rb');
            while (!feof($handle)) {
                echo fread($handle, 8192);
                ob_flush();
                flush();
            }

            fclose($handle);
        } else {
            httpResponseCode(404);
        }

        exit;
    }

    /**
     * @return ImportFile|null
     */
    public function getImportFile(): ?ImportFile
    {
        return $this->file;
    }

    /**
     * @param int $row
     * @return static
     */
    public function setRow(int $row): static
    {
        $this->row = $row;
        return $this;
    }

    /**
     * @return int
     */
    public function getRow(): int
    {
        return $this->row;
    }

    /**
     * @return bool
     */
    public function getHasHeader(): bool
    {
        return $this->hasHeader;
    }

    /**
     * @param bool $hasHeader
     * @return static
     */
    public function setHasHeader(bool $hasHeader): static
    {
        $this->hasHeader = $hasHeader;

        return $this;
    }

    /**
     * @return array
     */
    public function getFormAttributes(): array
    {
        return $this->formAttributes;
    }

    /**
     * @param array $form
     * @return static
     */
    public function setFormAttributes(array $form): static
    {
        foreach ($form as $attr => $value)
            $this->formAttributes[$attr] = $value;

        return $this;
    }

    /**
     * @return int
     */
    public function getChunkOffset(): int
    {
        return $this->chunkOffset;
    }

    /**
     * @param int $chunkOffset
     * @return static
     */
    public function setChunkOffset(int $chunkOffset): static
    {
        $this->chunkOffset = $chunkOffset;
        return $this;
    }

    /**
     * @return static
     */
    public function increaseRow(): static
    {
        $this->row++;

        return $this;
    }

    /**
     * @return int
     */
    public function getPreviewOffset(): int
    {
        return $this->previewOffset;
    }

    /**
     * @param int $previewOffset
     * @return static
     */
    public function setPreviewOffset(int $previewOffset): static
    {
        $this->previewOffset = $previewOffset;
        return $this;
    }

    /**
     * @return bool
     */
    public function getReturnBlob(): bool
    {
        return $this->returnBlob;
    }

    /**
     * @param bool $returnBlob
     * @return static
     */
    public function setReturnBlob(bool $returnBlob): static
    {
        $this->returnBlob = $returnBlob;
        return $this;
    }

    public function getVueProps(): array
    {
        return [
            'type' => $this->getType(),
            'handleUrl' => $this->getHandleURL() ?? ($_SERVER['REQUEST_URI'] ?? ''),
            'columns' => $this->getColumns(),
            'hasOutput' => $this->hasOutput(),
            'returnBlob' => $this->getReturnBlob(),
            'hasHeaderDefault' => $this->getHasHeader(),
            'initialSelectedFile' => $this->getSelected(),
        ];
    }
}