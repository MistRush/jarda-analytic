nainstalujes si node, tim muzes instalovat node balicky
pres npm si nainstalujes grunt - cli, to ti umozni spoustet grunt skripty
pak si nadefinujes package.json, kde si definujes ktere pluginy chces pouzivat (vzdy tam musi byt i samotny grunt)
pak npm install nainstaluje vsechny balicky z package.json



pri devu to funguje tak, ze tam je zaply jen watch na concat ... ten vezme a da do kupy vsechny tridy a app.js do jednoho souboru a prekopci ho do app.js
pokud budu chtit zbabelovat tak pak v gruntfile.js odkomentuju babel a prodConcat a pak muzu pouzit app.legacy.js .. a to mi pak bude ficet ve vsech prohlizecich ...



jednoduse jeste jednou jak to funguje ... vsechno mam ve tridach .. v app.js si vytvarim jednotlive instance dle toho jak potrebuju ...
nikde nepotrebuju zadne require import atd. protoze concaty mi to daji do jednoho souboru app.js mi bezi v chrome, protoze ten to umi ... app.legacy.js je zbabelovane


