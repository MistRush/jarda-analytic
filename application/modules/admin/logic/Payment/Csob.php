<?php
namespace admin\logic\Payment;

use common\logic\Eshop\Eshop;
use Common_Model_Eshop as EshopModel;
use Clevis_Helper;
use OndraKoupil\Csob\Client;
use OndraKoupil\Csob\Config;
use OndraKoupil\Csob\GatewayUrl;
use OndraKoupil\Csob\Payment;


/**
 * Class Gopay
 * @package admin\logic\Payment
 */
class Csob {

    const csobId = '';

    /** @var string */

    /** @var int Timeout v minutách? */
    const TIMEOUT = 30;

    /** @var array $account */
    private array $account;

    /** @var EshopModel|null $eshop */
    private ?EshopModel $eshop;

    /** @var bool $isProductionMode */
    private bool $isProductionMode;

    public Client $client;

    /** @var string */

    /** @var self $instance */
    private static Csob $instance;

    /**
     * Gopay konstruktor.
     * @param bool $isProductionMode
     * @param EshopModel|null $eshop
     */
    private function __construct(?bool $isProductionMode = null, ?EshopModel $eshop = null, ?string $returnUrl) {
        if ( !$eshop )
            $eshop = Eshop::getInstance()->getEshop();

        $this->setProductionMode($isProductionMode);
        $this->setEshop($eshop);
        $this->setLogin();

        $config = new Config(
            $this->account['MerchantID'],
            $this->account['PrivateKeyPath'],
            $this->account['PublicKeyPath'],
            $this->eshop->Name,
            $returnUrl,
            $this->isProductionMode ? GatewayUrl::PRODUCTION_1_9 :
            GatewayUrl::TEST_LATEST
        );

        $this->client = new Client($config);
    }

    /**
     * Vratí instanci GoPaye
     * @param bool $isProductionMode
     * @param EshopModel|null $eshop
     * @return self
     */
    public static function getInstance(?bool $isProductionMode = null, ?EshopModel $eshop = null, ?string $returnUrl = null): self {
        if (!isset(self::$instance))
            self::$instance = new self($isProductionMode, $eshop, $returnUrl);

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
        $this->account = CsobAccounts::get($this->eshop->ID??null, $this->isProductionMode);

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
     * @return Payment
     */
    public function payment($orderNumber): Payment {
        return new Payment($orderNumber);
    }
}