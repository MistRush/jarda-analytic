# Dokumentace jádra Jolanda

## Changelog
### [9.9.2024]
- přidáno nastavení limitů SqlDebuggerPanelu (viz [Instalace Tracy panelů](install/tracy))
### [22.12.2023]
- přidány latte typehinty (více na samostatné stránce)
### [6.12.2023]
- přidáno ->setEditable na comboBox a ajaxCombobox (dovoluje uživateli přidat vlastní položku do selectu)
### [28.11.2023]
- upraven select2 multiselect
- Radio button onChange (form.getInputObject('test').onChange = ...)
- editoru je teď možné přidat custom data pomocí php (addCustomData(string $key, $value), setCustomData(array $customData)). Data v formluáři mají při odesílání editoru větší prioritu!
- změna nastavení entity_id v editorech. Už ne nenastavuje při renderu, ale při konstruktoru editoru, takže při vytváření už je možné použít $editor->getEntityId() a podle toho poznat create/update
- JsLogger - js/php funkce pro logování javascriptových chyb z konzole na server (více na samostatnće stránce JsLogger - použití)
- připraveno pro Latte3
- nové makra render, editorVar pro Latte3
- setSelectWidth default '100%', předtím '165px', takže pokud někdo chce 165px musí si to zpézné nastavit
### [21.11.2023]
- Nové rozšíření pro Tracy a přesun rozšíření do Jolandy (viz [Instalace Tracy panelů](install/tracy))
  - SqlDebuggerPanel, RelationDebuggerPanel, RequestDebuggerPanel, ElasticaQueryDebuggerPanel, LattePanel
