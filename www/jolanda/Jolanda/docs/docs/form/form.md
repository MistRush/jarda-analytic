#Formuláře
##Úvod
Vytvoříme jednoduchý formulář pro naší aplikaci.
```php
use Jolanda\Controls\Form\Form;
...
public static function createExampleForm() {
    $form = new Form();
    $group = $form->addFormGroup('Formulářová skupina');
    $group->setColumns(2);
    $form->addTextBox('input_name', 'Input label', true);
    
    return $form;
}
```
V controllerru si poté předáme formulář pomocí parametrů do šablony.
```php
$form = DevComponents::createExampleForm();
$this->renderLatte([
    'form' => $form,
]);
``` 
A v šabloně provedeme vykreslení
```latte
{$form->render()}
```

V JavaScriptu poté můžeme k našemu vytvořenému formuláří přistupovat i s nápovědou.

```javascript
 /**
  * @namespace { Form } form
  */
var form;

$(function() {
 form = {$form};
})

var funkce = function () {
    form.getValue('name');
}
``` 

##Struktura
Každý formulář se skládá z formulářových skupin, do kterých lze vkládat jednotlivé formulářové prvky.
```php
$form = new Form();
$group = $form->addFormGroup('Formulářová skupina');
```
Formulářové skupině můžeme nastavovat počet sloupců, do kterých se mají prvky řadit. Můžeme využít 1-12 sloupců.
```php
$group->setColumns(2);
```

##Akce
Chceme-li, aby formulář svá data po odeslání odeslal přislušné akci, musíme přidat atribut action. Je nutné uvést absolutní cestu!
```php
$form->setAction($basePath . 'admin/user/create-user');
``` 

##AJAX
Formulář lze také nastavit, aby data odesílal pomocí AJAXu.
```php
$form->setAjax();
``` 
Takto poté můžeme v šabloně pracovat s událostmi _onSuccess_ nebo _onError_.

##Šablony
Nasaví formuláři šablonu, která se použije při renderu formuláře

```php
$form->setTemplate('admin/views/components/testFormTemplate.latte');
``` 

Ukázka šablony
```latte
<div class="row">
    <div class="col-12 col-md-6 col-lg-3" style='background-color: green;'>
        {$form->getFormControl('Enum_ID')|noescape}
    </div>
    <div class="col-12 col-md-6 col-lg-3" style='background-color: blue;'>
        {$form->getFormControl('Text1')|noescape}
    </div>
    <div class="col-12 col-md-6 col-lg-3 text-center align-items-center justify-content-center d-flex" style='background-color: lightblue;'>
        asf
    </div>
    <div class="col-12 col-md-8 col-lg-3" style='background-color: red;'>
        {$form->getFormGroup('second')|noescape}
    </div>
</div>
``` 

Nebo možnost vypsat všechyn inputy 

```latte
{foreach $form->getFormControls() as $control}
<div class="cokoliv">{$control|noescape}</div>
{/foreach}

``` 