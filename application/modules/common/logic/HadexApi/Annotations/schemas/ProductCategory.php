<?php

namespace common\logic\HadexApi\Annotations\schemas;

/**
 * @OA\Schema(
 *      schema="ProductCategory",
 *      type="object"
 * )
 */
class ProductCategory {
    /**
*                 @OA\Property(property="id", type="integer", example="2"),
*                 @OA\Property(property="code", type="string", example="TESTOVACI_KATEGORIE_4"),
*                 @OA\Property(property="isAvailable", type="boolean", example=true),
*                 @OA\Property(property="parentProductCategoryID", type="integer", nullable=true, example=null),
*                 @OA\Property(property="parentProductCategoryCode", type="string", nullable=true, example=null),
*                 @OA\Property(property="metaTitle", type="string", example="Testovací kategorie 3 meta"),
*                 @OA\Property(property="metaDescription", type="string", example="Testovací popis meta"),
*                 @OA\Property(property="name", type="string", example="Testovací kategorie 3"),
*                 @OA\Property(property="headline", type="string", example="Nadpis pro h1"),
*                 @OA\Property(property="shortDescription", type="string", example="Krátký popis kategorie"),
*                 @OA\Property(property="description", type="string", example="Jenom něco zkouším"),
*                 @OA\Property(property="url", type="string", example="testovaci-kategorie"),
*                 @OA\Property(property="note", type="string", example="Jen pro testy"),
*                 @OA\Property(property="rank", type="integer", example="1"),
*                 @OA\Property(
*                     property="attachments",
*                     type="array",
*                     @OA\Items(
*                         @OA\Property(property="fileName", type="string", example="Testovaci obrazek"),
*                         @OA\Property(property="urlPath", type="string", example="https://hadex.cz/img/zbozi/pre/m373d.jpg"),
*                         @OA\Property(property="hash", type="string", example="nejakyhash"),
*                         @OA\Property(property="alt", type="string", example="string"),
*                         @OA\Property(property="attachmentType", type="string", example="CATEGORY")
*                     )
*                 ),
*                 @OA\Property(
*                     property="productCategoryMetas",
*                     type="array",
*                     @OA\Items(
*                         @OA\Property(property="code", type="string", example="TESTOVACI_KATEGORIE_META"),
*                         @OA\Property(property="value", type="string", example="test")
*                     )
*                 )
     * */
    public function getProductCategorySchema() {}
}