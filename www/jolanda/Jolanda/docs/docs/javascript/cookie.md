#Cookie
Pro správu cookies lze využít předpřipravené funkce
Pro nastavení
```javascript
Cookie.setValue('cookie_name', 'cookie_value', pocet_dni_do_expirace)
```
Pro získání
```javascript
Cookie.getValue('cookie_name');
```
Pokud není cookie definována, funkce vrací undefined