<?php
namespace common\logic\HadexApi\Annotations;

class ProductSimpleGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product-simple",
     *     summary="Get a list of simple products",
     *     description="Returns a list of products with their ID and code.",
     *     tags={"Product Simple"},
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="3"),
     *                 @OA\Property(property="code", type="string", example="004-00002")
     *             )
     *         )
     *     )
     * )
     */
    public function getProductSimpleAnnotations() {}
}