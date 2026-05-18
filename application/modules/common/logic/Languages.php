<?php
namespace common\logic;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as ModelEshop;
use Common_Model_Language as ModelLanguage;
use Zend_Session_Namespace;

/**
 * Language session
 */
class Languages {

    const SESSION = 'hadex_app_language';

    /** Single instance */
    private static self $instance;

    /**
     * @var array $defaultLanguage
     */
    private $defaultLanguage;

    /**
     * @var array $currentLanguage
     */
    private $currentLanguage;

    /**
     * @var array $languages
     */
    private array $languages;

    /**
     * @var array $activeLanguages
     */
    private array $activeLanguages;

    /**
     * Languages constructor.
     * @param bool|ModelEshop|null $eshop
     */
    public function __construct(bool|ModelEshop $eshop = null) {
        $this->languages = ModelLanguage::getLanguages();
        $this->activeLanguages = ModelLanguage::getLanguages(true);
        //$this->defaultLanguage = count($this->activeLanguages) ? $this->activeLanguages[0] : null;

        if ($eshop === null)
            $eshop = Eshop::getInstance()->getEshop();

        $this->defaultLanguage = Eshop::getInstance()->getEshop()->language;

        /*
        foreach ($this->activeLanguages as $language) {
            if ($language['IsDefault']) {
                $this->defaultLanguage = $language;
            }
        }*/

        if ($eshop === null)
            $eshop = Eshop::getInstance()->getEshop();

        if ($eshop)
            $this->setCurrentLanguage($eshop->language->Code);
        else
            $this->setLanguageFromCookie();
    }

    /**
     * Vrací vybraný jazyk, pokud existuje
     * @param string $langCode
     * @return
     */
    public function getLang(string $langCode) {
        return Eshop::getInstance()->getEshop()->language;

        $key = array_search($langCode, array_column($this->activeLanguages, 'Code'));
        if ($key === false)
            return $this->defaultLanguage;

        return $this->activeLanguages[$key];
    }

    /**
     * Vrací kód jazyka
     * @return string|null
     */
    public function getCurrentLanguageCode(): ?string {
        return strtoupper($this->currentLanguage['Code']);
    }

    /**
     * Vrací ID jazyka
     * @return int|null
     */
    public function getCurrentLanguageID(): ?int {
        return $this->currentLanguage['ID'];
    }

    /**
     * Vrací jméno jazyka
     * @return string|null
     */
    public function getCurrentLanguageName(): ?string {
        return $this->currentLanguage['Name'];
    }

    /**
     * Nastaví jazyk, pokud existuje
     * @param string $languageCode
     * @return bool
     */
    public function setCurrentLanguage(string $languageCode): bool {
        $lang = $this->getLang($languageCode);

        if (!count($lang))
            return false;

        $language = new Zend_Session_Namespace(self::SESSION);
        $language->Code = $lang['Code'];
        $language->Name = $lang['Name'];

        $this->currentLanguage = $lang;

        return true;
    }

    /**
     * Vrací všechny jazyky
     * @return array
     */
    public function getLanguages(): array {
        return $this->languages;
    }

    /**
     * Vrací aktivní jazyky
     * @return array
     */
    public function getActiveLanguages(): array {
        return $this->activeLanguages;
    }

    /**
     * Vrací aktivní jazyky pro select
     * @return array
     */
    public function getActiveLanguagesArray(): array {
        $langs = [];
        foreach ($this->activeLanguages as $lang) {
            $langs[$lang['Code']] = $lang['Name'];
        }

        return $langs;
    }

    /**
     * Vrací aktivní jazyky pro select
     * @param $ID
     * @return array
     */
    public function getByID($ID): array {
        foreach ($this->activeLanguages as $lang) {
            if ($lang['ID'] == $ID)
                return $this->getLang($lang['Code']);
        }

        return $this->defaultLanguage;
    }

    public function setLanguageFromCookie() {
        if (isset($_COOKIE['Language'])) {
            if (!$this->setCurrentLanguage($_COOKIE['Language'])) {
                unset($_COOKIE['Language']);
                $this->setLanguageFromCookie();
            }
        } else {
            setcookie('Language', 'CZ', time() + (86400 * 30), "/admin");
            $this->setCurrentLanguage('CZ');
        }
    }

    /**
     * Get single instace
     *
     * @param bool|ModelEshop|null $eshop
     * @return self
     */
    public static function getInstance(bool|ModelEshop $eshop = null): self {
        if (!isset(self::$instance))
            self::$instance = new self($eshop);

        return self::$instance;
    }

    /**
     * Vrací ID aktuálního jazyka
     * @return int
     */
    public static function getLangID(): int {
        $langs =  self::getInstance();

        return $langs->getCurrentLanguageID();
    }

    /**
     * Vrací kód aktuálního jazyka
     * @return string
     */
    public static function getLangCode(): string {
        $langs =  self::getInstance();

        return $langs->getCurrentLanguageCode();
    }
}