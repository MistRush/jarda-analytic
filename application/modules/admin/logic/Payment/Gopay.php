<?php
namespace admin\logic\Payment;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use GoPay\Definition\Language;
use GoPay\Definition\TokenScope;
use GoPay\Payments;
use Clevis_Helper;

/**
 * Class Gopay
 * @package admin\logic\Payment
 */
class Gopay {

    const goid = '';

    /** @var string */
    const TOKEN_SCOPE = TokenScope::ALL;

    /** @var int Timeout v minutách? */
    const TIMEOUT = 30;

    /** @var array $account */
    private array $account;

    /** @var EshopModel|null $eshop */
    private ?EshopModel $eshop;

    /** @var bool $isProductionMode */
    private bool $isProductionMode;

    /** @var string */
    private string $language;

    /** @var self $instance */
    private static Gopay $instance;

    /**
     * Gopay konstruktor.
     * @param bool $isProductionMode
     * @param EshopModel|null $eshop
     */
    private function __construct(?bool $isProductionMode = null, ?EshopModel $eshop = null) {
        if ( !$eshop )
            $eshop = Eshop::getInstance()->getEshop();

        $this->setProductionMode($isProductionMode);
        $this->setEshop($eshop);
        $this->setLogin();
    }

    /**
     * Vratí instanci GoPaye
     * @param bool $isProductionMode
     * @param EshopModel|null $eshop
     * @return self
     */
    public static function getInstance(?bool $isProductionMode = null, ?EshopModel $eshop = null): self {
        if (!isset(self::$instance))
            self::$instance = new self($isProductionMode, $eshop);

        return self::$instance;
    }

    /**
     * Vrací přihlašovací údaj
     * @param $item
     * @return string|null
     */
    public function __get($item): ?string {
        return $this->account[$item] ?? null;
    }

    /**
     * Nastaví eshop (+ jazyk)
     * @param EshopModel|null $eshop
     * @return self
     */
    public function setEshop(?EshopModel $eshop): self {
        $this->eshop = $eshop;

        if ($eshop)
            $this->setLanguage($this->eshop->language->Code);

        return $this;
    }

    /**
     * Vrací eshop
     * @return EshopModel|null
     */
    public function getEshop(): ?EshopModel {
        return $this->eshop;
    }

    /**
     * Nastaví jazyk pro GoPay
     * @param string|null $Code
     * @return self
     */
    public function setLanguage(?string $Code): self {
        if (empty($Code))
            $Code = $this->eshop->language->Code??null;

        // CS, EN, SK, DE, RU, PL, HU, FR, RO, BG, HR, IT, ES
        $this->language = match ($Code) {
            'CZ' => Language::CZECH,
            'SK' => Language::SLOVAK,
            'FR' => Language::FRENCH,
            'IT' => Language::ITALIAN,
            'ES' => Language::SPANISH,
            default => 'EN',
        };

        return $this;
    }

    /**
     * Vratí kód jazyka (dle GoPay)
     * @return string
     */
    public function getLanguage(): string {
        return $this->language;
    }

    /**
     * Nastaví přihlašovací údaje do GoPaye
     * @return self
     */
    public function setLogin(): self {
        $this->account = GopayAccounts::get($this->eshop->ID??null, $this->isProductionMode);

        return $this;
    }

    /**
     * Vrací přihlašovací údaje do GoPaye
     * @return array
     */
    public function getLogin(): array {
        return $this->account;
    }

    /**
     * Nastaví produkční/testovací režim
     * @param bool $isProductionMode
     * @return self
     */
    public function setProductionMode(?bool $isProductionMode = null): self {
        if ($isProductionMode == null)
            $this->isProductionMode = !Clevis_Helper::isDevelopmentEnvironment();
        else
            $this->isProductionMode = $isProductionMode;

        return $this;
    }

    /**
     * Vytvoření platby
     * @return Payments
     */
    public function payment(): Payments {
        return \GoPay\payments([
            'goid' => $this->GoID,
            'clientId' => $this->ClientID,
            'clientSecret' => $this->ClientSecret,
            'isProductionMode' => $this->isProductionMode,
            'scope' => $this::TOKEN_SCOPE,
            'language' => $this->getLanguage(),
            'timeout' => $this::TIMEOUT,
        ]);
    }
}