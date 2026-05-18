#Seznam formulářových prvků
##addAjaxComboBoxStore
`addAjaxComboBoxStore(string $name, ?string $label = null, array $storeUrl = ['module' => 'admin'], string $storeField = 'Name',?string $depends, bool $required = false)`

Přidává dynamický select box, který je závislý na jiném select boxu. Tzn. jeho hodnoty se z manageru načtou až po výběru hodnoty nadřezeného selectboxu.

V parametru _$storeUrl_ nastavujeme cestu k manageru (modul a controller). Parametr _$storeField_ je název sloupce, ze kterého budeme brát zobrazované hodnoty a parametrem _$depends_ nastavujeme ID(Name) nadřazeného prvku.

Pokud chceme využít select box samostatně, nastavíme parametr depends na null.

Z vyhledávácího okna pak select box posílá do ajaxového požadavku parametr '_q_'. Musíme pak ale definovat, jak má manager s tímto parametrem '_q_' dále pracovat (funkce onDataList). Například si do _$storeUrl_ přidat parametr 'SearchAs' => 'colummn_name' a ve funkci _onDataList_ si k tomu napsat potřebnou logiku.

###setSelectWidth
`setSelectWidth($width = 165): ComboBox`

Nastavení šírky selectBoxu. Můžeme nastavit číslo (165 = '165px'), nebo jako string ('100%', '165px')

##addBoolRadioButton
`addBoolRadioButton(string $name, ?string $label = null, bool $noneOption = false)`

Přidá přepinací tlačítka pro boolean hodnoty (Ano / Ne). Parametrem _$noneOption_ můžeme přidat třetí možnost None s hodnotou null.
```php
$group->addBoolRadioButton('bool_radio', 'Bool radio input');
```

##addCheckBox
`addCheckBox(string $name, ?string $label = null, bool $required = false)`

Přidá zaškrtávací políčko. Políčko vrací hodnotu buď true nebo false, podle toho, zda je zaškrtnuté či nikoliv.
```php
$group->addCheckBox('checkbox_input', 'Checkbox input');
```

##addComboBoxEnum
`addComboBoxEnum(string $name, ?string $label = null, array $enumValues = [], bool $required = false, $multi = false)`

Přidá select box se statickými hodnotami. Pole nabízených hodnot předáme jako třetí parametr. Parametr _$multi_ umožníme výběr více možností.
```php
$group->addComboBoxEnum('select', 'Statický select', ['1' => 'One', '2' => 'Two', '3' => 'Three']);
```

###setSelectWidth
`setSelectWidth($width = 165): ComboBox`

Nastavení šírky selectBoxu. Můžeme nastavit číslo (165 = '165px'), nebo jako string ('100%', '165px')

##addComboBoxStore
`addComboBoxStore(string $name, ?string $label = null, array $storeUrl = ['module' => 'admin'], string $storeField = 'Name', bool $required = false)`

Přidá select box s dynamickými hodnotami branými z Clevis Manageru. 

V parametru _$storeUrl_ nastavujeme cestu k manageru (modul a controller). Parametr _$storeField_ je název sloupce, ze kterého budeme brát zobrazované hodnoty

###setSelectWidth
`setSelectWidth($width = 165): ComboBox`

Nastavení šírky selectBoxu. Můžeme nastavit číslo (165 = '165px'), nebo jako string ('100%', '165px')

Parametrem _$multi_ umožníme výběr více možností.
```php
$group->addComboBoxStore('select-dynamic', 'Dynamický select', [
            'module' => 'admin',
            'controller' => 'employee'
        ], 'Name');
```

##addCurrencyBox
`addCurrencyBox(string $name, ?string $label = null, bool $required = false)`

Přídá pole pro zadávání float hodnoty, která je při odeslání vynásobena číslem 100.

##addDateBox
`addDateBox(string $name, ?string $label = null, bool $required = false)`

Přidá políčko pro výběr data. Datum je zobrazováno ve formátu DD. MM. YYYY a při odeslání formuláře je přeformátováno do podoby YYYY-MM-DD.
```php
$group->addDateBox('date', 'Datebox');
```

##addEditor
`addEditor(string $name, ?string $label = null)`

Přidává pole s WYSIWYG tinyMCE editorem.
```php
$group->addEditor('editor', 'Editor');
```

Vlastní parametry do tinyMCE
```php
$baseParams['tiniMceCustomParams'] = [
    'color_map' => [        
        '000000', 'Black',        
        '808080', 'Gray',        
        'FFFFFF', 'White',        
        'FF0000', 'Red',        
        'FFFF00', 'Yellow',        
        '008000', 'Green',        
        '0000FF', 'Blue'    
    ],
];
```


