<?php
namespace common\logic\HadexApi\Annotations;

class ProductDeleteAnnotations {
    /**
     * @OA\Delete(
     *     path="/hadex-api/product",
     *     summary="Archive a product",
     *     description="Archives one or more products based on their ID or code.",
     *     operationId="deleteProduct",
     *     tags={"Product"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 required={"id", "code"},
     *                 oneOf={
     *                     @OA\Schema(required={"id"}, @OA\Property(property="id", type="integer", example=1)),
     *                     @OA\Schema(required={"code"}, @OA\Property(property="code", type="string", example="D5454"))
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
     *                 @OA\Property(property="message", type="string", example="Product id 1 was archived")
     *             )
     *         )
     *     ),
     *     @OA\Response(response=400, description="Invalid request"),
     *     @OA\Response(response=500, description="Server error")
     * )
     */
    public function getProductDeleteAnnotations() {}
}