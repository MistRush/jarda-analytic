#Migrace z Latte 2 -> 3

- změníme v composeru latte na verzi 3 ("latte/latte": "^3.0")
- odinstalujeme balíček voda/gettext-extractor (composer remove voda/gettext-extractor)
- nainstalujeme místo něho nový balíček, který podporuje latte 3 (composer require "ondra/gettext-extractor": "^1.0")
  - přepíšeme kód tam kde se použival Vodacek\GettextExtractor\NetteExtractor
    -  starý kód 
      ```php
        $extractor = new NetteExtractor();
      ```
    - nový kód
      ```php
        $extractor = new NetteExtractor(Jolanda\Latte\Latte::getInstance()->getEngine());
      ```
- Vytvoříme si action, která projede všechny latte soubory a vypíše jejich chyby, ty si následně opravíme a přepíšeme pro použití v latte 3
  ```php
    public function lintAction(){
        \Jolanda\Latte\Latte::getInstance()->lint('../application/modules/admin/views');
        \Jolanda\Latte\Latte::getInstance()->lint('../application/modules/common/views');
        \Jolanda\Latte\Latte::getInstance()->lint('../application/modules/default/views');
        \Jolanda\Latte\Latte::getInstance()->lint('../application/modules/default/logic/EmailTemplates');
        \Jolanda\Latte\Latte::getInstance()->lint('../application/modules/default/logic/PdfTemplates');
  }
  ```
  