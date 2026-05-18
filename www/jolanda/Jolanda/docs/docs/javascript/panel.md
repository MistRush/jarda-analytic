#Panel
Panel slouží jako celoobrazovková náhrada dialogu.
##Úvod
Panel můžeme vytvořit pomocí JavaScriptu
```javascript
let panel = new Panel()
```

##Nastavení obsahu
Obsah můžeme do panelu dostat pomocí AJAXu s požadavkem na adresu s naformátovaným HTML.
```javascript
panel.showFromUrl('/default/url-s-obsahem', {parametr1:'1',...});
```
V tomto případě potom musí být HTML obsah formátován do definovaných bloků
```html
<div data-panel="title">Titulek panelu</div>

<div data-panel="buttons">
    Tlačítka s vlastníma akcema
    <button class="btn btn-success" onclick="vlastniAkce();">Vlastní akce</button>
</div>

<div data-panel="content">
    Obsah panelu
</div>
<div data-panel="footer">
    Prostor pro Javascript
    <script>
        function vlastniAkce() {
            ...
        }   
    </script>
</div>
```

Obsah lze také definovat manuálně v JS 

```javascript
panel.setTitle('Titulek');
panel.setContent('Obsah');
panel.setFooter('Prostor pro JS');
```

##Zobrazení/skrytí panelu
Pro zobrazení panelu stačí zavolat metodu `panel.show();`, pro zavření potom `panel.close();`

##Eventy
U panelu je také definováno několi eventů

|||
|------|------|
|onAfterHide|Vyvolán po zavření panelu|
|onAfterShow|Vyvolán po zobrazení panelu|
|onBeforeHide|Vyvolán před zavřením panelu|
|onBeforeShow|Vyvolán před otevřením panelu|

&nbsp;