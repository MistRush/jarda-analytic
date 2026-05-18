<?php
namespace common\logic\HadexApi\Annotations;

class ProductGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product",
     *     summary="Získání detailu produktu",
     *     description="Tato metoda vrací detail produktu na základě jeho `id` nebo `code`. Jeden z těchto parametrů je povinný.",
     *     tags={"Product"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="ID produktu",
     *         @OA\Schema(type="integer", example=123)
     *     ),
     *     @OA\Parameter(
     *         name="code",
     *         in="query",
     *         required=false,
     *         description="Kód produktu",
     *         @OA\Schema(type="string", example="L743A")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Detail produktu",
     *         @OA\JsonContent(ref="#/components/schemas/Product")
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
     *         description="Chyba: Produkt nebyl nalezen.",
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