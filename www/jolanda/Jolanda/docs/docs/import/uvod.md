# Nástroj pro import
## Úvod
Pomocí tohoto nástroje lze jednoduše importovat a zprácovávat soubory.

Pro správné fungování není potřeba nic nastavovat, lze jej rovnou využít.

## Vytvoření komponenty
Stejně jako Grid či ostatní vytvoříme i tuto komponentu.

**!!! Pro správnou funkčnost je nutné zavolat metodu Import::handle(); !!!**

### Jednoduchý příklad:
```php
use Jolanda\Controls\Import\Import;

...

public static function createExampleSimpleImport(): Import {
    $import = new Import('criteria');

    $import->setImportClass(\common\logic\Taf\Import\ImportCriteria::class);
    $import->enableOutput();
    $import->enableTemplates(); // Povolení možnosti ukládání šablon

    $import->addColumn('ID', translate('ID'));
    $import->addColumn('Action', translate('Akce'), description: translate('Akce: CREATE/C, UPDATE/U, DELETE/D'));
    $import->addColumn('Code', translate('Produkt'), important: true);
    $import->addColumn('CritNo', translate('Kritérium'), 'Crit No', true);
    $import->addColumn('CritValue', translate('Hodnota'), 'Crit Value', true);
    $import->addColumn('FrontPage', translate('Na hlavní stránce'), 'Front Page');

    $import->handle();

    return $import;
}
```

V controlleru si poté předáme import pomocí parametrů do šablony.

```php
$import = DevComponents::createExampleSimpleImport();
$this->renderLatte([
    'import' => $import,
]);
``` 

A v šabloně jej vykreslíme

```latte
{$import->render()|noescape}
```

Pro zpracování importu rozšiříme třídu [**ImportBase**](importBase.md)

```php
<?php

namespace common\logic\Taf\Import;

use Admin_Model_ProductKrit as ProductKritModel;
use Admin_Model_Product as ProductModel;
use Admin_Model_TDKrit as TDKritModel;
use Admin_Model_TDKritValue as TDKritValueModel;
use Exception;
use Jolanda\Controls\Import\Exceptions\ImportException;
use Jolanda\Controls\Import\ImportBase;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ImportCriteria extends ImportBase
{

    /**
     * @param array $item
     * @param Worksheet $sheet
     * @param array|null $output
     * @return void
     * @throws ImportException
     * @throws \PhpOffice\PhpSpreadsheet\Exception
     */
    public function importItem(array $item, Worksheet $sheet, array|null &$output = null): void
    {
        ...
    }
}
```