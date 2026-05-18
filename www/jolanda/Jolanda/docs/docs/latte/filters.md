#Latte filtry

V šablonách můžeme používat funkce, které pomáhají upravit nebo přeformátovat data do výsledné podoby. Říkáme jim *filtry*.

##Transformace řetězců nebo polí

|filtr|popis|
|---------|-----------|
| `truncate` `(length, append = '...')` | [zkrátí délku se zachováním slov](https://latte.nette.org/cs/filters#toc-truncate) |
| `substr` `(offset [, length])` | vrátí část řetězce |
| `trim` `(charset = mezery)` | odstraní počáteční a koncové mezery či jiné znaky |
| `stripHtml` | odstraní HTML značky a HTML entity převede na znaky |
| `strip` | [odstraní bílé místo](https://latte.nette.org/cs/filters#toc-strip), podobně jako značka [spaceless](https://latte.nette.org/cs/tags) |
| `indent` `(level = 1, char = "\t")` | [odsadí text zleva o daný počet tabulátorů](https://latte.nette.org/cs/filters#toc-indent) |
| `replace` `(search, replace = '')` | zamění výskyty hledaného řetězce |
| `replaceRE` `(pattern, replace = '')` | zamění výskyty dle regulárního výrazu |
| `padLeft` `(length, pad = ' ')` | doplní řetězec zleva na požadovanou délku |
| `padRight` `(length, pad = ' ')` | doplní řetězec zprava na požadovanou délku |
| `repeat` `(count)` | opakování řetězce |
| `implode` `(glue = '')` | spojí pole do řetězce |
| `webalize` | [upraví UTF-8 řetězec do tvaru používaného v URL](https://latte.nette.org/cs/filters#toc-webalize) |
| `breakLines` | [Před konce řádku přidá HTML odřádkování](https://latte.nette.org/cs/filters#toc-breaklines) |
| `reverse` | [obrátí UTF-8 řetězec nebo pole](https://latte.nette.org/cs/filters#toc-reverse) |
| `length` | vrací délku řetězce ve znacích nebo pole |
| `batch` `(array, length [, item])` | [výpis lineárních dat do tabulky](https://latte.nette.org/cs/filters#toc-batch) |

&nbsp;
##Velikost písmen

|filtr|popis|
|---------|-----------|
| `lower` | [převede na malá písmenka](https://latte.nette.org/cs/filters#toc-velikost-pismen) |
| `upper` | [převede na velká písmenka](https://latte.nette.org/cs/filters#toc-velikost-pismen) |
| `firstUpper` | [převede první písmenko na velké](https://latte.nette.org/cs/filters#toc-velikost-pismen) |
| `capitalize` | [malá písmena, první písmeno ve slovech velké](https://latte.nette.org/cs/filters#toc-velikost-pismen) |

&nbsp;
##Formátování hodnot

|filtr|popis|
|---------|-----------|
| `date` `(format)` | [formátuje datum](https://latte.nette.org/cs/filters#toc-date) |
| `number` `(decimals = 0, decPoint = '.')` | [formátuje číslo](https://latte.nette.org/cs/filters#toc-number) |
| `bytes` `(precision = 2)` | [formátuje velikost v bajtech](https://latte.nette.org/cs/filters#toc-bytes) |
| `dataStream` `(mimetype = detect)` | [konverze pro Data URI protokol](https://latte.nette.org/cs/filters#toc-datastream) |

&nbsp;
##Escapování

|filtr|popis|
|---------|-----------|
| `noescape` | [vypíše proměnnou bez escapování](https://latte.nette.org/cs/tags#toc-vypsani-promenne) |
| `escapeUrl` | [escapuje parametr v URL](https://latte.nette.org/cs/filters#toc-escapeurl) |


&nbsp;
##Použití

Filtry se zapisují za svislítko (může být před ním mezera) do tzv. modifikátoru:

```
<h1>{$heading|upper}</h1>

```

Filtry (ve starších verzích helpery) lze zřetězit a poté se aplikují v pořadí od levého k pravému:

```
<h1>{$heading|lower|capitalize}</h1>

```

Parametry se zadávají za jménem filtru oddělené dvojtečkami nebo čárkami:

```
<h1>{$heading|truncate:20,''}</h1>

```

Filtry lze aplikovat i na výraz:

```
{var $name = ($title|upper) . ($subtitle|lower)}</h1>

```

Jako filtr lze do šablony zaregistrovat libovolný callback:

```
$latte = new Latte\Engine;
$latte->addFilter('shortify', function (string $s, int $len = 10): string {
	return mb_substr($s, 0, $len);
});

```



V šabloně se potom volá takto:

```
<p>{$text|shortify}</p>
<p>{$text|shortify:100}</p>

```


##Jednotlivé filtry
###truncate[?](https://latte.nette.org/cs/filters#toc-truncate)

Ořízne řetězec na uvedenou maximální délku, přičemž se snaží zachovávat celá slova. Pokud dojde ke zkrácení řetězce, přidá nakonec trojtečku (lze změnit druhým parametrem).

```
{var $title = 'Řekněte, jak se máte?'}
{$title|truncate:5} Řekn...
{$title|truncate:20} Řekněte, jak se...
{$title|truncate:30} Řekněte, jak se máte?

```



###strip[?](https://latte.nette.org/cs/filters#toc-strip)

Odstraní zbytečné bílé místo (mezery) z výstupu.

```
{block |strip}
	<ul>
		<li>Hello</li>
	</ul>
{/block}

```



Vygeneruje

```
<ul> <li>Hello</li> </ul>

```



###indent[?](https://latte.nette.org/cs/filters#toc-indent)

Odsadí text zleva o daný počet tabulátorů nebo jiných znaků, které můžeme uvést ve druhém argumentu:

```
<div>
{block |indent}
<p>Hello</p>
{/block}
</div>

```



Vygeneruje

```
<div>
	<p>Hello</p>
</div>

```



###webalize[?](https://latte.nette.org/cs/filters#toc-webalize)

Filtr odstraní diakritiku a všechny znaky kromě písmen anglické abecedy a číslic nahradí spojovníkem. Vyžaduje instalaci [nette/utils](https://api.nette.org/2.4/Nette/Utils.html).

```
{var $s = 'Náš 10. produkt'}
{$s|webalize} nas-10-produkt

```



###breakLines[?](https://latte.nette.org/cs/filters#toc-breaklines)

Přidává před každý znak nového řádku HTML značku `<br>`. Vstupní text je automaticky escapován.

```
{var $s = "Text & with \n newline"}
{$s|breakLines} "Text &amp; with <br>\n newline"

```



###reverse[?](https://latte.nette.org/cs/filters#toc-reverse)

```
{var $s = 'Nette'}
{$s|reverse} etteN
{var $a = ['N', 'e', 't', 't', 'e']}
{$a|reverse} ['e', 't', 't', 'e', 'N']

```



###Velikost písmen[?](https://latte.nette.org/cs/filters#toc-velikost-pismen)

```
{var $s = 'dobrý DEN'}
{$s|lower} dobrý den
{$s|upper} DOBRÝ DEN
{$s|firstUpper} Dobrý DEN
{$s|capitalize} Dobrý Den

```



###date[?](https://latte.nette.org/cs/filters#toc-date)

Formátuje datum podle masky buď ve tvaru používaném PHP funkcí [strftime](https://php.net/strftime) nebo [date](https://php.net/date). Filtr přijímá datum buď ve formátu UNIX timestamp, v podobě řetězce nebo jako objekt `DateTime`.

```
{$today|date:'%d.%m.%Y'}
{$today|date:'j. n. Y'}

```



###number[?](https://latte.nette.org/cs/filters#toc-number)

Formátuje číslo na určitý počet desetinných míst. Lze určit znak pro desetinnou čárku a oddělovač tisíců.

```
{1234.20 |number}  1,234
{1234.20 |number:1}  1,234.2
{1234.20 |number:2}  1,234.20
{1234.20 |number:2:',':' '}  1 234,20

```



###bytes[?](https://latte.nette.org/cs/filters#toc-bytes)

Formátuje velikost v bajtech do lidsky čitelné podoby.

```
{$size|bytes} 0 B, 10 B nebo 1.25 GB, ...

```



###dataStream[?](https://latte.nette.org/cs/filters#toc-datastream)

Konvertuje do data URI scheme. Pomocí něj lze do HTML nebo CSS vkládat obrázky bez nutnosti linkovat externí soubory. Podporují jej všechny moderní prohlížeče. Vyžaduje PHP rozšíření [fileinfo](http://php.net/manual/en/fileinfo.installation.php).

Mějme v proměnné obrázek `$img = Image::fromFile('obrazek.gif')`, poté

```
<img src="{$img|dataStream}">

```



Vygeneruje například:

```
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA
AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
9TXL0Y4OHwAAAABJRU5ErkJggg==">

```



###batch[?](https://latte.nette.org/cs/filters#toc-batch)

Zjednodušuje výpis lineárních dat do podoby tabulky. Prvním parametrem je počet sloupců, druhým (volitelným) doplňková hodnota, kterou se zarovná poslední řádek.

```
{var $items = ['a', 'b', 'c', 'd', 'e', 'f', 'g']}
<table>
{foreach ($items|batch:3:'No item') as $row}
    <tr>
        {foreach $row as $column}
            <td>{$column}</td>
        {/foreach}
    </tr>
{/foreach}
</table>

```



vygeneruje:

```
<table>
    <tr>
        <td>a</td>
        <td>b</td>
        <td>c</td>
    </tr>
    <tr>
        <td>d</td>
        <td>e</td>
        <td>f</td>
    </tr>
    <tr>
        <td>g</td>
        <td>No item</td>
        <td>No item</td>
    </tr>
</table>

```



###escapeUrl[?](https://latte.nette.org/cs/filters#toc-escapeurl)

Escapuje proměnnou pro použítí jakožto parametru v URL.

```
<a href="http://example.com/{$name|escapeUrl}">{$name}</a>

```

