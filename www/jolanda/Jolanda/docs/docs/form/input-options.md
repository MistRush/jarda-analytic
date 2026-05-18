#Možnosti prvků
##Přístup k jednolivým částem
U každého prvku lze přistupovat k jeho dílčím částem (input, label) a nastavovat jim například libovolné atributy apod.

Pro přístup využijeme
```php
$formcontrol->getControlPart();
$formcontrol->getLabelPart();
```

Případně můžeme přímo nastavovat atributy inputu pomocí
```php
$formcontrol->setElementAttribute('atribut', 'hodnota');
```

Tyto metody vrací instance třídy [Nette\Utils\Html](https://api.nette.org/3.0/Nette/Utils/Html.html);

##ReadOnly
Prvkům lze nastavit příznak readonly, čímž se stanou nezměnitelné.
```php
$formcontrol->setReadOnly(true);
```

##Nastavení hodnoty
Jednotlivým prvkům můžeme nastavit výchozí hodnotu
```php
$formcontrol->setValue('vychozi hodnota');
```

##Velikost prvku
Velikost prvků můžeme měnit i pokud máme jinak nadefinovaný počet sloupců. Máme-li například ve skupině dva sloupce, můžeme prvek roztáhnout přes oba sloupce.

```php
$formcontrol->setColumnSize(12);
``` 

Číslování je zde opačné. Nastavujeme velikost skrze kolik sloupců se má prvek vykreslit (1-12)


##Přidání optionu do ajax combo boxu
do enableDynamicAddingOptions vložíme url na quickeditor přes který chceme vytvářet dodatečně option

```php
$group->addAjaxComboBoxStore('Test', 'Test', ['module' => 'admin', 'controller' => 'supplier'], 'Name')->enableDynamicAddingOptions('admin/product/supplier-q-editor')
``` 

v javascriptu pak můžeme nstavovat i další dodatečně relace.

```js
form.dynamicSelects['Test'].parentRows = [
    {
      column: 'Address',
      id: 'xyzt',  
    },
    {
        column: 'XYZ',
        id: 'Zxy',
    },
]
``` 
