#JavaScript API
##Metody
###getInput(_string_ input_name)
Vrací jQuery selector inputu.
###getValue(_string_ input_name)
Vrací hodnotu inputu.
###getSelectValue(_string_ input_name)
Vrací pole objektů s hodnotou a textem vybraných položek select boxu.
###reset()
Resetuje formulář do výchozích hodnot.
###serializeArrayEntity()
Vrací naformátovaný objekt vhodný pro odeslání do Clevis Manageru.
###setDisabled(_string_ input_name, _bool_ disabled = true)
Nastavuje konkretnímu inputu možnost zápisu (readonly). 
###setValue(_string_ input_name, _mixed_ value)
Nastavuje inputu hodnotu.
###validate()
Provede validaci formuláře. Vrací bool hodnotu zda-li validace prošla.

##Eventy
###onSuccess(_anything_ data, _string_ textStatus, jqXHR jqXHR)
Vyvolán v případě úspěšného odeslání a zpracování serverem.

Prvním parametrem jsou data vrácena v odpovědi.

Událost je volána pouze v případě že je formulář odeslán pomocí AJAXu.

###onError(_jqXHR_ jqXHR, _string_ textStatus, _string_ errorThrown) 
Vyvolán v případě, že server požadavek zpracuje s chybou.

Událost je volána pouze v případě že je formulář odeslán pomocí AJAXu.

###onBeforeSubmit()
Vyvolán před validací a samotným odesláním formuláře.


###getInputObject(name)
Vrátí object inputu který implementuje funkcionality pro daný input jako getValue, setValue, setRequired a další i specifické věci pro každý input.