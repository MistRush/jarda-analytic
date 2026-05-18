<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product-category",
     *     summary="Získání detailu kategorie",
     *     description="Tato metoda vrací detail kategorie na základě její `id` nebo `code`. Jeden z těchto parametrů je vždy povinný.",
     *     tags={"Product Category"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="ID kategorie",
     *         @OA\Schema(type="integer", example=123)
     *     ),
     *     @OA\Parameter(
     *         name="code",
     *         in="query",
     *         required=false,
     *         description="Kód kategorie",
     *         @OA\Schema(type="string", example="L743A")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detail kategorie",
     *         @OA\JsonContent(ref="#/components/schemas/ProductCategory")
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chyba: Chybí povinný parametr `id` nebo `code`.",
     *         @OA\JsonContent(
     *             type="object",
     *              @OA\Property(property="status", type="integer", example="bad request", description="Stav"),
     *             @OA\Property(property="code", type="integer", example=400, description="Kód chyby"),
     *             @OA\Property(property="message", type="string", example="Missing required parameter: id or code.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Chyba: Kategorie nebyla nalezena.",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="integer", example="not found", description="Stav"),
     *             @OA\Property(property="code", type="integer", example=404, description="Kód chyby"),
     *             @OA\Property(property="message", type="string", example="Product not found.")
     *         )
     *     ),
     *           @OA\Response(
     *           response=401,
     *           description="Neautorizovaný přístup",
     *      @OA\JsonContent(
     *          @OA\Property(property="status", type="integer", example="unauthorized", description="Stav"),
     *               @OA\Property(property="code", type="integer", example=401, description="Kód chyby"),
     *               @OA\Property(property="message", type="string", example="Neautorizovaný přístup.", description="Popis chyby")
     *           )
     *       ),
     *            @OA\Parameter(
     *            name="Authorization",
     *            in="header",
     *            description="Bearer token for authentication",
     *            required=true,
     *            @OA\Schema(type="string")
     *        )
     * )
     */
    public function getProductAnnotations() {}
}