##addEmpty
`addEmpty()`

Přidává prázdné pole. Vhodné pro vytvoření mezery a oddělení prvků v případě rozložení do více sloupců.
```php
$group->addEmpty();
```

##addFileBox
```php
$form->addFileBox(string $name, ?string $label = null, array $fileUploadUrl = [ 'module' => 'common', 'controller' => 'file', 'action' => 'upload' ])
```

Přidá políčko pro upload souboru. Parametrem _$fileUploadUrl_ nastavujeme URL, na kterou se má soubor odeslat.

Je možné taky zapnout náhled obrázku (čtvrtý parametr jestli hcceem povolit náhled, poslední parametr je cesta k souboru)
```php
$form->addFileBox('File_ID', translate('Obrázek: '), [
    'module' => 'common',
    'controller' => 'file',
    'action' => 'upload',
    'nowatermark' => '1'
], true, _bu() . '/files/images/800/');
```
        

Filebox nemá žádná validační pravidla. Nelze na něj tedy použít setRequired, parametr $required nebo addRule
```php
$group->addFileBox('file', 'Filebox');
```

##addMultiFileBox
`addMultiFileBox(string $name, ?string $label = null, array $fileUploadUrl = [ 'module' => 'common', 'controller' => 'file', 'action' => 'upload' ], $callback, array $options)`

Možnost přidávat více souborů najednou. Pro lepší pužití je zde parametr _$options_, do kterého dáme pole ['url' => 'url k provázané tabulce', 'identifier' => 'jméno sloupce v této tabulce k původnímu sloupci ID hlavní entity']

```php
 $editor->addMultiFileBox("File_ID", translate("Fotky:"), [
            'module' => 'common',
            'controller' => 'file',
            'action' => 'upload-photo-for-order-state'
        ], options: [
            'url' => 'admin/order-image',
            'identifier' => 'OrderState_ID'
        ]);
```

##addFloatingPointBox
`addFloatingPointBox(string $name, ?string $label = null, bool $required = false)`

Přidává pole pro zadávání hodnoty s desetinnou čárkou.

##addHidden
`addHidden(string $name)`

Přidává neviditelný input.
```php
$group->addHidden('hidden');
```

##addNumericBox
`addNumericBox(string $name, ?string $label = null, bool $required = false)`

Přidá políčko pro zadání celočíselného čísla.
```php
$group->addNumericBox('numeric', 'Numeric box');
```

##addPassword
`addPassword(string $name, ?string $label = null, bool $required = false)`

Přidá políčko pro zadání hesla.
```php
$group->addPassword('password', 'Password');
```

##addRadioButton
`addRadioButton(string $name, ?string $label = null, array $items = [])`

Přidá seznam s přepinacími tlačítky. Pole hodnot předáváme třetím parametrem.
```php
$group->addRadioButton('radio', 'Radio', ['1' => 'One', '2' => 'Two', '3' => 'Three']);
```

##addTextArea
`addTextArea(string $name, ?string $label = null, bool $required = false)`

Přidává textové pole bez možnosti formátování.
```php
$group->addTextArea('textarea', 'Textarea');
```

##addTextBox
`addTextBox(string $name, ?string $label = null, bool $required = false)`

Přidá jednořádkové textové políčko
```php
$group->addTextBox('text_input', 'Text box', true);
```

##addBlockEditor
`addBlockEditor(string $name): BlockEditor`

Přidává block editor pro tvordu stránek, blogů atd. 
```php
$group->addBlockEditor('blockEditor');
```

Další možnst je použití tzv. dynamickeho block editoru. Inicializuje se pouze jeden block editor a přepíná se s jakým inputem má pracovat.
```php
$blockeditor = $form->addDynamicBlockEditor('testBlockEditor', 'Contentcs', [
    'Contentcs' => 'Článek cs',
    'Contentfr' => 'Článek fr',
    'Contentsk' => 'Článek sk',
]);
```

###Bloky
Do block editoru musíme definovat bloky ze kterých se následně sestavuje content stránky/blogu.

####addBlockAsHTML
`addBlockAsHTML(string $html): void`

Přidá blok jako string. Zadává se ve formátu _editor.BlockManager.add(...)_ (více v dokumentaci grapesjs)

####addBlockFromFile
`addBlockFromFile(string $filePath, array $params = []): void`

Přidá blok z latte šablony. V šabloně si bloky definujeme ve formátu _editor.BlockManager.add(...)_ (více v dokumentaci grapesjs)

