<?php
namespace common\logic\Front\CartStep;

/**
 * Module constants
 */
class CartStep {

    const ORDER_CART = 1;
    const ORDER_ADDRESS = 2;
    const ORDER_PAYMENT_SHIPPING = 3;
    const ORDER_COMPLETED = 4;

    /**
     * order
     *
     * @var int
     */
    private $order;

    /**
     * name
     *
     * @var string
     */
    private $name;

    /**
     * link
     *
     * @var string
     */
    private $link;

    /**
     * Constructor
     * @param int $order
     * @param string $name
     * @param string $link
     * @internal param array $category
     */
    public function __construct(int $order, string $name, string $link = null) {
        $this->setOrder($order);
        $this->setName($name);

        if ( $link )
            $this->setLink($link);
    }

    /**
     * @return int
     */
    public function getOrder(): int {
        return $this->order;
    }

    /**
     * @param int $order
     */
    public function setOrder(int $order) {
        $this->order = $order;
    }

    /**
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name) {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getLink(): ?string {
        return $this->link;
    }

    /**
     * @param string $link
     */
    public function setLink(string $link) {
        $this->link = $link;
    }
}