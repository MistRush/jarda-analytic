#Nastavení editoru
##Zpětná URL
Chceme-li, aby se v editoru správně zobrazovala cesta v drobečkové navigaci a bylo možné zobrazit šipku zpět pro návrat na předchozí stránku je potřeba nastavit zpětnou URL.

Nejsnadnější cestou je využít přímo definovaných URL v menu.

```php
$editor->setBackUrl(Menu::getInstance()->getItemById('feedback')->getUrl());
```

##Název upravované entity
Pro zobrazení názvu upravované entity stačí definovat, ze kterého sloupce se má název brát.
```php
$editor->setEntityNameColumn('FeedbackNumber');
```

##Samostatný editor (standalone)
Editor lze nastavit jako samostatný, tedy takový, který není závislý na žádném gridu, a lze jej vyvolat odkudkoliv.
```php
$editor->enableStandalone();
```
⚠ Pro použití této funkce je nutné nastavit [zpětnou URL](#zpetna-url).

##Read-Only
Editoru lze nastavit příznak "pouze pro čtení". V takovémto editoru nebudou k dispozici tlačítka pro uložení upravované entity.

```php
$editor->setReadOnly();
```

##Vlastní akce
Do editoru lze přidat vlastní akce, respektive tlačítka zobrazené v hlavičce.
```php
$editor->addAction("action", 'Vlastní akce', null)->setAttribute('onclick', 'vlastniAkce();');
```

Metoda addAction vrací přímo HTML element tlačítka. Lze tedy například nastovovat atribut onclick nebo libovolné ID apod.

Definice JS funkcí pak lze nastavovat v šabloně editoru viz. [Úvod](/editor/editor/#sablona-prostor-pro-js)

##Renderování ukládacích tlačítek
Zakáže renderování tlačítek uloži a uložit a pokračovat

```php
$editor->showSaveButtons(false);
```

##Header/Footer tabs
Možnost přidat taby, které jsou viditelné ve všech tabech

```php
$tab = $editor->addHeaderTab('asdf');
```
