#Obecná práce se šablonami
Šablony zde využívají šablonovacího jazyka Latte.
##Základní struktura
Základní struktura šablony pro vykreslení stránky dědí z šablony layout.latte a obsah se plní do jednotlivých definovatelných bloků.
```latte
{layout "../layout.latte"}

{block title}
    Obsah titulku stránky
{/block}

{block content}
    Hlavní obsah
{/block}

{block scripts}
    <script>
        // JavaScriptový obsah, který je vždy doplněn do spodní části stránky, aby bylo možné využít všech importovaných knihoven apod.
    </script>
{/block}
```

##Vlastní makra
###n:href
Makro generující interní odkaz dle cesty. Pro příklad se nacházíme na stránce /default/feedback/index

|makro|výsledek|
|---------|-----------|
|n:href=
|n:href="archive"|/default/feedback/archive|
|n:href="users:index"|/default/users/index|
|n:href="admin:order:cart"|/admin/order/cart|
|n:href="archive id=5,text=abc"|/default/feedback/archive?id=5&text=abc|

&nbsp;
###dialog
Makro generující dialogové okno.
```latte
{dialog 'dialog_id', 'Název dialogu'}
 Obsah dialogového okna
{/dialog}
```

Pomocí JS poté můžeme dialog vyvolat

```javascript
$("#dialog_id").modal();
```

###lang
Makro pro výpis překladu z Clevis_Lang
```latte
{lang KONSTANTA_Z_LANG}
```

⚠ Text není escapovaný

###_()
Makro pro výpis z PO překladu
```latte
{_('Text k překladu (výchozí CZ)')}
```
