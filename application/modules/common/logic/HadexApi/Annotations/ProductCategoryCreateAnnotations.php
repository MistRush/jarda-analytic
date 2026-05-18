<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryCreateAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/product-category",
     *    summary="Vytvoření nové produktové kategorie",
     *    tags={"Product Category"},
     *    @OA\RequestBody(
     *        required=true,
     *        @OA\JsonContent(
     *            type="array",
     *            @OA\Items(
     *                @OA\Property(property="code", type="string", example="TESTOVACI_KATEGORIE_4"),
     *                @OA\Property(property="isAvailable", type="boolean", example=true),
     *                @OA\Property(property="parentProductCategoryID", type="integer", nullable=true, example=null),
     *                @OA\Property(property="parentProductCategoryCode", type="string", nullable=true, example=null),
     *                @OA\Property(property="metaTitle", type="string", example="Testovací kategorie 3 meta"),
     *                @OA\Property(property="metaDescription", type="string", example="Testovací popis meta"),
     *                @OA\Property(property="name", type="string", example="Testovací kategorie 3"),
     *                @OA\Property(property="headline", type="string", example="Nadpis pro h1"),
     *                @OA\Property(property="shortDescription", type="string", example="Krátký popis kategorie"),
     *                @OA\Property(property="description", type="string", example="Jenom něco zkouším"),
     *                @OA\Property(property="url", type="string", example="testovaci-kategorie"),
     *                @OA\Property(property="note", type="string", example="Jen pro testy"),
     *                @OA\Property(property="rank", type="integer", example="1"),
     *                @OA\Property(
     *                    property="attachments",
     *                    type="array",
     *                    @OA\Items(
     *                        @OA\Property(property="fileName", type="string", example="Testovaci obrazek"),
     *                        @OA\Property(property="urlPath", type="string", example="https://hadex.cz/img/zbozi/pre/m373d.jpg"),
     *                        @OA\Property(property="hash", type="string", example="nejakyhash"),
     *                        @OA\Property(property="alt", type="string", example="string"),
     *                        @OA\Property(property="attachmentType", type="string", example="CATEGORY")
     *                    )
     *                ),
     *                @OA\Property(
     *                    property="productCategoryMetas",
     *                    type="array",
     *                    @OA\Items(
     *                        @OA\Property(property="code", type="string", example="TESTOVACI_KATEGORIE_META"),
     *                        @OA\Property(property="value", type="string", example="test")
     *                    )
     *                )
     *            )
     *        )
     *    ),
     *     @OA\Response(
     *         response=200,
     *         description="Kategorie úspěšně vytvořena",
     *         @OA\JsonContent(type="array",
     *             @OA\Items(ref="#/components/schemas/ProductCategory")
     *          )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chyba validace nebo chybějící údaje",
     *           @OA\JsonContent(
     *                @OA\Property(property="status", type="integer", example="bad request", description="Stav"),
     *                @OA\Property(property="code", type="integer", example="400", description="Kód chyby"),
     *                @OA\Property(property="message", type="string", example="Chyba validace nebo chybějící údaje.", description="Popis chyby")
     *            )
     *     ),
     *           @OA\Response(
     *           response=401,
     *           description="Neautorizovaný přístup",
     *      @OA\JsonContent(
     *               @OA\Property(property="status", type="integer", example="Unauthorized", description="Stav"),
     *               @OA\Property(property="code", type="integer", example="400", description="Kód chyby"),
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
    public function getProductCreateAnnotations() {}
}