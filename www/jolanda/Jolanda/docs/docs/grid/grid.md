#Gridy
##Úvod
Vytvoříme jednoduchý grid v naší aplikaci.
```php
use Jolanda\Controls\Grid\Grid;
...
public static function createExampleSimpleGrid() {
    $grid = new Grid('simple', 'Zaměstnanci');
    $grid->setUrl('admin/employee');
    $grid->addColumn(COLUMN_BOOL, 'Active', 'Aktivní');
    $grid->addColumn(COLUMN_TEXT, 'Name', 'Jméno');
    $grid->addColumn(COLUMN_TEXT, 'Initials', 'Iniciály');
    $grid->addColumn(COLUMN_TEXT, 'Position', 'Pozice');

    return $grid;
}
```
V controllerru si poté předáme grid pomocí parametrů do šablony.
```php
$form = DevComponents::createExampleSimpleGrid();
$this->renderLatte([
    'grid' => $grid,
]);
``` 
A v šabloně provedeme vykreslení
```latte
{$grid->render()}
```

V JavaScriptu poté můžeme k našemu vytvořenému gridu přistupovat i s nápovědou.

```javascript
 /**
  * @namespace { Grid } grid
  */
var grid;

$(function() {
  grid = {$grid};
});

var funkce = function () {
    grid.getCurrentItem();
}
``` 

##Zdroj dat
Data si grid bere z Clevis Manageru, který definujeme zadáním cesty k němu.
```php
$grid->setUrl('admin/employee');
```

##Provázání s editorem
Aby bylo možné přidávat a upravovat data v gridu, je potřeba předat URL s příslušným editorem. To můžeme třetím parametrem konstruktoru:
```php
$grid = new Grid('simple', 'Zaměstnanci', 'users/employee-edit');
```

##Akční tlačítka
V gridu máme možnost změnit zobrazení výchozích tlačítek Add, Edit a Remove v tomto pořadím nastavením bool parametrů v metode:
```php
$grid->setEnabledActions(true, true, true);
```
Máme také možnost přidat vlastní akční tlačítka.
```php
$grid->addAction('id_tlacitka', 'Popisek', 'jsAkceTlacitka();', [true, false, true]);
```
První parametr nastavuje id elementu s tlačítkem. Elementy poté mají id podle toho kde se nachází (hlavička id_header, kontextové menu id_context, řádek, id_row). 
Druhým parametrem je popisek tlačítka, třetím potom ...., čtvrtý je atribut onClick, tj. definice JS události, která se spustí při kliknutí na tlačítko.
Čtvrtým parametrem nastavujeme v poli viditelnost v hlavičce, kontextovém menu a řádku.

Jednotlivé akce mohou mít také podakce, respektive víceúrovňový výběr.

```php
$action = $grid->addAction('id_tlacitka', 'Popisek', 'jsAkceTlacitka();', [true, false, true]);
$action->addSubAction('id_tlacitka1', 'Popisek1', 'jsAkceTlacitka1();');
```

Cheme-li nastavit ikonu tlačítka v řádku

```php
$action->setIcon('cart');
```

##Nastavení šířky quickeditoru

U gridu také můžeme nastavit, jak velký dialog se bude zobrazovat u jeho quickeditoru

```php
$grid->setQuickeditMaxWidth(1600);
```
