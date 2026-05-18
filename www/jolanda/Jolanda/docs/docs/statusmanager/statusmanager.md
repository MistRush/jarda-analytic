#Metody třídy StatusManager
###addError
`addError(string $msg, bool $confirmAfterNotify = false): Status`

Přidá error status (červené okno)
###addInfo
`addInfo(string $msg, bool $confirmAfterNotify = true): Status`

Přidá info status (šedé okno)
###addSuccess
`addSuccess(string $msg, bool $confirmAfterNotify = true): Status`

Přidá success status (zelené okno)
###getStatuses
`getStatuses(): array`

Vrátí pole všech statusů
###getErrors
`getErrors(): array`

Vrátí pole všech error statusů
###getInfos
`getInfos(): array`

Vrátí pole všech info statusů
###getSuccesses
`getSuccesses(): array`

Vrátí pole všech success statusů
###clearStatuses
`clearStatuses(): array`

Smaže všechny statusy
###clearErrors
`clearErrors(): array`

Smaže všechny error statusy
###clearInfos
`clearInfos(): array`

Smaže všechny info statusy
###clearSuccesses
`clearSuccesses(): array`

Smaže všechny success statusy
###hasErrors
`hasErrors(): bool`

Vratí jestli má nějaké error statusy
###hasInfos
`hasInfos(): bool`

Vratí jestli má nějaké info statusy
###hasSuccesses
`hasSuccesses(): bool`

Vratí jestli má nějaké success statusy
###__toString
`__toString(): string`

Vratí json statusů {statuses: [pole statusů]}
###toArray
`toArray(): array`

Vratí pole statusů
###getInstance
`getInstance(): StatusManager`

Vrátí instanci StatusManageru
