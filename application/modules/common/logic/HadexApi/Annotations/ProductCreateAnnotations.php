<?php
namespace common\logic\HadexApi\Annotations;

class ProductCreateAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/product",
     *     summary="Vytváří nový produkt",
     *     description="Vytvoření nového produktu včetně jeho atributů, příloh, souvisejících produktů a dalších detailů.",
     *     tags={"Product"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *           @OA\Items(
     *             @OA\Property(property="id", type="integer", nullable=true, example=22, description="ID produktu, nepovinné pro POST"),
     *             @OA\Property(property="code", type="string", example="L743A", description="Kód produktu"),
     *             @OA\Property(property="ean", type="string", example="8596425174676", description="EAN kód produktu"),
     *             @OA\Property(property="isAvailable", type="boolean", example=true, description="Dostupnost produktu"),
     *             @OA\Property(property="taxType", type="string", enum={"NORMAL", "REDUCED", "REDUCED2"}, example="NORMAL", description="Typ daně"),
     *             @OA\Property(property="name", type="string", example="Motor MY1016 36V 350W pro elektrokoloběžky", description="Název produktu"),
     *             @OA\Property(property="shortDescription", type="string", example="", description="Krátký popis produktu"),
     *             @OA\Property(property="description", type="string", example="Detailní popis produktu", description="Detailní popis produktu"),
     *             @OA\Property(property="url", type="string", example="Url produktu", description="Url produktu"),
     *             @OA\Property(property="categories", type="array", @OA\Items(type="string"), example={"_05MOTORKY"}, description="Kategorie produktu"),
     *             @OA\Property(
     *                 property="productMetas",
     *                 type="array",
     *                 description="Metadata produktu",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=0),
     *                     @OA\Property(property="code", type="string", example="GOOGLE_CATEGORY_CODE"),
     *                     @OA\Property(property="value", type="string", example="7275")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="productPrices",
     *                 type="array",
     *                 description="Ceny produktu",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=0),
     *                     @OA\Property(property="value", type="number", format="float", example=983.471),
     *                     @OA\Property(property="quantityMin", type="integer", example=0),
     *                     @OA\Property(property="customerCode", type="string", example="DSDFEFS"),
     *                     @OA\Property(property="productPriceTypeCode", type="string", enum={"A", "B", "C", "D", "ACTION", "CUSTOMER"}, example="A"),
     *                     @OA\Property(property="currencyCode", type="string", example="CZK"),
     *                     @OA\Property(property="isDiscountable", type="boolean", example=false),
     *                     @OA\Property(property="validFrom", type="datetime", example="2025-04-02T14:30:00Z"),
     *                     @OA\Property(property="validTo", type="datetime", example="2025-04-03T14:30:00Z"),
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="productAttributes",
     *                 type="array",
     *                 description="Atributy produktu",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="code", type="string", example="VYROBCE"),
     *                     @OA\Property(property="value", type="string", example="Hadex")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="productLinks",
     *                 type="array",
     *                 description="Související produkty",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="linkType", type="string", example="SOUVISEJICI_S"),
     *                     @OA\Property(property="productCode", type="string", example="string"),
     *                     @OA\Property(property="productId", type="string", example="string")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="attachments",
     *                 type="array",
     *                 description="Přílohy produktu",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=0),
     *                     @OA\Property(property="fileName", type="string", example="manual.pdf"),
     *                     @OA\Property(property="urlPath", type="string", example="string"),
     *                     @OA\Property(property="attachmentType", type="string", enum={"OBR1", "OBR2", "NAVOD", "SOFT1"}, example="NAVOD"),
     *                     @OA\Property(property="attachmentDataAsBase64", type="string", example="string")
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="productStocks",
     *                 type="array",
     *                 description="Stavy na skladě",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="value", type="integer", example=0),
     *                     @OA\Property(property="warehouseCode", type="string", example="WH01"),
     *                     @OA\Property(property="id", type="integer", example=0)
     *                 )
     *             )
     *         )
     *      )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Produkt úspěšně vytvořen",
     *         @OA\JsonContent(type="array",
     *             @OA\Items(ref="#/components/schemas/Product")
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