Příklad přidání jednoduchého bloku 
```php
$blockeditor = $form->addBlockEditor('Contentfr');
$blockeditor->addBlockAsHTML("
    editor.BlockManager.add('h1-block', {
        label: 'H1',
        content: '<h1>Put your title here</h1>',
        category: 'Basic',
        attributes: {
            title: 'Insert h1 block'
        }
    });
");
```

####Dynamické bloky
Dynamické bloky jsou bloky, u kterých se data načítájí až při vykreslení obsahu na webu. To znamená používání aktuálních dat (ceny, názvy kategorií, slugy atd.).

Dynamický blok si musíme definovat v html kódu bloku pomocí tagů.
```html
<div storeblock storeblock-tablename="Admin_Model_Product" storeblock-identifyby="ID" storeblock-value="160" class="container section-with-image">
    <h2 storeblock-column="tmpName">Název Produktu</h2>
    <span storeblock-column="productType.getLang.Name">Název kategorieu</span>
    <div storeblock-column="withVAT" storeblock-column-type="price">Cena s DPH</div>
    <div storeblock-column="withoutVAT" storeblock-column-type="price">Cena bez DPH</div>
    <div class="image">
        <img src="/front/img/engine.png" alt="warehouse" class="w-100" storeblock-column="productPhotoPath" storeblock-column-type="productPhoto" width="100" height="100">
    </div>
</div>
```
- [storeblock] - značí že blok využívá dynamické načítání
- [storeblock-tablename]- tabulka ze ktere se má brát entita
- [storeblock-identifyby] - sloupec v DB podle kterého vybíráme
- [storeblock-value] - hodnota sloupce v DB
- [storeblock-params] - libovolné parametry bloku pro předání do formátovací funkce
- [storeblock-column] - název sloupce z DB pro výpis (u vlastních column-type sloupců se používá jako identifikátor)
- [storeblock-column-type] - typ sloupce (žádný = "default")
- [storeblock-column-params] - libovolné parametry sloupce pro předání do formátovací funkce

#####Renderování bloků
Takto vytvořené bloky musíme vyrenderovat na frontendu před předáním do šablony.

Pro render se využívá třída BlockEditorRenderer. Metoda render vrací pole ['html' => 'content jako html string', 'css' => 'css styly']

```php
use \Jolanda\Controls\Form\Controls\Renderers\BlockEditorRenderer;
...
$blogRenderer = new BlockEditorRenderer();
$blogRenderer->render($blogDetail->content, Default_Logic_Translation::getInstance()->getLocaleId());
```

U každého typu sloupce([storeblock-column-type]), který není default, si můžeme před renderem nastavit vlastní formátovací funkci.

```php
//příklad formatovací funkce pro storeblock-column-type="price"
//$product je získaná entita z DB
//$column je atribut storeblock-column
//$blockAttributes je pole atributů bloku ['tablename', 'identifyby', 'value', 'params']
//$columnParams atribut storeblock-column-params (pro předávání libovolného parametru do formátovací funkce)
$blogRenderer->setColumnTypeFormatFunction('price', function($product, $column, $blockAttributes, $columnParams){
    $price = [
        'withVAT' => $this->priceCalc->getFormatedPriceWithVat($product->productName->PriceRepair/100),
        'withoutVAT' => $this->priceCalc->getFormatedPriceWithoutVat($product->productName->PriceRepair/100),
    ];
    
    return $price[$column];
});
```

```php
//příklad formatovací funkce pro produktový obrázek (u <img> elementů se nemění text, ale rovnou src obrázku)
$blogRenderer->setColumnTypeFormatFunction('productPhoto', function($object, $column){
    return _bu() . '/files/images/800/' . $object->productName->productNameImages[0]->file->Name . '.' . $object->productName->productNameImages[0]->file->Extension;
});
```

Třídá má ještě možnost zapnout debug režim, ve kterém se vypisují errory přímo do šablony

(normálně se errory vypisují pouze jako atribut storeblock-error, v produkčním režimu se také mažou veškere atributy kromě storeblock-error)

Poté si předáme data z funkce render do šablony, kde html vypíšeme kam potřebujeme a css styly nalinkujeme do hlavičky například pomocí latte makra {block}

####addHtml

Do formu jde přidávat taky html element
```php
$form->addHtml('<div>xyz</div>')
```

###addTimeBox
Přidá Time box. Parametr type nastavuje typ timeBoxu. Typy = [H => Hodiny, HM => Hodiny:Minuty, HMS => Hodiny:Minuty:Sekundy]

```php
$form->addTimeBox('Time', 'Čas', 'HM');
```

        

