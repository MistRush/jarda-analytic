#Iterátor

Tato třída je v podstatě klasický iterátor kterým lze procházet prvky dopředu a dozadu. Hlavní přidaná hodnota je, že si umí pomocí ajaxů dodatečně načítat prvky do iterátoru. 

Využito například v nacachovaném entityEditoru pro next/prev button. Vytvoří se tam nejdříve iterátor, který má pouze (počet prvků = počet načtených řádků gridu) prvků. Když pak iterátor narazí na hodnotu, která ještě není načtena, načte si dalších xyz prvků a tak až do konce.

Pokud nemá zadané url odkud má data brát, chová se jako klasický iterátor pouze z prvků, které se mu na začátku vloží.

//Zatím umí načítat data pouze pokud je vrací ve formatu clevis data manageru
//Zatím načítá pouze sloupec ID z jsonu co vrací clevis data manager, v budoucnu dodělám nějaké callbacky pro customizaci 

##Vytvoření iterátoru

Do iterátoru pošleme 

- pole prvku
- startovací index
- celkový počet prvků
- offset od začátku (pokud pole prvků není začátek (například data z půlky gridu))
- url odkud má brát další data a parametry (v parametrech by mělo být aspoň count a start (grid už tyto parametry má v urlParameters)) (když není nastavené, chová se jako klasický iterátor pouze ze zadaných prvků)

```javascript
let iterator = new Iterator(this.grid.data().map((e) => {return e.ID}).toArray(), this.getCurrentItemIndex(), parseInt(this.range.total), grid.range.from,  {
    params: this.urlParameters,
    url: this.params.urls.datalistUrl,
});
```

##setItems
Nastaví itemy pro iterátor a smaže původní

##setCurrentIndex
Nastaví aktuální index na požadovanou hodnotu, znova načte všechny data (polovinu z parametru count na každou stranu, jeli to možné a jestli je nastavená url pro ziskání dat)

##appendItems
přidá itemy na konec

##prependItems
přidá itemy na záčatek

##getAbsoluteIndex
vrátí absolutní index (+ offset)

##getRelativeIndex
vrátí relativní index bez offsetu

##next
vrátí další prvek v řadě a posune index o 1, při neúspěchu vrací false

##prev
vrátí předchozí prvek v řadě a sníží index o 1, při neúspěchu vrací false

##current
vrací aktuální prvek v řadě, při neúspěchu vrací false

##getItemsLastIndex
vratí poslední načtený index

##getItemsFirstIndex
vratí první načtený index

##hasNext
vratí true/false jestli má řada další prvek (je na konci řady)

##hasPrev
vratí true/false jestli má řada další prvek (je na začátku řady)