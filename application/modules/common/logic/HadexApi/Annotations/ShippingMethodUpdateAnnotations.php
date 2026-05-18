<?php
namespace common\logic\HadexApi\Annotations;

class ShippingMethodUpdateAnnotations {
    /**
     * @OA\Put(
     *     path="/hadex-api/shipping-method",
     *     summary="Update an existing shipping method",
     *     description="Updates an existing shipping method based on externalId or id.",
     *     tags={"Shipping Method"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 required={"id"},
     *                 @OA\Property(property="id", type="string", nullable=true, example="12"),
     *                 @OA\Property(property="externalId", type="string", example="12312565455454454"),
     *                 @OA\Property(property="code", type="string", nullable=true, example="NejakyKOD2x"),
     *                 @OA\Property(property="name", type="string", example="Zásilkovna - test"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Doručení do 2-3 dnů"),
     *                 @OA\Property(property="isAvailable", type="boolean", example=true),
     * @OA\Property(
    *    property="shippingPrices",
    *    type="array",
    *    description="List of shipping prices and their constraints",
    *    @OA\Items(
    *        type="object",
    *        @OA\Property(property="value", type="integer", example=500, description="Shipping price value"),
    *        @OA\Property(property="currencyCode", type="string", example="CZK", description="Currency of the shipping price"),
    *        @OA\Property(property="maxWeight", type="integer", example=100, description="Maximum allowed weight for shipping"),
    *        @OA\Property(property="maxWidth", type="integer", example=100, description="Maximum allowed width for shipping"),
    *        @OA\Property(property="maxDepth", type="integer", example=100, description="Maximum allowed depth for shipping"),
    *        @OA\Property(property="maxHeight", type="integer", example=100, description="Maximum allowed height for shipping")
    *    )
    *),
     *                 @OA\Property(
     *                     property="availablePayments",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="code", type="string", nullable=true, example=null),
     *                         @OA\Property(property="name", type="string", example="Platba předem na účet"),
     *                         @OA\Property(property="externalId", type="string", example="2522"),
     *                         @OA\Property(property="value", type="string", nullable=true, example=null),
     *                         @OA\Property(property="currencyCode", type="string", example="CZK"),
     *                         @OA\Property(property="description", type="string", nullable=true, example="Fio banka, a.s.")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Shipping method updated successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="12"),
     *                 @OA\Property(property="code", type="string", example="NejakyKOD2x"),
     *                 @OA\Property(property="name", type="string", example="Zásilkovna - test"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Doručení do 2-3 dnů"),
     *                 @OA\Property(property="isAvailable", type="boolean", example=true),
     *                 @OA\Property(property="externalId", type="string", example="12312565455454454"),
     * @OA\Property(
    *    property="shippingPrices",
    *    type="array",
    *    description="List of shipping prices and their constraints",
    *    @OA\Items(
    *        type="object",
    *        @OA\Property(property="value", type="integer", example=500, description="Shipping price value"),
    *        @OA\Property(property="currencyCode", type="string", example="CZK", description="Currency of the shipping price"),
    *        @OA\Property(property="maxWeight", type="integer", example=100, description="Maximum allowed weight for shipping"),
    *        @OA\Property(property="maxWidth", type="integer", example=100, description="Maximum allowed width for shipping"),
    *        @OA\Property(property="maxDepth", type="integer", example=100, description="Maximum allowed depth for shipping"),
    *        @OA\Property(property="maxHeight", type="integer", example=100, description="Maximum allowed height for shipping")
    *    )
    *),
     *                 @OA\Property(
     *                     property="availablePayments",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="code", type="string", nullable=true, example=null),
     *                         @OA\Property(property="name", type="string", example="Platba předem na účet"),
     *                         @OA\Property(property="externalId", type="string", example="2522"),
     *                         @OA\Property(property="value", type="string", nullable=true, example=null),
     *                         @OA\Property(property="currencyCode", type="string", example="CZK"),
     *                         @OA\Property(property="description", type="string", nullable=true, example="Fio banka, a.s.")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid request",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Missing required fields: externalId or id")
     *         )
     *     )
     * )
     */



    public function getShippingMethodUpdateAnnotations() {}
}