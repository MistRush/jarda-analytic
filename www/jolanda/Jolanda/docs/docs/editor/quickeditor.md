#QuickEditor
##Úvod
V controlleru vytvoříme příslušnou action, kterou jsme si nadefinovali v SubGridu.
```php
public function editFeedbackTasksAction() {
    $editor = DevComponents::createQuickEditor();
    $this->renderQuickEditor($editor);
}
```

A vytvoříme si daný QuickEditor
```php
public static function createQuickEditor() {
    $editor = new QuickEditor('Doručovací adresa', 'user/delivery-address');
    $editor->addTextBox('Name', 'Název:', false);
    
    return $editor;
}
```

Třída QuickEditor dědí přímo z Jolanda\Controls\Form\Controls\FormGroup. Lze tedy využívat běžné formulářové prvky.

##JavaScript
Chceme-li QuickEditoru přidat JavaScript a ovládat tak například eventy onShow apod. vytvoříme soubor latte dle akce s QuickEditorem.

QuickEditor dědí z třídy EntityEditor. Lze tedy používat stejné metody či eventy.

##Gridy

Do quickeditoru lze také přidávat gridy. Funguje stejně jako přidávání gridů do EntityEditoru.

```php
$editor = new QuickEditor('Tag', 'admin/blog-tag');

$grid = $editor->addGrid('order_note', translate('Poznámky'));
$grid->setParentEntity('Order_ID');
$grid->addEditor('admin/order/order-note-q-editor');

$grid->setOrder('Insertdatetime');
$grid->enablePreview(true);
$grid->setUrl('admin/order-note');
$grid->addColumn(COLUMN_DATETIME, 'Insertdatetime', translate('Datum'));
$grid->addColumn(COLUMN_ENTITY, 'User_ID', translate('Uživatel'), 150)->setEntity('ID', 'Name', ['module' => 'user', 'controller' => 'user']);
$grid->addColumn(COLUMN_TEXT, 'Note', translate('Poznámka'), 800);

return $editor;
```

##Šířka dialogu

Šířka dialogu s quickeditorem se nastavije na úrovni gridu

```php
$grid->setQuickeditMaxWidth(1600);
```

