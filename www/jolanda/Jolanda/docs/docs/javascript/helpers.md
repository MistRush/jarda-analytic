#Pomocníci
##AJAX
Pro vyvolání AJAX požadavku stačí zavolat
```javascript
Helpers.ajax({
    url:'/default/get-data'
}, true)
```
Jedná se o implementaci běžného [jQuery.ajax()](https://api.jquery.com/jquery.ajax/).

Druhým parametrem lze zapnout zámek stránky a zobrazení načítání přes celou obrazovku.

##Stahování souborů
Pomocí AJAXu lze stahovat soubory, se zpětnou vazbou o tom, kolik % je již staženo.

```javascript
Helpers.downloadFile('/default/download/file', 'nazev-souboru.txt', {parametr: '1. parametr', ...})
```

Pro správné zobrazování progress baru při stahování je nutné v PHP dodat hlavičku o velikosti souboru a binárním typu přenosu.

```php
header("Content-Transfer-Encoding: Binary"); 
header("Content-Length: ".filesize($file_url));
header("Content-disposition: attachment; filename=\"" . basename($file_url) . "\""); 
readfile($file_url);
```

##Formátování čísel
Pro formátování čísel v JavaScriptu lze využít funkce
```javascript
Helpers.numberFormat(1234,2,',','.');
```
V tomto případě by byl výsledek 1,234.00

##Delay
Pro vyvolání určité funkce, za určitý čas můžeme využít delay
```javascript
Helpers.delay(callbackFunc, this, 500);
```
Prvním parametrem nastavujeme callback funkci, která se má za čas daný třetím parametrem spustit. 
Druhým parametrem určujeme kontext spuštení (např. 'this' uvnitř třídy) 

##Formátování cen
Pro jednotné formátování cen skrze systém lze použít
```javascript
Helpers.formatPrice(1234);
```
Výsledkem je potom 1 234

##Kopírování do schránky
Pro jednoduché zkopírování textu do schránky lze využít funkce
```javascript
Helpers.copyToClipboard('Text ke zkopírování');
```

##Posun data
Pro získání data posunutého o x dnů ode dnešního lze použít funkci
```javascript
Helpers.nextDate(15);
```

##Načítání ajaxu do určitého bloku
Funkce pro načtení dat z url a přidání o bloku
Funkce příjme url adresu, do jakého bloku se mají data vložit, jeslti se má hodit loading icona přímo do bloku, nebo globálně na celou obrazovku a funkci pro afterSuccess
```javascript
Helpers.ajaxToBlock(url, $('#'+element_id), true, false, () => {
    if(!editor.data.DaktelaTicketID)
        $('.custom-edit-button').hide();
});
```