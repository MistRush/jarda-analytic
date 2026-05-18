<?php

namespace admin\logic\Order\conversionCodes\ZboziCZ;

class CartItem
{
    /**
     * Item name
     *
     * @var string $productName
     */
    public $productName;

    /**
     * Item identifier
     *
     * @var string $itemId
     */
    public $itemId;

    /**
     * Price per one item (in CZK)
     *
     * @var float $unitPrice
     */
    public $unitPrice;

    /**
     * Number of items ordered
     *
     * @var int $quantity
     */
    public $quantity;
}
