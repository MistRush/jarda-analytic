<?php

namespace common\logic\HadexApi\Annotations\schemas;

/**
 * @OA\Schema(
 *      schema="Product",
 *      type="object"
 * )
 */
class Product {
    /**
     *     @OA\Property(property="id", type="integer", nullable=true, example=33, description="ID produktu"),
     *     @OA\Property(property="code", type="string", example="L743A", description="Kód produktu"),
     *     @OA\Property(property="ean", type="string", example="8596425174676", description="EAN kód produktu"),
     *     @OA\Property(property="isAvailable", type="boolean", example=true, description="Dostupnost produktu"),
     *     @OA\Property(property="taxType", type="string", enum={"NORMAL", "REDUCED", "REDUCED2"}, example="NORMAL", description="Typ daně"),
     *     @OA\Property(property="name", type="string", example="Motor MY1016 36V 350W pro elektrokoloběžky", description="Název produktu"),
     *     @OA\Property(property="shortDescription", type="string", example="", description="Krátký popis produktu"),
     *     @OA\Property(property="description", type="string", example="Detailní popis produktu", description="Detailní popis produktu"),
     *     @OA\Property(property="url", type="string", example="Url produktu", description="Url produktu"),
     *     @OA\Property(property="categories", type="array", @OA\Items(type="string"), example={"_05MOTORKY"}, description="Kategorie produktu"),
     *     @OA\Property(
     *         property="productMetas",
     *         type="array",
     *         description="Metadata produktu",
     *         @OA\Items(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=0),
     *             @OA\Property(property="code", type="string", example="GOOGLE_CATEGORY_CODE"),
     *             @OA\Property(property="value", type="string", example="7275")
     *         )
     *     ),
     *     @OA\Property(
     *         property="productPrices",
     *         type="array",
     *         description="Ceny produktu",
     *         @OA\Items(
     *             type="object",     *     @OA\Response(
     *         response=201,
     *         description="Produkt úspěšně vytvořen",
     *         @OA\JsonContent(type="array", ref="#/components/schemas/Product")
     *     ),
     *             @OA\Property(property="id", type="integer", example=0),
     *             @OA\Property(property="value", type="number", format="float", example=983.471),
     *             @OA\Property(property="quantityMin", type="integer", example=0),
     *             @OA\Property(property="customerCode", type="string", example="DSDFEFS"),
     *             @OA\Property(property="productPriceTypeCode", type="string", enum={"A", "B", "C", "D", "ACTION", "CUSTOMER"}, example="A"),
     *             @OA\Property(property="currencyCode", type="string", example="CZK"),
     *             @OA\Property(property="isDiscountable", type="boolean", example=false),
     *             @OA\Property(property="validFrom", type="datetime", example="2025-04-02T14:30:00Z"),
     *             @OA\Property(property="validTo", type="datetime", example="2025-04-03T14:30:00Z"),
     *         )
     *     ),
     *     @OA\Property(
     *         property="attachments",
     *         type="array",
     *         description="Přílohy produktu",
     *         @OA\Items(
     *             type="object",
     *             @OA\Property(property="id", type="integer", example=0),
     *             @OA\Property(property="fileName", type="string", example="manual.pdf"),
     *             @OA\Property(property="urlPath", type="string", example="string"),
     *             @OA\Property(property="attachmentType", type="string", enum={"OBR1", "OBR2", "NAVOD", "SOFT1"}, example="NAVOD"),
     *             @OA\Property(property="attachmentDataAsBase64", type="string", example="string")
     *         )
     *     )
     */
    public function getProductSchema() {}
}