#Sloupce
##Základ
Do gridu můžeme přidávat sloupce na základě dat z Clevis Manageru. 
```php
$grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno');
```
Prvním parametrem je typ dat ve sloupci, dle kterého je prováděno následné formátování (viz. [Formáty](#formatovani)), druhým název sloupce z DB, třetí potom popisek sloupce.
##Formátování
|Formát|Funkce|
|------|------|
|COLUMN_BOOL|Formátování bool hodnoty na text Ano / Ne|
|COLUMN_CHECKBOX|Formátování bool hodnoty na text Ano / Ne s checboxem pro rychlé přepínání|
|COLUMN_CURRENCY|Formátuje číslo a vydělí 100|
|COLUMN_CURRENCY_CZK|Stejné jako COLUMN_CURRENCY jen doplní Kč|
|COLUMN_CURRENCY_EUR|Stejné jako COLUMN_CURRENCY jen doplní €|
|COLUMN_CURRENCY_GBP|Stejné jako COLUMN_CURRENCY jen doplní £|
|COLUMN_CURRENCY_PLN|Stejné jako COLUMN_CURRENCY jen doplní zŁ|
|COLUMN_CURRENCY_USD|Stejné jako COLUMN_CURRENCY jen doplní $|
|COLUMN_DATE|Formátuje datum do podoby DD. MM. YYYY|
|COLUMN_ENTITY|Zobrazuje data z relační tabulky|
|COLUMN_ENUM|Zobrazuje data na základě hodnot z předaného enumeračního pole|
|COLUMN_LONGTEXT|Zkracuje dlouhý text na 250 znaků|

Na každý sloupec lze také aplikovat vlastní JS formátovací funkci.
```php
$grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno')
     ->setFormatFunction('formatovaciFunkce');
```
JS funkce pak může vypadat takto:
```javascript
var formatovaciFunkce = function (value, column, row_data, format) {
    return '<span class="text-red">'+row_data.Name+'</span>'
}
```

##Sloupce ENUM a ENTITY
Hodnoty ve sloupcích mohou mít dynamický obsah předávaný buď pomocí enumeračního pole.
```php
$grid->addColumn(COLUMN_ENUM, 'Position', 'Pozice')
     ->setEnumValues([
        'admin'=>"Administrátor", 
        'buyer'=>'Nakupující'
     ]);
```

Nebo brány z relační tabulky Clevis Manageru.
```php
$grid->addColumn(COLUMN_ENTITY, 'User_ID', 'Účet')
     ->setEntity('ID', 'Name', ['module' => 'user', 'controller' => 'user-list', 'nobuyer' => 1]);
``` 
Prvním parametrem metody je klíč cizí tabulky, druhým název / obsah který se má v gridu vypsat a třetím potom cesta k Clevis Manageru. Lze také použít parametry.

##Filtrování ve sloupci
Filtrování daného sloupce lze vypnout metodou
```php
$grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno')
     ->setFilter(true);
```

##Inline editace
Pro daný sloupec lze také zapnout inline editaci hodnot.
```php
$grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno')
     ->setEditable(true);
```
Pro zobrazení editoru pak stačí kliknout na danou buňku při podržení klávesy Alt

⚠ Editace nelze použít na sloupce, které jsou formátovány vlastní JS funkcí.

###AjaxSelect
do inline editoru lze nastavit i ajaxSelectBox. Problém je, že sloupec musí být nastavený jako text (nechceme zobrazovat ID, ale nějakou textovou value), ale chceme měnit ID. Takže musíme nastavit i jaká hodnota(sloupec) se má v DB měnit.

```php
$grid->addColumn(COLUMN_TEXT, 'LanguageCode', 'Jazyk', 20)->setEditable(true, Column::EDIT_TYPE_AJAX_SELECT, [
    'storeUrl' => ['controller' => 'language'], //stejně jako u AjaxComboBoxStore
    'storeField' => 'Code', //stejně jako u AjaxComboBoxStore
    'name' => 'Language_ID' //sloupec který chceme měnit
]);
```


##Skrytí sloupce
Sloupce lze implicitně skrýt.

```php
$grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno')
     ->setVisible(false);
```