<?php

namespace Jolanda\Controls\Import;

use Jolanda\Controls\Import\Exceptions\FileException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

/**
 * Class ImportFile
 *
 * @package Jolanda\Controls\Import
 */
class ImportFile
{
    /** @var Spreadsheet|null $file */
    private Spreadsheet|null $file;

    /** @var string $type */
    public string $type;

    /** @var string $fileName */
    public string $fileName;

    /** @var string|null $createdDate */
    public string|null $createdDate;

    /** @var string|null $modifiedDate */
    public string|null $modifiedDate;

    /** @var int $fileSize */
    public int $fileSize;

    /** @var string|null $filePath */
    private string|null $filePath;

    /** @var string $separator */
    private string $separator;

    /**
     * @param string $type
     * @param string $fileName
     * @param string|null $date
     * @param int $fileSize
     * @param string|null $filePath
     * @param string $separator
     */
    public function __construct(string $type, string $fileName, ?string $date = null, int $fileSize = 0, ?string $filePath = null, string $separator = ";")
    {
        $this->file = null;

        if (!$date) {
            $date = date('Y-m-d H:i:s');
        }

        $this->type = $type;
        $this->fileName = $fileName;
        $this->createdDate = $date;
        $this->modifiedDate = $date;
        $this->fileSize = $fileSize;
        $this->filePath = $filePath;
        $this->separator = $separator;
    }

    /**
     * @param string $file
     * @return static
     */
    public static function createFromFile(string $file): self
    {
        $importFile = new self(
            pathinfo($file, PATHINFO_EXTENSION),
            pathinfo($file, PATHINFO_BASENAME),
        );

        $importFile->setCreatedDate(date('Y-m-d H:i:s', filectime($file)));
        $importFile->setModifiedDate(date('Y-m-d H:i:s', filemtime($file)));
        $importFile->setFileSize(filesize($file));
        $importFile->setFilePath(realpath($file));

        return $importFile;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @return string
     */
    public function getFileName(): string
    {
        return $this->fileName;
    }

    /**
     * @return string
     */
    public function getCreatedDate(): string
    {
        return $this->createdDate;
    }

    /**
     * @return string
     */
    public function getModifiedDate(): string
    {
        return $this->modifiedDate;
    }

    /**
     * @return int
     */
    public function getFileSize(): int
    {
        return $this->fileSize;
    }

    /**
     * @param string $type
     * @return self
     */
    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    /**
     * @param string $fileName
     * @return self
     */
    public function setFileName(string $fileName): self
    {
        $this->fileName = $fileName;
        return $this;
    }

    /**
     * @param string $createdDate
     * @return self
     */
    public function setCreatedDate(string $createdDate): self
    {
        $this->createdDate = $createdDate;
        return $this;
    }

    /**
     * @param string $modifiedDate
     * @return self
     */
    public function setModifiedDate(string $modifiedDate): self
    {
        $this->modifiedDate = $modifiedDate;
        return $this;
    }

    /**
     * @param int $fileSize
     * @return self
     */
    public function setFileSize(int $fileSize): self
    {
        $this->fileSize = $fileSize;
        return $this;
    }

    /**
     * @return string|null
     */
    public function getFilePath(): ?string
    {
        return $this->filePath;
    }

    /**
     * @param string|null $filePath
     * @return self
     */
    public function setFilePath(?string $filePath): self
    {
        $this->filePath = $filePath;
        return $this;
    }

    /**
     * @return string
     */
    public function getSeparator(): string
    {
        return $this->separator;
    }

    /**
     * @param string $separator
     * @return self
     */
    public function setSeparator(string $separator): self
    {
        $this->separator = $separator;
        return $this;
    }

    /**
     * @return Spreadsheet|null
     */
    public function getFile(): Spreadsheet|null
    {
        return $this->file;
    }

    /**
     * @return static
     * @throws FileException
     */
    public function open(): static
    {
        if (!$this->getFilePath() || !file_exists($this->getFilePath()))
            throw new FileException("The file path is not set or the file \"{$this->getFileName()}\" does not exist.");

        if (!$this->file = IOFactory::load($this->getFilePath()))
            throw new FileException("File \"{$this->getFileName()}\" could not be opened.");

        return $this;
    }

    /**
     * @return static
     */
    public function close(): static
    {
        if ($this->file)
            $this->file = null;

        return $this;
    }

    /**
     * @param int $limit
     * @param int $offset
     * @return array|null
     */
    public function loadRows(int $limit = 0, int $offset = 0): array|null
    {
        if (!$this->file)
            return [];

        $rows = null;
        $i = 0;

        $worksheet = $this->file->getActiveSheet();
        foreach ($worksheet->getRowIterator() as $row) {
            if ($offset-- > 0) {
                continue;
            }

            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(FALSE);
            $r = [];
            foreach ($cellIterator as $cell) {
                $r[] = $cell->getValue();
            }

            $rows[] = $r;

            if ($limit > 0 && ++$i >= $limit)
                break;
        }

        return $rows;
    }
}