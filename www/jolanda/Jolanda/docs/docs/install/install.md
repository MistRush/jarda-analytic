# Instalace submodulu
## Instalace
1) Smazání složky www/core a library/Jolanda
 
2) V rootu gitu projektu přidáme submodul
 
   - git submodule add git@bitbucket.org:itremante/jolanda.git ./www/jolanda
 
3) git pull (musí se udělat i na produkčním serveru)
 
4) git submodule update --init (musí se udělat i na produkčním serveru)
 
5) V adresáří www/jolanda - git checkout master (musí se udělat i na produkčním serveru)

   - Pokud se v phpstormu nezobrazuje submodul jolandy je potřeba vypnout a zapnout phpstorm
 
6) V composeru nastavíme novou cestu k php části Jolandy
```php
"Jolanda\\": ["library/Jolanda"] => "Jolanda\\": ["www/jolanda/Jolanda"]
``` 
7) composer update, nebo install
 
8) Úprava gruntfilu projektu. Odstranění všech návazností na corePath.

   - Gruntfile projektu by neměl nijak pracovat se soubory jolandy. (jolanda má vlastní gruntfile)
   
   - Nestavení správných cest (dříve www/core, teď www/jolanda/front)
   
   - Po úpravě zkusit spustit grunt a podívat se jestli project soubory se vytvářejí a linkují správně a že nezasahují do souborů jolandy.
   
   - Pokud se vytvářejí/linkují špatně, tak řešit na úrovni project gruntu, nebo ve vlastních šablonách projektu. Neupravovat nic v souborech jolandy!
 
9) Otestovat

## Inicializace submodulu
Pokud už nějaký projekt má submodul rozjetý a někdo jiný si rozjede danou branch je třeba stáhnou soubory z gitu submodulu

git submodule update --init