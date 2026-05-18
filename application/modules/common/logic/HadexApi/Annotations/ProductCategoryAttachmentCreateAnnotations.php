<?php
namespace common\logic\HadexApi\Annotations;

class CategoryAttachmentCreateAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/product-category-attachment",
     *     summary="Vytvoření přílohy produktu",
     *     description="Tato metoda slouží k vytvoření přílohy k produktu. Autorizace probíhá přes Bearer token.",
     *     tags={"Product Category Attachment"},
     *     @OA\RequestBody(
     *         description="Povinné údaje pro vytvoření přílohy jsou buď categoryId nebo categoryCode, hash, attachmentType, urlPath nebo attachmentDataAsBase64",
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *               @OA\Items(
     *     required={"productId", "productCode", "attachmentType", "urlPath", "hash"},
     *             @OA\Property(property="categoryId", type="integer", example=22, description="ID kategorie"),
     *             @OA\Property(property="categoryCode", type="string", example="neco", description="Kód kategorie"),
     *             @OA\Property(property="fileName", type="string", example="_67kabelspojky.jpg", description="Název souboru"),
     *             @OA\Property(property="urlPath", type="string", example="", description="URL cesta k souboru"),
     *             @OA\Property(
     *                 property="attachmentDataAsBase64",
     *                 type="string",
     *                 example="/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDA...",
     *                 description="Data přílohy ve formátu Base64"
     *             ),
     *             @OA\Property(property="hash", type="string", example="2896927389", description="Hash souboru"),
     *             @OA\Property(property="alt", type="string", example="_67kabelspojky", description="Alt text obrázku"),
     *             @OA\Property(
     *                 property="attachmentType",
     *                 type="string",
     *                 enum={"CATEGORY"},
     *                 example="OBR1",
     *                 description="Typ přílohy"
     *             ),
     *             @OA\Property(property="objectCode", type="string", example="_67KABELSPOJKY", description="Kód objektu")
     *           )
     *         ),
     *         @OA\Schema(
     *             required={
     *                 "attachmentType",
     *                 "productId or productCode",
     *                 "urlPath or attachmentDataAsBase64"
     *             }
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Úspěšná odpověď s vytvořenou přílohou",
     *         @OA\JsonContent(
     *             type="array",
     *              @OA\Items(ref="#/components/schemas/ProductCategoryAttachment")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chybí povinné parametry",
     *         @OA\JsonContent(
     *             @OA\Property(property="errorCode", type="integer", example=400, description="Kód chyby"),
     *             @OA\Property(property="message", type="string", example="Attachment Type, Product ID or Product Code, and either URL Path or Base64 data are required.", description="Popis chyby")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Interní chyba serveru",
     *         @OA\JsonContent(
     *             @OA\Property(property="errorCode", type="integer", example=500, description="Kód chyby"),
     *             @OA\Property(property="message", type="string", example="Chyba při zpracování požadavku", description="Popis chyby")
     *         )
     *     ),
     *           @OA\Response(
     *           response=401,
     *           description="Neautorizovaný přístup",
     *      @OA\JsonContent(
     *               @OA\Property(property="errorCode", type="integer", example=401, description="Kód chyby"),
     *               @OA\Property(property="message", type="string", example="Neautorizovaný přístup.", description="Popis chyby")
     *           )
     *       ),
     *           @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token for authentication",
     *           required=true,
     *           @OA\Schema(type="string")
     *       )
     * )
     */
    public function getProductAttachmentCreateAnnotations() {}
}