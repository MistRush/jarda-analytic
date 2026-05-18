<?php

namespace common\logic\HadexApi\Annotations\schemas;

/**
 * @OA\Schema(
 *      schema="Order",
 *      type="object"
 * )
 */
class Order {
    /**
     * @OA\Property(property="id", type="string", example="5"),
     * @OA\Property(property="number", type="string", example="250600005"),
     * @OA\Property(property="customerId", type="string", nullable=true),
     * @OA\Property(property="completeOrder", type="boolean", example=true),
     * @OA\Property(property="orderStateCode", type="string", example="Nová"),
     * @OA\Property(property="createdOnUtc", type="string", format="date-time", example="2025-06-23T22:00:00.000Z"),
     * @OA\Property(property="updatedOnUtc", type="string", format="date-time", example="2025-06-24T07:08:20.000Z"),
     * @OA\Property(property="priceTotalWithoutVat", type="string", example="7235.00"),
     * @OA\Property(property="priceTotalWithVat", type="string", example="8747.19"),
     * @OA\Property(property="noteCustomer", type="string", example=""),
     * @OA\Property(property="paymentType", type="string", nullable=true),
     * @OA\Property(property="deliveryType", type="string", nullable=true),
     * @OA\Property(property="currencyCode", type="string", example="CZK"),
     * @OA\Property(property="currencyRate", type="string", example="1.00"),
     * @OA\Property(property="synced", type="boolean", example=false),
     * @OA\Property(property="trackingCode", type="string", nullable=true),
 * @OA\Property(
     *     property="payment",
     *     type="object",
     *     @OA\Property(property="id", type="string", example="1"),
     *     @OA\Property(property="code", type="string", example="COD"),
     *     @OA\Property(property="name", type="string", example="Dobírkou"),
     *     @OA\Property(property="type", type="string", nullable=true),
     *     @OA\Property(property="priceWithoutVat", type="string", example="35.00"),
     *     @OA\Property(property="priceWithVat", type="string", example="35.00"),
     *     @OA\Property(property="currency", type="string", example="CZK"),
     *     @OA\Property(property="currencyRate", type="string", example="1.00")
     * ),
 * @OA\Property(
     *     property="shipping",
     *     type="object",
     *     @OA\Property(property="id", type="string", example="2"),
     *     @OA\Property(property="code", type="string", example="SKZASILOKOVNA"),
     *     @OA\Property(property="name", type="string", example="Balík do ruky"),
     *     @OA\Property(property="type", type="string", nullable=true),
     *     @OA\Property(property="priceWithoutVat", type="string", example="61.00"),
     *     @OA\Property(property="priceWithVat", type="string", example="74.00"),
     *     @OA\Property(property="currency", type="string", example="CZK"),
     *     @OA\Property(property="currencyRate", type="string", example="1.00")
     * ),
 * @OA\Property(
     *     property="orderItems",
     *     type="array",
     *     @OA\Items(
     *         type="object",
     *         @OA\Property(property="id", type="string", example="5"),
     *         @OA\Property(property="productId", type="string", example="211"),
     *         @OA\Property(property="productCode", type="string", example="G532C"),
     *         @OA\Property(property="productName", type="string", example="Měnič napětí 24V/230V 3000W, FS3000, čistá sinusovka, D.O.drátové"),
     *         @OA\Property(property="quantity", type="string", example="1"),
     *         @OA\Property(property="priceWithoutVat", type="string", example="7139.00"),
     *         @OA\Property(property="priceWithVat", type="string", example="8638.19")
     *     )
     * ),
 * @OA\Property(
     *     property="invoiceAddress",
     *     type="object",
     *     @OA\Property(property="id", type="string", example="98"),
     *     @OA\Property(property="firstName", type="string", example="Zdenek"),
     *     @OA\Property(property="lastName", type="string", example="Zdenek"),
     *     @OA\Property(property="companyName", type="string", example=""),
     *     @OA\Property(property="identification", type="string", example=""),
     *     @OA\Property(property="taxIdentification", type="string", example=""),
     *     @OA\Property(property="state", type="string", nullable=true),
     *     @OA\Property(property="street", type="string", example="Petra Bezruce 216"),
     *     @OA\Property(property="zipCode", type="string", example="74724"),
     *     @OA\Property(property="phone", type="string", example="+420721157805"),
     *     @OA\Property(property="email", type="string", example="vojkuvka.zdenek@gmail.com"),
     *     @OA\Property(property="city", type="string", example="Chuchelná")
     * ),
 * @OA\Property(
     *     property="deliveryAddress",
     *     type="object",
     *     nullable=true,
     *     @OA\Property(property="id", type="string", nullable=true),
     *     @OA\Property(property="firstName", type="string", nullable=true),
     *     @OA\Property(property="lastName", type="string", nullable=true),
     *     @OA\Property(property="state", type="string", nullable=true),
     *     @OA\Property(property="street", type="string", nullable=true),
     *     @OA\Property(property="zipCode", type="string", nullable=true),
     *     @OA\Property(property="phone", type="string", nullable=true),
     *     @OA\Property(property="email", type="string", nullable=true),
     *     @OA\Property(property="city", type="string", nullable=true)
     * ),
 * @OA\Property(
     *     property="pickupDeliveryPlace",
     *     type="object",
     *     nullable=true,
     *     @OA\Property(property="id", type="string", example="B12013"),
     *     @OA\Property(property="code", type="string", example="B12013"),
     *     @OA\Property(property="name", type="string", example="Praha 2 Designlink"),
     *     @OA\Property(property="address", type="string", example="Francouzská 852/11, Praha, 12013")
     * )
     */
    public function getOrderSchema() {}
}