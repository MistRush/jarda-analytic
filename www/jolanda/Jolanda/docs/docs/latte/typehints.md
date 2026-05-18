#Typehint šablony
Slouží pro napovídání typů proměnných v šablonách. Výhodou je, že se typy automaticky odvozují z proměnných v šabloně, takže není potřeba je explicitně uvádět.

Při zapnutí generování typehint tříd, generátor vytvoří třídu ...ParamsTemplate ve složce paramsTemplate, která se nachází vždy tam, kde se nachází i renderovaný latte soubor. 


##Nastavení

V Administraci je již nastavení typehintu nastavené na úrovni Jolandy. Musí se jen přidat někde do kódu 
```php
ParamsTemplate::$ALLOW = true;
```

V ostaních modulech se musíme nastavit logiku pro generování typehint tříd. Před render latte vložíme tento kód. Vložíme to ještě předtím než se params zmergují s baseParams.

```php
        ParamsTemplate::$ALLOW = true; //Zapne vytváření typehint tříd
        ParamsTemplate::$EXTEND_CLASS = 'default\views\BaseParamsTemplate'; //Nastaví třídu, která se bude dědit
        ParamsTemplate::$BACKTRACE_LVL = 5; //Nastaví hloubku backtrace více v samostatné sekci níže

        ParamsTemplate::analyzeParamsTypes($this->latte, $params, $this->getRequest(), __DIR__ . "/../views/", $latte);
```

###Základní nastavení

####ParamsTemplate::$ALLOW

Zapne/vypne generování tříd
Defaultně je nastaveno na false


####ParamsTemplate::$EXTEND_CLASS

Nastaví jakou třídu budou vygenerované třídy extendovat. Třídu si musíme vytvořit ručné a nastavi ji do ParamsTemplate. (není povinné, jen se pak nebudou zobrazovat baseParams)

Defaultně je nastaveno na null


####ParamsTemplate::$BACKTRACE_LVL

Nastaví hloubku backtrace. V podstatě musíme nastavit o kolik metod má jít třída pro generování typehintů do historie, aby měla správnou metodu kterou chceme analyzovat. Minimální hodnota, kterou generovací třída potřebuje je 4 (v případé že budeme generovat přímo z metody kterou chceme analyzovat). Pokud máme metodu renderLatte ve které voláme generování typehintů, v tom případě musíme backtracelvl zvednout na 5 atd.

Defaultně je nastaveno na null, je to povinný parametr


####ParamsTemplate::$ALLOW_STATIC_ANALYSIS

Zapne/vypne statickou analýzu proměnných.

Defaultně je nastaveno na true

Dulžité je, aby fungovala statická analýza, musí být renderLatte funkce zavolána v kontextu toho kde se deklarují proměnné do této funkce. Taky nemůžeme předávat pole jako parametr do této funkce, ale musíme si vytvořit proměnnou, do které přiřadíme parametr a tuto proménou pak přidat do této funkce.

```php
        $test = self::getTest() ?? self::getAsdf();

        $this->renderLatte(['asdf' => $test]); //špatné, nebude fungovat statická analýza. Detekuje se pouze typ, který bude předaný do této funkce


        $params = [
            'test' => $test
        ];
        $this->renderLatte($params); //správně, teď bude fungovat statická analýza a detekují se obě returnové hodnoty obou funkci getTest a getAsdf
```


####ParamsTemplate::$ALWAYS_REBUILD

Nastaví jestli se má celá třída vždy sestavit celá znovu, nebo jestli má jen přidávat nové typy k již existujícím.

Defaultně je nastaveno na false


####ParamsTemplate::$SAVE_TO_FILE

Zapne/vypne ukládání vygenerované třídy do souboru.
Defaultně je nastaveno na true


####ParamsTemplate::$ADD_MAKRO_TO_TEMPLATE

Zapne/vypne jestli se má do latte souboru automaticky vložit makro, které zapne typehinty pro šablonu.

Defaultně je nastaveno na true


##TracyBar

Typehinty mají vlastní panel v tracybaru. 

V panelu jsou zobrazené všechny typehinty které aktuální šablona použivá.

Taky obsahuje dvět tlačítka.

ADD tlačítko - zavolá ajax, který spusti generovaní typehint třídy a přidá pouze nové typy k již existující šabloně

FORCE tlačítko - zavolá ajax, který spusti generovaní typehint třídy a přepíše celou třídu znovu


Momentálně se typehinty generují jen pomocí těchto dvou tlačítek. Ale je možné si sám napsat logiku takovou, která například bude generovat typehinty pokaždé při načtení stránky.







