<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryUpdateAnnotations {
    /**
     * @OA\Put(
     *     path="/hadex-api/product-category",
     *     summary="Aktualizuje stávající produktovou kategorii",
     *     description="Umožňuje aktualizovat údaje existující kategorie. Povinné údaje jsou id nebo code. Vždy alespoň jeden musí být zastoupen",
     *     tags={"Product Category"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(type="array",
     *              @OA\Items(ref="#/components/schemas/ProductCategory")
     *           )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Kategorie úspěšně aktualizována",
     *         @OA\JsonContent(type="array",
     *             @OA\Items(ref="#/components/schemas/ProductCategory")
     *          )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chyba validace nebo chybějící údaje",
     *     @OA\JsonContent(
     *              @OA\Property(property="status", type="integer", example="bad request", description="Stav"),
     *              @OA\Property(property="code", type="integer", example=400, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Chyba validace nebo chybějící údaje", description="Popis chyby")
     *          )
     *     ),
     *           @OA\Response(
     *           response=401,
     *           description="Neautorizovaný přístup",
     *      @OA\JsonContent(
     *               @OA\Property(property="status", type="integer", example="unauthorized", description="Stav"),
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
    public function getProductUpdateAnnotations() {}
}