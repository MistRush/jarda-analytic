#StatusManager
Pomocí status manageru můžeme vypisovat uživateli notifikace, které si definujeme kdykoliv a kdekoliv během vytváření/editace entity pomoci entityEditoru.

! Pro správny výpis manageru je potřeba upravit library/Clevis/Zend/Controller/DataAction.php

```php
//[řádek 153]
$this->renderData($data['data'], $data['identifier'], ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);
```

```php
//[řádek 205]
$this->renderData($data['data'], $data['identifier'], ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);
```

```php
//[řádek 233]
$this->renderData([], null, ['statuses' => \Jolanda\Controls\Editor\StatusManager::getInstance()->toArray()]);
```

##Přístup ke status manageru
```php
use Jolanda\Controls\Editor\StatusManager;
...
$statusManager = StatusManager::getInstance();
```

Protože budeme chtít dávat info uživateli hlavně z managerů a nebo přímo z tříd (jako například Admin_Model_Blog), je lepší si přidat do 
library/Clevis/data/ManagerRaw a do library/Doctrine/record metodu pro lepší přístup.

```php
public function getStatusManager(): StatusManager
{
    return StatusManager::getInstance();
}
```

Ve třídě Admin_Model_Blog, nebo v manageru si pak jen zavoláme 

```php
$statusManager = $this->getStatusManager();
```

##Přidávání notifikací/statusů

- msg [string] - zprává pro zobrazení uživateli
- confirmAfterNotify [bool] - zdali se má po zobrazení notifikace zavřít okno a vyvolat confirm v js

###addError
`addError(string $msg, bool $confirmAfterNotify = false): Status`

Přidá error hlášku (červené okno)
```php
$statusManager->addError('Nejde přidat záznam');
```
###addSuccess
`addSuccess(string $msg, bool $confirmAfterNotify = true): Status`

Přidá success hlášku (zenelé okno)
```php
$statusManager->addSuccess('Záznam úspěšné přidán');
```
###addInfo
`addInfo(string $msg, bool $confirmAfterNotify = true): Status`

Přidá info hlášku (šedé okno)
```php
$statusManager->addInfo('Materiál je na skladě');
```

##Výpis notifikací/statusů
Notifikace se vypíší automaticky po dokončení scriptu. 

! Je potřeba upravit clevis DataAction, více v prvním odstavci této sekce

###__toString
`__toString(): string`

Je možné je vypsat i samostatně jako json.

```php
echo $statusManager;
```

Vypíše {statuses: [pole statusů]}

##Funkce po výpisu
Lze každému statusu nastavit javascriptouvou funkci která se vykoná po vypsání dané notifikace

###setAfterNotifyFunction
`setAfterNotifyFunction(string $function): Status`

```php
$statusManager->addError('Počet je vetší jak 5')->setAfterNotifyFunction('resetForm');
```

##Práce se statusy
Status je pouze upozornění pro uživatele. Nijak nemodifikuje kód pro ukládání entity.

Logiku ohledně práci se statusama si musíme pohlídat v kódu sami. 

Příklad

```php
if($count > 5)
    $statusManager->addError('Počet je vetší jak 5');

if($statusManager->hasErrors()){
    $statusManager->addInfo('Entita neuložena', false)->setAfterNotifyFunction('resetForm');
}else{
    $statusManager->addInfo('Entita uložena')->setAfterNotifyFunction('afterSuccess');
    $entity->save();
}

if(!$statusManager->hasErrors())
    $statusManager->addSuccess('Hotovo');
```



