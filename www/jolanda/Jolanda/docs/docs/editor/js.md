#JavaScript API
##Metody
###confirm(bool close_panel)
Potvrdí a odešle data z editoru. Parametrem určujeme, zda má být aktivní panel zavřen.
###isEditing()
Vrací true pokud je editor v režimu úpravy entity, false pokud se entita vytváří.
###loadData()
Znovu načte veškeré data do formulářů (reset všech polí na původní hodnoty)
##Eventy
###onAfterConfirm()
Vyvolán po odeslání (uložení) dat z editoru 
první parametr data
druhý parametr closePanel (true, pokud se editor zavře, false pokud se pokračuje dál)
###onAfterLoad()
Vyvolán po načtení dat do editoru
###onAfterShow()
Vyvolán po zobrazení editoru.
###onBeforeConfirm()
Vyvolán před odesláním (uložením) dat z editoru
###onBeforeLoad()
Vyvolán před načtením dat do editoru
##Členové
###data
(object) Objekt s načtenými daty z manageru do editoru
###editor
(DOM element) Element editoru
###entity_id
(integer|null) ID právě upravované entity. Null pokud se vytváří
###data
(object) Všechna data Entity načtená do editoru
###form
([Form](/form/js)) Formulář
###hideTab(id)
###showTab(id)
###isEdited
Funkce isEdited vrací true/false podle toho jestli byla nějaká hodnota editoru upravena
