<?php

namespace Jolanda\Controls\Import;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

interface ImportInterface
{

    /**
     * @param array $item
     * @param Worksheet $sheet
     * @param array|null $output
     * @return void
     */
    function importItem(array $item, Worksheet $sheet, array|null &$output = null): void;
}