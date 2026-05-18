#Dialog
## Úvod
Pomocí JS můžeme vytvořit dialogové okno.
```javascript
let dialog = new Dialog();
```

##Nastavení obsahu
Obsah lze nastavit buď pomocí AJAXového požadavku
```javascript
dialog.showFromUrl('/default/obsah-dialogu', {parametr1:'1',...}, true)
```
Třetím parametrem nastavujeme, zda jsou data připravena ve formátu JSON `{content: 'obsah', title: 'titulek', footer: 'paticka'}`

Nebo nám požadavek vrací pouze obsah.

Druhým způsobem je poté ruční nastavení obsahu

```javascript
dialog.content = 'obsah';
dialog.title = 'titulek';
dialog.footer = 'paticka';
```

##Výchozí tlačíka
Pro usnadnění práce lze nastavit zobrazení tlačítka pro porvzení
```javascript
dialog.enableConfirmButton();
```
Toto ve spdoní části dialogu zobrazí tlačítko pro potvrzení a při kliknutí vyvolá funkci confirm(), kterou je potřeba nadefinovat. 

Lze zobrazit také tlačítko pro zrušení dialogu.

Tlačítka mají data-dialog-id="id_aktualniho_dialogu" pro lepší identfikaci a také id="dialog_[id_aktualniho_dialogu]_[cancel/confirm]_button"

```javascript
dialog.enableCancelButton();
``` 

## Zobrazení / skrytí
Dialog lze zobrazit metodou `dialog.show();` a skrýt metodou `dialog.close();`

##Nastavení textu tlačítek
```javascript
dialog.confirmButtonText = 'Můj text';
dialog.cancelButtonText = 'Můj text';
``` 

##Nastavení šířky

Nastavení maximální šířky dialogu
```javascript
dialog.maxWidth = 1600;
``` 
