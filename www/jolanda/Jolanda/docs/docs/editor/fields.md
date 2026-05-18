#Prvky editoru
Pro správné vkládání prvků editoru je potřeba zachovat patřičné pořadí. Nelze tedy například vložit input přímo do editoru.
##Tab
Pro vložení tabu do editoru vyvoláme 
```php
$tab = $editor->addTab('Název tabu', 'ID tabu');
```

Checeme-li tab zneaktivnit při vyváření entity
```php
$tab->setHiddenOnCreate();
```

ℹ Taby které obsahují Grid, Relation Swithcer nebo Category Switcher jsou implicitně skryté jelikož jsou závislé na ID entity, která ještě není vytvořena.

##Group
Pro vložení skupiny do tabu vyvoláme
```php
$group = $tab->addGroup('Název skupiny');
```
Do skupiny poté můžeme vkládat formuláře, gridy, relation switcher nebo čísté HTML.

Skupině lze také nastavovat potřebné HTML atributy.

```php
$group->setElementAttribute('class', 'vlastni-trida');
```

##Form
Pro vložení formuláře do skupiny vyvoláme
```php
$form = $group->addForm();
```
Formuláře editoru jsou instancí třídy Jolanda\Controls\Form\Controls\FormGroup. Lze tedy využívat stejné prvky jako při tvorbě běžných formulářů.
###DataAttribute
Pro formuláře lze nastavit tzv. DataAttribut, který určuje, ze které vazby na hlavní tabulku mají být data brána. Například tabulka User má na sebe vazbu UserSetting. Tímto můžeme nastavit, že data pro tento formulář mají být brána z Doctrine relace `userSettings`.
```php
$form->setDataAttribute('userInfo');
```

##HTML
Pro vložení vlastního bloku HTML kódu do skupiny zavoláme
```php
$code = $group->addHtml('<div>Vlastni html kod</div>');
```

##Grid (SubGrid)
Do editoru lze také přidat Grid s daty, které jsou s upravovanou entitou v relaci 1:N. Například uživatel má několik doručovacích adres.
```php
$grid = $group->addGrid('deliveryaddress', 'Doručovací adresy');
```
Až na několik rozdílů v základním nastavení lze využívat stejné metody jako u běžného Gridu.

⚠ Grid není v editoru nikdy zobrazen v případě vytváření entity.

### Nastavení gridu
Pro provázání gridu s entitou je nutné nastavit sloupec s cizím klíčem. Např. máme-li grid s doručovací adresou, cizím klíčem je zde User_ID.
```php
$grid->setParentEntity('User_ID');
```
###QuickEditor
Pro editaci či přidávání záznámů se zde využívá tzv. Quick Editor. V gridu musíme jen nastavit akci s QuickEditorem.
```php
$grid->setUrl('user/delivery-address');
```
[Více informací o QuickEditoru poté v jeho sekci](/editor/quickeditor).

##RelationSwitcher
RelationSwithcer lze také použít přímo při úpravě entity. Nastavení je stejné jako u běžného RelationSwitcheru.
```php
$relationSwitcher = $group->addRelationSwitcher('Řešitelé','admin/employee', 'admin/feedback-employee', 'Feedback_ID', 'Employee_ID', 'Name', ['Active'=>1]);
```

⚠ Relation Switcher není v editoru nikdy zobrazen v případě vytváření entity.

