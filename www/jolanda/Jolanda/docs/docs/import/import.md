# Metody třídy Import

## setImportClass
### `setImportClass(string|null $importClass): static`

Nastaví třídu, která zpracuje data importu. 
V ideálním případě musí třída rozšiřovat třídu `Jolanda\Controls\Import\ImportBase`.
Poté stačí, aby třída obsahovala metodu `public function importItem(array $item, Worksheet $sheet, array|null &$output = null): void { ... }`

### `enableOutput(bool $hasOutput = true): static`

Zapne možnost stáhnout výstup importu

### `enableTemplates(bool $hasOutput = true): static`

Zapne možnost ukládat nastavené sloupce do šablon pro pozdější použití.

### `addColumn(string $name, string $title, ?string $matchName = null, bool $important = false, ?string $description = null): ImportColumn`

Přidá sloupec, se kterým poté půjde pracovat

