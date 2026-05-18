#Validace
##Validace formulářových prvků

Na formulářové prvky lze kromě vlastních validačních pravidel používat předpřipravené pravidla

Všem validačním pravidlům můžeme přidat vlastní chybovou hlášku, nebo se použije hláška výchozí.

Validačních pravidel můžeme k jednomu prvku přiřadit hned několik.

```php
$group->addTextBox('text', 'Pole omezené délkou')
      ->addRule(FormControl::VALIDATOR_MIN_LENGTH, 'Pole musí mít minimálne 2 znaky', 2)
      ->addRule(FormControl::VALIDATOR_MAX_LENGTH, 'Pole musí mít maximálně 5 znaků', 5);
```

Prvním parametrem je pravidlo z třídy _FormControl_, druhým potom chybová hláška a třetím případné parametry.

##Seznam validátorů
| Pravidlo | Popis | Parametry |
| -------- | ----- | --------- |
| VALIDATOR_EMAIL | Je hodnota email? | - |
| VALIDATOR_LENGTH | Má hodnota přesnou délku? | `int` délka |
| VALIDATOR_MAX_LENGTH | Má hodnota maximálně x znaků? | `int` délka |
| VALIDATOR_MIN_LENGTH | Má hodnota minimálne x znaků? | `int` délka |
| VALIDATOR_NUMBER | Je hodnota číslo? | - |
| VALIDATOR_PATTERN | Splňuje hodnota regulární výraz? | `string` regexp |
| VALIDATOR_RANGE | Je číselná hodnota v rozmezí? | `array[int,int]` [od,do] |
| VALIDATOR_REQUIRED | Je položka vyplňena? | - |
| VALIDATOR_SAME_VALUE | Je hodnota stejná jako v určeném poli? | `string` název inputu |
| VALIDATOR_CUSTOM | Provede spuštení vlastní boolean JS funkce, která ověří hodnotu | `string` název funkce |



##JavaScript
Validační pravidla se na stranu JavaScriptu přenášejí v HTML atributech data-validator, které obsahují JSON popisující jednotlivá pravidla nebo podmínky.
 
Samotnou validaci pak provádí skript, který odchytí událost submit (nebo se vyvolá manuálně), projde jednotlivé prvky a vykoná příslušnou validaci. 