<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryDeleteAnnotations {
    /**
     * @OA\Delete(
     *     path="/hadex-api/product-category",
     *     summary="Archive a product category",
     *     description="Archives one or more product categories based on their ID or code.",
     *     operationId="deleteProductCategory",
     *     tags={"Product Category"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 required={"id", "code"},
     *                 oneOf={
     *                     @OA\Schema(required={"id"}, @OA\Property(property="id", type="integer", example=10)),
     *                     @OA\Schema(required={"code"}, @OA\Property(property="code", type="string", example="CAT123"))
     *                 }
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
     *                 @OA\Property(property="status", type="string", example="success"),
     *                 @OA\Property(property="message", type="string", example="Category id 10 was archived")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Invalid request"),
     *     @OA\Response(response=500, description="Server error")
     * )
     */

    public function getProductCategoryDeleteAnnotations() {}
}