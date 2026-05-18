<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryAttachmentUpdateAnnotations {
    /**
     * @OA\Put(
     *     path="/hadex-api/product-category-attachment",
     *     summary="Aktualizace přílohy kategorie",
     *     description="Tato metoda slouží k aktualizaci existující přílohy kategorie. Autorizace probíhá přes Bearer token.",
     *     tags={"Product Category Attachment"},
     *     @OA\RequestBody(
     *         description="Údaje pro aktualizaci přílohy",
     *         required=true,
     *       @OA\JsonContent(
     *           type="array",
     *               @OA\Items(
     *             required={"id"},
     *             @OA\Property(property="id", type="integer", example=123, description="ID přílohy, která má být aktualizována"),
     *             @OA\Property(property="categoryId", type="integer", example=22, description="ID produktu"),
     *             @OA\Property(property="categoryCode", type="string", example="neco", description="Kód produktu"),
     *             @OA\Property(property="fileName", type="string", example="_67kabelspojky.jpg", description="Název souboru"),
     *             @OA\Property(property="urlPath", type="string", example="", description="URL cesta k souboru"),
     *             @OA\Property(property="hash", type="string", example="2896927389", description="Hash souboru"),
     *             @OA\Property(property="attachmentDataAsBase64", type="string", example="data:image/png;base64,iVBORw0KGgoAAAANS...", description="Příloha ve formátu Base64"),
     *             @OA\Property(property="attachmentType", type="string", example="CATEGORY", description="Typ přílohy")
     *         )
     *        )
     *     ),
     * @OA\Response(
     *         response=200,
     *         description="Úspěšná odpověď s vytvořenou přílohou",
     *         @OA\JsonContent(
     *             type="array",
     *              @OA\Items(ref="#/components/schemas/ProductCategoryAttachment")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chybí povinné ID nebo attachmentType",
     * @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=400, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Chybí povinné ID nebo attachmentType", description="Popis chyby")
     *          )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Příloha s daným ID nebyla nalezena",
     *     @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=404, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Příloha s daným ID nebyla nalezena", description="Popis chyby")
     *          )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovaný přístup",
     *     @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=401, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Neautorizovaný přístup", description="Popis chyby")
     *          )
     *     ),
     *            @OA\Parameter(
     *            name="Authorization",
     *            in="header",
     *            description="Bearer token for authentication",
     *            required=true,
     *            @OA\Schema(type="string")
     *        )
     * )
     */

    public function getProductAttachmentUpdateAnnotations() {}
}