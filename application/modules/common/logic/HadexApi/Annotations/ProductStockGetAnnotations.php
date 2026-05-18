<?php
namespace common\logic\HadexApi\Annotations;

class ProductStockGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product-stock",
     *     summary="Get product stock information",
     *     description="Returns stock information for a specific product. At least one of the parameters (id, productId, or productCode) is required.",
     *     tags={"Product Stock"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="Stock entry ID",
     *         @OA\Schema(type="string", example="4")
     *     ),
     *     @OA\Parameter(
     *         name="productId",
     *         in="query",
     *         required=false,
     *         description="Product ID",
     *         @OA\Schema(type="string", example="63")
     *     ),
     *     @OA\Parameter(
     *         name="productCode",
     *         in="query",
     *         required=false,
     *         description="Product code",
     *         @OA\Schema(type="string", example="L743A")
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
     *                 @OA\Property(property="value", type="string", example="10")
     *             )
     *         )
     *     )
     * )
     */
    public function getProductStockAnnotations() {}
}