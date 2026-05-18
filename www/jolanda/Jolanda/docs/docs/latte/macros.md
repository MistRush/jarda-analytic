#Latte makra
##Výpis proměnných a výrazů
|||
|-------|-------|
| `{$variable}` | [vypíše escapovanou proměnnou](https://latte.nette.org/cs/tags#toc-vypsani-promenne) |
| `{$variable|noescape}` | [vypíše proměnnou bez escapování](https://latte.nette.org/cs/tags#toc-vypsani-promenne) |
| `{expression}` | [vypíše escapovaný výraz](https://latte.nette.org/cs/tags#toc-vypsani-promenne) |
| `{=expression}` | [vypíše escapovaný výraz](https://latte.nette.org/cs/tags#toc-vypsani-promenne) |

&nbsp;
##Podmínky
|||
|-------|-------|
| `{if $cond} ... {elseif $cond} ...` `{else} ... {/if}` | [podmínka if](https://latte.nette.org/cs/tags#toc-podminky) |
| `{$cond ? $value1 : $value2}` | [ternární operátor](https://latte.nette.org/cs/tags#toc-podminky) |
| `{$cond ? $value}` | [zkrácený „ternární" operátor](https://latte.nette.org/cs/tags#toc-podminky) |
| `{$a ?: $default}` | vypíše `$a`, pokud je prázdné tak `$default` |
| `{ifset $var} ... {elseifset $var} ...` `{/ifset}` | [podmínka if (isset())](https://latte.nette.org/cs/tags#toc-podminky) |
| `{switch $var} ... {case value} ...` `{default} ... {/switch}` | [volba podle hodnoty](https://latte.nette.org/cs/tags#toc-podminky) |
| `{$obj?->prop}` `{$arr?['item']}` | různé formy [volitelného řetězení](https://latte.nette.org/cs/tags#toc-volitelne-retezeni) |

&nbsp;
##Cykly
|||
|-------|-------|
| `{foreach $arr as $item} ... {/foreach}` | [cyklus foreach](https://latte.nette.org/cs/tags#toc-cykly) |
| `{for expr; expr; expr} ... {/for}` | [cyklus for](https://latte.nette.org/cs/tags#toc-cykly) |
| `{while expr} ... {/while}` | [cyklus while](https://latte.nette.org/cs/tags#toc-cykly) |
| `{continueIf $cond}` | [podmíněný skok na další iteraci](https://latte.nette.org/cs/tags#toc-cykly) |
| `{breakIf $cond}` | [podmíněné ukončení cyklu](https://latte.nette.org/cs/tags#toc-cykly) |
| `{first [$mod]} ... {/first}` | [vypsat při prvním průchodu](https://latte.nette.org/cs/tags#toc-cykly) |
| `{last [$mod]} ... {/last}` | [vypsat při posledním průchodu](https://latte.nette.org/cs/tags#toc-cykly) |
| `{sep} ... {/sep}` | [separátor](https://latte.nette.org/cs/tags#toc-cykly) |

&nbsp;
##Proměnné
|||
|-------|-------|
| `{var $foo = value}` | [vytvoří proměnnou](https://latte.nette.org/cs/tags#toc-deklarace-promennych) |
| `{default $foo = value}` | [výchozí proměnnou pokud neexistuje](https://latte.nette.org/cs/tags#toc-deklarace-promennych) |
| `{capture $var} ... {/capture}` | [zachytí blok do proměnné](https://latte.nette.org/cs/tags#toc-zachytavani-do-promenne) |

&nbsp;
##Bloky, layouty, dědičnost šablon
|||
|-------|-------|
| `{block block}` | [definuje a hned vykreslí blok](https://latte.nette.org/cs/tags#toc-bloky) |
| `{define block}` | [definuje blok pro pozdější použití](https://latte.nette.org/cs/tags#toc-bloky) |
| `{include block}` | [vloží blok](https://latte.nette.org/cs/tags#toc-vkladani-bloku) |
| `{include 'file.latte'}` | [načte šablonu z dalšího souboru](https://latte.nette.org/cs/tags#toc-vlozeni-souboru) |
| `{import 'file.latte'}` | načte bloky z externí šablony |
| `{layout 'file.latte'}` | [určuje soubor s layoutem](https://latte.nette.org/cs/tags#toc-rozsirovani-a-dedicnost) |
| `{extends 'file.latte'}` | [alias pro `{layout}`](https://latte.nette.org/cs/tags#toc-rozsirovani-a-dedicnost) |
| `{ifset #block} ... {/ifset}` | [podmínka, zda existuje blok](https://latte.nette.org/cs/tags#toc-bloky) |

&nbsp;
##Typy
|||
|-------|-------|
| `{varType type $var}` | [deklaruje typ proměnné](https://latte.nette.org/cs/tags#toc-typy) |
| `{varPrint [all]}` | [navrhne typy proměnných](https://latte.nette.org/cs/tags#toc-typy) |
| `{templateType ClassName}` | [deklaruje typy proměnných podle třídy](https://latte.nette.org/cs/tags#toc-typy) |
| `{templatePrint}` | [navrhne třídu s typy proměnných](https://latte.nette.org/cs/tags#toc-typy) |

&nbsp;
##Ostatní
|||
|-------|-------|
| `{sandbox 'file.latte'}` | [načte šablonu v sandbox režimu](https://latte.nette.org/cs/tags#toc-vlozeni-souboru) |
| `{do expression}` | [vyhodnotí výraz, ale nevypíše](https://latte.nette.org/cs/tags#toc-vyhodnoceni-kodu) |
| `{* text komentáře *}` | komentář, bude odstraněn |
| `{l}` nebo `{r}` | vypíše znak { nebo } |
| `{syntax mode}` | [změna syntaxe za běhu](https://latte. nette.org/cs/tags#toc-zmena-syntaxe) |
| `{spaceless} ... {/spaceless}` | odstraní nadbytečné mezery, podobně jako filtr [strip](https://latte.nette.org/cs/filters#toc-strip) |
| `{contentType $type}` | [přepne escapování a pošle HTTP hlavičku](https://latte.nette.org/cs/tags#toc-hlavicka-contenttype) |
| `{debugbreak $cond}` | [umístí do kódu breakpoint](https://latte.nette.org/cs/tags#toc-break-point-debugbreak) |

&nbsp;
##Pomocníci HTML kodéra
|||
|-------|-------|
| `n:class` | [chytrý zápis HTML atributu class](https://latte.nette.org/cs/tags#toc-n-class) |
| `n:attr` | [chytrý zápis jakéhokoliv HTML atributu](https://latte.nette.org/cs/tags#toc-n-attr) |
| `n:ifcontent` | [Vynechá prázdný HTML tag](https://latte.nette.org/cs/tags#toc-n-ifcontent) |
| `n:tag-if` | Vynechá HTML tag, pokud je podmínka false |

&nbsp;

##Latte3

|                                   |                                                                                                                                     |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `{render $editor var: mujeditor}` | [Udělá {$editor->render} a var mujeditor = {$editor\|noescape}]                                                                     |
| `{editorVar mujEdtior}`           | [Nastaví proměnnou editoru a quickeditoru do proměnné var mujEdtior = edtior] |