### [22.3.2023]
- přidán filter bar - jde vypnout u gridu ($grid->setUseFiltersBar(false)) (vypne se i ukládání do localStorage)
### [20.3.2023]
- dynamic block editor ($form->addDynamicBlockEditor($name, $defaultName, $enumDynamicInputsNames))
### [6.3.2023]
- tinyMce custom pasrams $baseParams['tiniMceCustomParams'] = [...]
- možnost posílát do hlavičky jestli he user přihlášený, pokud není reloadne se page u každého ajaxového požadavku (header('Logged: 0');)
### [20.2.2023]
- přidán timeBox (addTimeBox(string $name, ?string $label, $type = 'HMS', bool $required = false) - type [H => Hodiny, HM => Hodiny:Minuty, HMS => Hodiny:Minuty:Sekundy] ) 
- možnost přidávat vlastní inputy do filterFormu gridu ($grid->getFilterForm(), nebo $grid->getFilterFormGroup())
### [13.2.2023]
- přidány presety do DB (více Grid -> možnosti)
### [18.1.2023]
- možnost řešit si sám rowReorder (druhý parametr $grid->setReorderColumn custom true/false - def = false)
### [13.1.2023]
- každý input má vlastní třídu (form.getInputObject('InputName'))
- možnost vypnout colReorder a zároveň i colResize u gridu ($grid->setColumnReorder(false);)
### [5.1.2023]
- přidaný COLUMN_COUNTER do gridu
- přidána možnost pomocí alt+click zkopírovat buňku gridu do schránky
### [13.12.2022]
- možnost nastavit inline edit jako ajaxSelect (více v sekci Sloupce -> Inline editace)
### [12.12.2022]
- přidaný counter k Prev/Next tlačítkům u editoru
- přidáno onBeforeShowCreateEditor (pokud funkce vráti false, tak se edior ani neotevře)
- oprava zavírání editoru pokud byl upraven
### [8.12.2022]
- možnost nastavit v gridu createDefaultValues (object {input_name: value}), které při přidávání předvyplní dané inputy
### [23.11.2022]
- opravena změna url při předchozí/další a při použítí editor cache
- přidána do menu aktuální verze gitu a poslední commit
- upravené next/prev butotny
- focus při kliknutí na select2 do search inputu
- 5. parametr konstruktoru gridu zakazuje, nebo povoluje export gridu do csv/pdf (defaultně je zapnutý)
- oprava filtrů v quickeditoru a entity editoru
### [21.11.2022]
- přidánoa možnost zavírat dialogy klávesou escape
### [17.11.2022]
- do funcke onAfterConfirm v EntityEditoru přidaný druhý parametr closePanel (true, pokud se editor zavře, false pokud se pokračuje dál)
- dokumentace k formulářovým šablonám
- přidáno možnost mazat itemvy z gridu klávesou delete
### [7.11.2022]
- Přidána možnost do entity editoru přidat Header a Footer taby, které jsou vždy vidět $editor->addHeaderTab()
### [20.10.2022]
- Možnost zadat data do gridu přes asociativní pole. (funkce setAjax(false) a setData($data))
### [5.10.2022]
- Přidána možnost u gridu nastavit, jestli půjde editovat i když není vybraný parentGrid $product->oneMustBeSelected(false);
- V gridu s multiselectem lze přidávat řádky přes ctrl+klik a shift+click
- V editoru je možné schovávat taby - je nutné v php přidat jako druhý parametr tabu id a pak v js přes toto id tab schovat pomocí showTab, hideTab
- V editoru lze vypnout render tlačítek pro save $editor->showSaveButtons(false)
- Enter v textarea už neuloží editor, ale vytvoří nový řádek
### [16.9.2022]
- Přidána možnost zapnou náhled obrázku u file inputu (čtvrtý parametr funkce addFileBox [true/false], pátý parametr je pak cesta k souboru (končí lomítkem))
- Přidána možnost přidávat html do formuláře. ($form->addHtml())
- Do editoru lze teď přidávat tagy, které se načtou stejně jako data do inputů (atribut [column="nazevSloupceZDataListManageru"])
- Přidání gridu do quickeditoru (mělo by by´t stejné jako v EntityEditoru)
- Trochu předělané dialogy, kvůli možnosti mít otevřených najednou více dialogů (na funkčnost a používání by ale neměl být vliv)
- Možnost vypnout tlačítka u gridu (refresh, filtry, sloupce, presety) (funkce ->disableControls())
- Sloupec 'Akce' v gridu se už nezobrazuje, pokud grid žádnou akci nemá
- Fix grid presety
- Přidání správného načítání ajax boxů (dříve se při editu vždy dávalo do boxu ID jako null)
- Fix reinitu BlockEditoru (dříve zůstával content uložený i při znovuvytvoření BlockEditoru)
- Fix parent gridy pro multiselect
- Optimalizace initu select2 a tinymce
- Možnost nastavit, že grid je závislý na dalším gridu pomocí více relací
- Možnost nastavit maximální šířku dialogu (dialog.maxWidth = 1600)
- Možnost u gridu nastavit, jak velký dialog s quickeditorem bude ($grid->setQuickeditMaxWidth(1600))
### [20.7.2022]
- přidaná možnost přidat checkbox k vyhledávání (třetí parametr funkce enableSearch) (pošle do manageru urlParametr SearchBy)
### [18.7.2022]
- status manager už funguje i pro delete
### [6.7.2022]
- fontAwesome 5.15 -> 6.1
- u reordable cursor + graficke znázornění
- u treeView callback pro změnu pozice
### [5.7.2022]
- Přidán export gridu do csv/pdf (v kontextovém menu gridu)
### [17.6.2022]
- Upravení (sub)gridu aby mohl data ukládat jen lokálně a odeslat až s uložením editoru. (nove js funkce addRow, deleteRow, updateRow, getRowByUniqueKeyValue)
- Možnost řadit tree filter
- Relation switcher (un)selectAll
### [1.6.2022]
- Přidané tlačítka next/prev do nacachovaného entity editory (kvůli tomu vytvořená classa Iterator)
- Přidána nová js classa Iterator (umí dynamicky načítat nové položky do iterátoru, více v samostatné sekci javasrcipt/Iterator)
### [30.5.2022]
- Možnost přidat optiony do ajaxComboBoxu (`$group->addAjaxComboBoxStore('Test', 'Test', ['module' => 'admin', 'controller' => 'supplier'], 'Name')->enableDynamicAddingOptions('admin/product/supplier-q-editor')`)
### [27.5.2022]
- Možnost otvírat entityEditor v gridu kolečkem (otevře nový tab)
### [24.5.2022]
- Přidána možnost u gridu vypnout infinite scrolling a použít místo toho klasický paging (`$grid->setInfiniteScroll(false);`)
- U gridu lze nastavit kolik řádků má načítat (v php `$grid->setDisplayBuffer(25);`, čím menší hodnota, tím méně řádků načtě, ale neodpovídá 1:1 zadané hodnotě (25 - default - načte asi 225 řádků - záleží na rozlišení obrazovky))
- RealitonSwitcher už funguje s cachováním editoru
### [19.5.2022]
- Destroy entityEditor objectů při zavření editoru kvůli optimalizace paměti
- Možnso zapnout u gridu chachování editoru (pouze pro úpravu, načte ajaxově editor pouze jednou, pak už načítá jen data)
- Do Helpers přidána funkce ajaxToBlock, která načtě ajaxové data z url do html bloku a má možnost do boku před načtení vložit i načítací ikonu
- Pokud se lockne obrazovka pro ajaxové požadavky, počká se až se všechny lockuté dokončí (předtím nejdříve hotový automaticky odlocknul)
### [17.5.2022]
- Přidána funcke isEdited v editoru (vrací jestli nějaká hodnota byla změněna)
- Pokud byl editor editován, vyskočí před zavřením okna varovná hláška
### [28.4.2022]
- Přidaná možnost globálně vybírat data v gridu ze všech dat (v php nastavení `SELECT_MULTI_TYPE_ALL`, vs pak getSelectedRows())
### [19.4.2022]
- Úprava inline editoru (vzhledově, možnost nastavit url pro inline editor)
- Možnost nastavit si vlastní url pro update/list/delete/create
### [8.4.2022]
- Pro checkbox select v gridu přidán do hlavičky checkbox pro výběr všech záznamů + nová možnost `SELECT_MULTI_CHECKBOX_REVERSE`, který při výběru všeho udělá revers
### [7.4.2022]
- Příprava na Latte3, přepsání maker atd. (dál funguje i Latte2)
- Úprava parent gridů. Nyní je možné vázat grid na více jak jeden sloupec a taky na více gridů z více dalších gridů. (např ID z Menu a ID z Eshopu do MenuItemu)
### [11.3.2022]
- Zprovoznění rowReorderu
- Možnost v dialogu měnit text výchozích tlačítek
- Tlačítka (cancel/confirm) v dialugu mají své id id="dialog_[id_aktualniho_dialogu]_[cancel/confirm]_button" a taky data-dialog-id="id_aktualniho_dialogu"
- U dialogů, quickeditorů a editorů se po stisknutí klávesy enter se zavolá funkce confirm (dříve se posílal post request)
### [3.3.2022]
- Zplešení multiFileUploadu, nová možnost přidat _$options_ (více v sekci 'formulářové prvky')
- Funkce pro získání jména gridu getName() (stejná hodnota jako id bez '_datagrid')
### [2.3.2022]
- Aktualizace datagridu
- Lepší scrolling gridu
- Presety v gridu
- Reorder sloupců v gridu
### [14.2.2022]
- Dynamciké bloky v BlockEditoru (bloky, které se vytvářejí dynamicky při načtení stránky) (více v sekci 'formulářové prvky -> BlockEditor')
### [9.2.2022] 
- Jolanda jako submodul včetně php části
- Přidán BlockManager (více v sekci 'Formulářové prvky')
- Přidání StatusManageru (více v samostatné sekci 'StatusManager')
- Předělání AjaxComboBoxStore (už funguje opravdu ajaxově, posílá q parametr do ajax požadavku, více v sekci 'formulářové prvky')
- Přidán changelog do dokumentace
- Přidán manuál pro přidání submodulu do projektu
- [Fix] velikost comboBoxStore a ajaxComboBoxStore (nová funkce setSelectWidth()) - ve switchFormu gridu je potřeba nastavit správě velikost!
- [Fix] rozšiřování sloupců
- [Fix] zobrazování nápovědy ve formuláři když je input disabled
- [Fix] subGrid se po změně parent gridu načíta pouze jednou (dělá se pouze 1 ajax požadavek)
- [Fix] upload obrázků
- [Fix] další drobné úpravy/opravy