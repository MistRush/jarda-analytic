# Metody třídy ImportBase

**Tento způsob vyžaduje rozšiření třídy `Jolanda\Controls\Import\ImportBase`, která bude obsahovat metodu `function importItem(array $item, Worksheet $sheet, array|null &$output = null): void`**.


### `getColumnValue(mixed $item, string $column, int|false|null &$exits = false, bool $throwException = false): mixed`
Slouží pro získání hodnoty z `$item` pomocí názvu sloupce