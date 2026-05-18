#JavaScript API
##Metody
###add()
Vyvolává Entity Editor pro tvorbu nové entity.
###copyFilterUrl()
Kopíruje URL s předfiltrovanými daty do schránky
###copyRowToCSV()
Kopíruje data aktuálně vybraného řádku jako CSV do schránky.
###edit()
Vyvolává Entity Editor pro úpravu právě vybrané entity.
###formatFilterUrl()
Vrací URL parametry pro předfiltrování dat pomocí URL
###getColumnList()
Vrací pole objektů všech sloupce. Každý objekt obsahuje název sloupce z manageru, popisek, je-li editovatelný, a případně enumerační hodnoty.
###getCurrentItem()
Vrací objekt nebo pole objektů s daty aktuálně vybraného / vybraných řádků. 
###getCurrentItemValue(string column)
Vrací hodnotu v daném sloupci v aktuálně vybraném řádku. 
###getCurrentItemIndex()
Vrací index nebo pole indexů aktuálně vybraného / vybraných řádků.
###getItemCount()
Vrací celkový počet řádků v Gridu.
###getParentGrid()
Vrací rodičovský Grid.
###getRowByIndex(int index)
Vrací řádek (DataTables.Row) podle indexu.
###getSelectedCount()
Vrací počet aktuálně vybraných řádků.
###refresh()
Aktualizuje Grid.
###remove()
Provede smazání aktuálně vybraných řádků.
###resetFilter()
Resetuje nastavené filtry včetně formulářových  prvků v dialogu pro filtrování.
###selectRowBy(string column, string value)
Vybere řádek dle hodnoty value ve sloupci column.
###setUrlParameter(string parameter, anything value)
Nastavuje URL parametr pro Clevis Manager. Vhodné pro filtrování hodnot.
###unsetUrlParameter(strint parameter)
Odstraňuje filtrační URL parametr.
###getSelectedRows()
Vráci globálně vybrané řádky jako array (Musí být nasteveny Grid::SELECT_MULTI_TYPE_ALL)
###addRow(data, refresh = true)
Přidá řádek do Gridu.
###getRowByUniqueKeyValue(key, value)
Vrátí řádek s danou hodnotou unikátního klíče.
###updateRow(row, data)
Aktualizuje řádek. Do row se vlkádá objekt row z datagridu
###deleteRow(row)
Smazá řádek. Row je objekt row z datagridu
###deleteRow(row)
Smazá řádek. Row je objekt row z datagridu
###deleteAll()
Odstraní všechny řádky
###setCounter()
Nastaví počitadlo na vlastní hodnotu
##Členové
###grid
(DataTables) Přístup k API DataTables daného gridu
###element
(selector) DOM element tabulky
###childGrid
(Grid) Potomek gridu, je li zapnut
###filterForm
(Form) Filtrační formulář
###parentGrid
(Grid) Rodičovský grid, je li zapnut
###relationswitcher
(Relation Switcher) Relation switcher, je li zapnut
###urlParameters
(object) Aktuálně nastavené URL parametry (filtry)
##Eventy
###onAfterInlineChange(column, value, entity_id)
Vyvolán po dokončení inline editace nebo změny boolean sloupce pomocí checkboxu 
###onAfterRefresh
Vyvolán po úspěšněm dokončení aktualizace Gridu.
###onBeforeRefresh
Vyvolán před zahájením aktualizace Gridu.
###onSelect(event e, integer|array indexes)
Vyvolán při výběru řádků. Parametry jsou JSEvent a index aktuálně vybraného řádku.
###onCurrentItemUnSelect(event e)
Vyvolán při zrušení výběru řádku.
###onUnSelect(event e, integer|array indexes)
Vyvolán pokud je aktivní řádek zneaktivněn. Parametry jsou JSEvent a index aktuálně vybraného řádku.
###onDblClick
Nastavení vlastního callbacku na doubleclick. Pouze pokud entitu nelze editovat
