<?php

namespace Jolanda\Controls\Import;

use Jolanda\Controls\Import\Exceptions\FileException;
use Jolanda\Controls\Import\Exceptions\ImportException;
use Jolanda\Translations\Lang;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Writer\Exception;

abstract class ImportBase implements ImportInterface
{

    const CREATE = 'create';
    const UPDATE = 'update';
    const DELETE = 'delete';

    const ACTIONS = [
        "c" => self::CREATE,
        "create" => self::CREATE,
        "u" => self::UPDATE,
        "update" => self::UPDATE,
        "d" => self::DELETE,
        "delete" => self::DELETE,
    ];

    /** @var Import $import */
    private Import $import;

    /** @var Spreadsheet|null $spreadsheet */
    private Spreadsheet|null $spreadsheet;

    /**
     * @param Import $import
     * @throws FileException
     */
    public function __construct(Import $import)
    {
        $this->import = $import;
        if ($importFile = $this->import->openFile()) {
            $this->spreadsheet = $importFile->getFile();
        } else {
            $this->spreadsheet = null;
        }
    }

    /**
     * @return Import
     */
    public function getImport(): Import
    {
        return $this->import;
    }

    /**
     * @param Import $import
     * @return static
     */
    public function setImport(Import $import): static
    {
        $this->import = $import;
        return $this;
    }

    /**
     * @param int $size
     * @return array|null
     * @throws Exceptions\FileException
     */
    public function getChunk(int $size = 0): ?array
    {
        return $this->getImport()->getChunk($size);
    }

    /**
     * @param mixed $item
     * @param string $column
     * @param bool $exits
     * @param bool $throwException
     * @return int|string|null|mixed
     * @throws ImportException
     */
    public function getColumnValue(mixed $item, string $column, int|false|null &$exits = false, bool $throwException = false): mixed
    {
        $exits = false;
        $ind = $this->getImport()->getColumn($column);

        if (null !== $ind) {
            if (array_key_exists($ind, $item)) {
                $exits = $ind;
                return $item[$ind];
            } elseif ($throwException) {
                throw new Exceptions\ImportException("Column \"$column\" ($ind) not found");
            }
        } elseif ($throwException) {
            throw new Exceptions\ImportException("Column \"$column\" not selected");
        }

        return null;
    }

    /**
     * @param mixed $item
     * @param string $column
     * @param bool $throwException
     * @return int|false
     * @throws ImportException
     */
    public function getColumnIndex(mixed $item, string $column, bool $throwException = false): int|false
    {
        if (null !== $ind = $this->getImport()->getColumn($column)) {
            if (array_key_exists($ind, $item)) {
                return $ind;
            } elseif ($throwException) {
                $ind++;
                throw new Exceptions\ImportException("Column \"$column\" ($ind) not found");
            }
        } elseif ($throwException) {
            throw new Exceptions\ImportException("Column \"$column\" not selected");
        }

        return false;
    }

    /**
     * @return string|null
     * @throws Exception
     */
    public function saveOutput(): string|null
    {
        if (!$outputFile = $this->import->generateOuputFileName())
            return null;

        $writer = IOFactory::createWriter($this->spreadsheet, 'Xlsx');
        $writer->save($outputFile);

        return pathinfo($outputFile, PATHINFO_BASENAME);
    }

    /**
     * @return Spreadsheet|null
     */
    public function getSpreadsheet(): Spreadsheet|null
    {
        return $this->spreadsheet;
    }

    /**
     * @param Spreadsheet|null $spreadsheet
     * @return static
     */
    public function setSpreadsheet(Spreadsheet|null $spreadsheet): static
    {
        $this->spreadsheet = $spreadsheet;

        return $this;
    }

    /**
     * @param string|null $message
     * @return void
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     * @throws Exception
     */
    public function import(string|null &$message = ''): void
    {
        $sheet = $this->getSpreadsheet()->getActiveSheet();
        $highestColumn = Coordinate::columnIndexFromString($sheet->getHighestDataColumn()) + 1;

        if ($this->getImport()->getHasHeader())
            $sheet->getCellByColumnAndRow($highestColumn, 1)->setValue(Lang::getInstance()->translate('OUTPUT'));

        $emptyRowCounter = 0;
        foreach ($sheet->getRowIterator($this->getImport()->getRow()) as $row) {
            $item = [];

            $isEmpty = true;
            $colCounter = 0;
            foreach ($row->getCellIterator() as $cell) {
                $colCounter++;
                if($colCounter > 100)
                    break;

                $cellValue = $cell->getValue();
                if($isEmpty && !empty($cellValue))
                    $isEmpty = false;

                $item[] = $cellValue;
            }

            if($isEmpty)
                $emptyRowCounter++;
            else $emptyRowCounter = 0;

            if($emptyRowCounter > 100)
                break;

            $output = [];
            $this->importItem($item, $sheet, $output);
            $sheet->getCellByColumnAndRow($highestColumn, $row->getRowIndex())->setValue(implode(', ', $output));
            $this->getImport()->increaseRow();

        }

        $message = Lang::getInstance()->translate('IMPORTED');
    }

    /**
     * @param Worksheet $sheet
     * @param int $columnIndex
     * @param int $rowIndex
     * @return void
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function setModifiedCell(Worksheet $sheet, int $columnIndex, int $rowIndex): void
    {
        $sheet->getStyleByColumnAndRow($columnIndex, $rowIndex)->getFont()->setBold(true)->getColor()->setRGB('FF3333');
        $sheet->getStyleByColumnAndRow($columnIndex, $rowIndex)
            ->getBorders()->getOutline()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('FF3333');

    }

    /**
     * @param array|string $columns
     * @param array $item
     * @param array $modified
     * @param Worksheet|null $sheet
     * @return void
     * @throws ImportException
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function setModified(array|string $columns, array $item, array $modified, Worksheet|null $sheet): void
    {
        if (!$sheet)
            return;

        if (empty($columns))
            return;

        if (!is_array($columns))
            $columns = [$columns => $columns];

        $rowIndex = $this->getImport()->getRow();
        foreach ($columns as $columnDb => $columnExcel) {
            $columnIndex = $this->getColumnIndex($item, $columnExcel);

            if ($columnIndex === false)
                continue;
            if (!array_key_exists($columnDb, $modified)) {
                $columnDb = $columnExcel;
            }

            if (array_key_exists($columnDb, $modified)) {
                if (is_null($item[$columnIndex])) {
                    if ($item[$columnIndex] !== $modified[$columnDb])
                        $this->setModifiedCell($sheet, $columnIndex + 1, $rowIndex);
                } elseif (is_bool($modified[$columnDb])) {
                    $modified[$columnDb] = (int)$modified[$columnDb];

                    if ($item[$columnIndex] !== $modified[$columnDb])
                        $this->setModifiedCell($sheet, $columnIndex + 1, $rowIndex);
                } else {
                    if ($item[$columnIndex] != $modified[$columnDb])
                        $this->setModifiedCell($sheet, $columnIndex + 1, $rowIndex);
                }
                break;
            }
        }
    }
}