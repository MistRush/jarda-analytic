#Možnosti
##Vyhledávání
V gridu můžeme zapnout vyhledávací pole, které filtruje data na základě sloupce. Druhým parametrem je placeholder zobrazený ve vyhledávacím poli.
```php
$grid->enableSearch('Name', 'Vyhledávání dle jména');
```
Můžeme také vyhledávat ve více sloupcích najednou. Chceme-li vyhledávat i v propojených tabulkách, zadáváme název sloupce ve formátu aliasTabulky.názevSloupce. Propojené tabulky musí být připojeny v manageru.
```php
$grid->enableSearch(['Name', 'Email', 'employee.Name'], 'Vyhledávání dle jména, emailu, nebo jména zaměstanance');
```

Můžeme vedle search baru přidat taky checkbox s možnostma, podle kterých chceme vyhledávat. Podle vybraného typu se do manageru pošle parametr SearchBy. Implementaci v manageru si musí zajistit každý sám.
```php
$grid->enableSearch(null, 'Vyberte typ vyhledávání v select boxu a doplňte hodnotu za dvojtečkou', ['' => '', 'product' => 'V produktech']);
```

##Filtrování
Implictně má grid povoleno filtrování ve všech sloupcích. Toto chování lze upravit.
```php
$grid->setFilterDefault(false);
```
##Podmíněné formátování řádků
Chceme-li nastavit podmíněné formátování řádků na základě hodnot, nastavíme JS funkci, která se má na každý řádek aplikovat.
```php
$grid->setRowFormatter('formatovaciFunkce');
```
V šabloně si poté vytvoříme JS formátovací funkci. Tato například obarvuje řádky jejiž ID je sudé.
```javascript
var formatovaciFunkce = (row, data, index) => {
    if (data.ID % 2 == 0)
        $(row).css('background-color', 'red');
}
```
##Výběr řádků
Implicitně je v gridu nastaven výběr jednoho bez checkboxu.

Pro změnu tohoto chování využijeme funkce. Druhý parametr funkce je jestli chceme vybírat pouze z načtených dat, nebo globálně ze všech dat. Defaultně `SELECT_MULTI_TYPE_ONLY_LOADED`, globální `SELECT_MULTI_TYPE_ALL`
```php
$grid->setSelect(Grid::SELECT_MULTI_CHECKBOX, Grid::SELECT_MULTI_TYPE_ALL);
```
Kde parametr určuje nový způsob výběru. Můžeme využít `SELECT_SINGLE` pro jednotný výběr, `SELECT_MULTI` pro výběr více řádků, `SELECT_MULTI_CHECKBOX` pro výběr více řádků s checkboxem a `SELECT_MULTI_CHECKBOX_REVERSE` stejný jako předchozí ale při výběru všech řádků udělá revers.

⚠ Při zapnutém výběru více řádků nelze zobrazit Relation Switcher a jestliže je vybráno více řádků nelze vyvolat panel pro úpravu entit.

JS funkce pro získaní aktuálního řádku fungují s tím rozdílem že vrací objekt nebo pole objektů.

##Změna pořadí řádků
Data v tabulce můžeme přesunovat pomocí drag&drop a tím měnit jejich pořadí, resp. hodnotu příslučného sloupce v databázi.
```php
$grid->setReorderColumn('order_column');
```
Parametrem zde určíme sloupec, který obsahuje data o pořadí.

##Náhled řádků
Pro Grid lze povolit rychlý náhled řádku, který v dialogu zobrazí všechny zobrazené sloupce a jejich obsah. Užitečné je to například chceme-li zobrazit celý obsah sloupců typu COLUMN_LONGTEXT

```php
$grid->enablePreview();
```

##Relation Switcher
Gridu lze zapnout funkci pro rychlou manipulaci s M:N záznamy. Příkladem může být uživatel v uživatelských skupinách. Namísto manuálních přidávání a odebírání záznamů lze zapnout Relation Switcher, který pro každý záznam provede výpis všech možných záznamů z cizí tabulky a jednoduchým přepínáním stavů checkboxů přidávat či odebírat záznamy.
```php
$grid->enableRelationSwitcher('user/group', 'user/user-in-group', 'User_ID', 'Group_ID', 'Name');
```
Prvním parametrem je cesta k manageru se všemi možnými daty, druhým cesta k manageru s M:N relacema, třetím název sloupce pro M: vazbu, čtvrtým název sloupce pro :N vazbu a pátým potom popisek řádku ze zdrojových dat.

Sedmým a osmým parametrem můžeme data seskupit podle sloupce z dat manageru zadaném v prvním parametru. Příkladem může být seskupení typů produktů podle jejich sekce.
```php
$grid->enableRelationSwitcher('admin/product-type', 'user/user-product-type', 'User_ID', 'ProductType_ID', 'Name', null, 'Section_ID', 'SectionName');
```

##Nastavení vazby mezi dvěma gridy
Potřebujeme-li propojit dva gridy mezi sebou (vazba 1:N), provedeme to metodou na straně potomka, respektive straně :N.
```php
$grid->setParentGrid($parentGrid, 'Parent_ID');
```
Prvním parametrem je rodičovský grid. Druhým potom sloupec, který je cizím klíčem.

