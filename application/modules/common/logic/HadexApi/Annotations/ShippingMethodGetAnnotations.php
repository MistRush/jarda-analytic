<?php
namespace common\logic\HadexApi\Annotations;

class ShippingMethodGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/shipping-method",
     *     summary="Retrieve available shipping methods",
     *     description="Returns a list of available shipping methods with their details and associated payment options.",
     *     tags={"Shipping Method"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="3"),
     *                 @OA\Property(property="code", type="string", nullable=true, example=null),
     *                 @OA\Property(property="name", type="string", example="Osobní odběr"),
     *                 @OA\Property(property="description", type="string", nullable=true, example="Osobní odběr na adrese Hlavní 474, Frýdlant nad Ostravicí, 739 11 (nutná domluva předem)"),
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
     *                         @OA\Property(property="name", type="string", example="Hotově na místě"),
     *                         @OA\Property(property="externalId", type="string", nullable=true, example=null),
     *                         @OA\Property(property="value", type="string", nullable=true, example=null),
     *                         @OA\Property(property="currencyCode", type="string", example="CZK"),
     *                         @OA\Property(property="description", type="string", nullable=true, example=null)
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */

    public function getShippingMethodAnnotations() {}
}