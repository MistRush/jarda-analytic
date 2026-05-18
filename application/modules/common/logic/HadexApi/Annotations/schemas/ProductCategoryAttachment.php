<?php

namespace common\logic\HadexApi\Annotations\schemas;

/**
 * @OA\Schema(
 *      schema="ProductCategoryAttachment",
 *      type="object"
 * )
 */
class ProductCategoryAttachment {
    /**
     *     required={"id", "categoryId", "fileName", "urlPath", "hash", "alt", "attachmentType","attachmentDataAsBase64"},
     *     @OA\Property(
     *         property="id",
     *         type="integer",
     *         description="Jedinečný identifikátor přílohy"
     *     ),
     *     @OA\Property(
     *         property="categoryId",
     *         type="integer",
     *         description="ID souvisejícího produktu"
     *     ),
     *     @OA\Property(
     *         property="fileName",
     *         type="string",
     *         description="Název souboru"
     *     ),
     *     @OA\Property(
     *         property="urlPath",
     *         type="string",
     *         description="Cesta k URL souboru"
     *     ),
     *     @OA\Property(
     *         property="hash",
     *         type="string",
     *         description="Jedinečný hash přílohy"
     *     ),
     *     @OA\Property(
     *         property="alt",
     *         type="string",
     *         description="Alternativní text k obrázku nebo souboru"
     *     ),
     *     @OA\Property(
     *         property="attachmentType",
     *         type="string",
     *         description="Typ přílohy CATEGORY"
     *     )
     */
    public function getProductCategoryAttachmentSchema() {}
}