Pokud chceme nastavit, aby parent grid byl závislý na více než jendom sloupci provedeme to následovně.
```php
$product->setParentGridRelations($productNameGrid, [['column' => 'ProductName_ID', 'child' => 'ID'], ['column' => 'ProductType_ID', 'child' => 'ProductType_ID']]);
```

Můžeme taky nastavit aby byl grid závislý na více tabulkách najendou.
```php
$product->setParentRelations([['column' => 'ProductName_ID', 'child' => 'ID', 'grid' => $productNameGrid], ['column' => 'ProductType_ID', 'child' => 'ProductType_ID', 'grid' => $xyzGrid]]);
```

##Použítí rychlého editoru namísto panelového
Chceme-li při úpravě nebo přidávání entity zobrazit pouze jednoduchý dialog pro úpravu namísto zobrazování panelu připravíme si akci s [QuickEditorem](../editor/quickeditor.md) a zavoláme
```php
$grid->setQuickeditAction('files/edit-file');
```
⚠ Pro použití quickeditoru musí být URL běžného editoru nastavena na null (3. parametr konstruktoru)

##Nastavení výšky
Gridu lze nastavit výšku

```php
$grid->setHeight('20vh');
```

##Nastavení vlastní url pro list/update/delete/create
Musíme si sami pohlídat, aby custom url vracely json v potřebném formátu

```php
$grid->setDirectUrl('product',[
        'data-list' => 'get-product-data', //url bude /admin/product/get-product-data
        'data-delete' => 'data-delete',
        'data-update' => 'data-update',
        'data-create' => 'create-product'
    ]);
```

##Nastavení url pro inline editor
Můžeme nastavit jaká url se ajaxově bude volat při změně v inline editoru (defaultně stejná url jako pro update (data-update)). Při nastavení hodnoty na null se nebude volat žádný ajax a data si pak můžeme kdykoliv ukládat sami.

```php
$grid->setInlineEditAction('update-product-data');
$grid->setInlineEditAction(null) //neprovede se žádný ajax;
```

##Možnost zapnou cachovaní editoru
editor pro editování se pak nestahuje pokážde ajaxově, ale pouze jednou a poté stahuje pouze data

```php
$grid->setEditorCache(true);
```

##Možnost nastavit kolik má grid načítat záznamů
čím menší číslo, tím míň řádků si natahá ze serveru, neodpovída ale 1:1 se zadanou hodnotou. Default je 25 (načte cca 225 řádků - záleží na rozlišení obrazovky)

```php
$grid->setDisplayBuffer(25);
```

#Možnost vypnout infinite scrolling
grid pak bude používat klasický číselníkový paging 

```php
$grid->setInfiniteScroll(false);
```

#Možnost lokálního ukládání dat
Grid pak neodesílá přidané/upravené data na server, ale uloží si je pouze k sobě do paměti. 

Pokud chceme odesílat data ze subgridu při uložení editoru, musíme nastavit 'managerAlias'. Tento alias je aliasem nastavený v manageru upravovaného prvku v jeho cildManageru 

Data pak můžeme dále v gridu upravovat pomocí js funkcí addRow, deleteRow, updateRow

Každý vytvořený záznam do tohotoh gridu dostane své vlastní id uložené v proměnné tmp_local_id. Potom můžeme vybrat tento řádek například pomocí funkce getRowByUniqueKeyValue

```php
$grid->setDataSaveType(Grid::SAVE_DATA_LOCAL, ['managerAlias' => 'productCodes']);
```

##Možnost nastavit jestli musí být při editaci vybraný parentGrid
```php
$grid->oneMustBeSelected(false);
```

##setAjax
Možnost nastavit aby se data netahali ajaxově. Při této možnosti nefunguje ani data-list, update,create atd.
Čistě pro zobrazování dat z pole. Data pak nastavíme funkcí setData($data). $data je asociativní pole se stejnými názvy jako v definici gridu.


#Serverside presety
Možnost ukládat presety do databáze.

Nejdříve je třeba vytvořit vlastní controller, rozšiřující controller, který se stará o actiony spojené s pŕaci s daty.

Ukázka controlleru
```php
class Admin_PresetController extends \Jolanda\Controller\PresetController
{
    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array(), string $module = 'admin')
    {
        parent::__construct($request, $response, $invokeArgs, $module, new Admin_Controller_Action($request, $response, $invokeArgs, $module));
    }
}
```


Poté musíme nastavit, že chceme grid ukádat na server a zároveň musíme nastavit kde se nachází vytvořený controller (tento kód vložit tam, kde se provede vždy - například BaseController, nebo jenom tam, kde chceme aby presety byly serverside)
```php
\Jolanda\Controls\Grid\Grid::$PRESET_SAVE_TYPE = \Jolanda\Controls\Grid\Grid::PRESET_SAVE_TYPE_SERVERSIDE;
\Jolanda\Controls\Grid\Grid::$PRESET_SAVE_SERVERSIDE_URL = 'admin/preset';
```

Jako poslední musíme vytvořit tabulky v DB. \Jolanda\Controller\PresetController má action init, která tyto tabulky vytvoří. Stačí ji zavolat jen jednou.

#Vypnutí filters baru
Vypne i ukládání filtrů do localStorage
```php
$grid->setUseFiltersBar(false);
```