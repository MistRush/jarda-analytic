<?php
namespace common\logic\HadexApi\Annotations;

class ProductStockCreateAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/product-stock",
     *     summary="Create or update product stock",
     *     description="Adds or updates stock information for one or more products. Either productId or productCode is required, along with warehouseCode and value.",
     *     tags={"Product Stock"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 required={"warehouseCode", "value"},
     *                 @OA\Property(property="productId", type="string", nullable=true, example="63"),
     *                 @OA\Property(property="productCode", type="string", nullable=true, example=null),
     *                 @OA\Property(property="value", type="integer", example=10),
     *                 @OA\Property(property="warehouseCode", type="string", example="02"),
     *                 @OA\Property(property="note", type="string", nullable=true, example="test")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="4"),
     *                 @OA\Property(property="productID", type="string", example="63"),
     *                 @OA\Property(property="productCode", type="string", example="L743A"),
     *                 @OA\Property(property="warehouseCode", type="string", example="02"),
     *                 @OA\Property(property="note", type="string", example="test"),
     *                 @OA\Property(property="value", type="integer", example=10)
     *             )
     *         )
     *     )
     * )
     */

    public function getProductStockCreateAnnotations() {}
}