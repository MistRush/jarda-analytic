#EntityEditor
##Úvod
Vytvoříme jednoduchý entity editor v naší aplikaci.
```php
use Jolanda\Controls\Editor\EntityEditor;
...
public static function createExampleEditor() {
    $editor = new EntityEditor('id_editoru', 'Zaměstnanci', 'admin/employee');
    $tab = $editor->addTab('Základní nastavení');
    $group = $tab->addGroup('Formulářová skupina');
    $form = $group->addForm();
    $form->addTextBox('Name', 'Jméno');
    
    return $editor;
}
```
V controllerru si poté vytvoříme akci s editorem.
```php
public function exampleEditAction() {
    $editor = DevComponents::createExampleEditor();
    $this->renderEditor($editor, User_Model_User::LEVEL_BUYER);
}
``` 

Druhým parametrem nastavujeme přístupový level, kdy je kontrolován level typu uživatelského účtu.

##Šablona (prostor pro JS)
Vlastní Javascript lze vytvářet v šabloně, která je vždy pojmenovaná podle akce s editorem. Např. tedy views/feedback/edit-feedback.latte

Toto nahrazuje původní addPlaceholder.

Pro přístup k JS instaci editoru s nápovědou

```javascript
/**
  * @namespace { EntityEditor } editor
  */
var editor;

$(function() {
    editor = {$editor};
});
```

##Tagy
Do editoru lze přidávat tagy, které se načtou stejně jako data do inputů

```php
//V editoru vypíše například "Název produktu: MK61 BOSCH25790"
$form->addHtml('<div>Název produktu: <span column="ProductName"></span></div>')
```

##CustomData
V Editoru je možné přidat customData v php, které se pak předají do formuláře editoru a lze s něma dále pracovat.

Při odesílání editoru mají customData menší prioritu než hodnoty z formuláře, takže se vždy přepíšou. 

###addCustomData(string $key, $value)
Přidá custom data do editoru

###setCustomData(array $data)
Nastaví custom data jako pole

