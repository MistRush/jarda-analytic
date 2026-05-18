<?php
namespace common\logic\HadexApi\Annotations;

class ProductAttachmentGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product-attachment",
     *     summary="Získání příloh produktu",
     *     description="Tato metoda vrací seznam příloh podle `id`, `productId` nebo `productCode`. Jeden z těchto parametrů je povinný.",
     *     tags={"Product Attachment"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="ID konkrétní přílohy",
     *         @OA\Schema(type="integer", example=123)
     *     ),
     *     @OA\Parameter(
     *         name="productId",
     *         in="query",
     *         required=false,
     *         description="ID produktu, ke kterému přílohy patří",
     *         @OA\Schema(type="integer", example=22)
     *     ),
     *     @OA\Parameter(
     *         name="productCode",
     *         in="query",
     *         required=false,
     *         description="Kód produktu, ke kterému přílohy patří",
     *         @OA\Schema(type="string", example="neco")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Seznam příloh",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=123),
     *                 @OA\Property(property="productId", type="integer", example=22),
     *                 @OA\Property(property="productCode", type="string", example="neco"),
     *                 @OA\Property(property="attachmentType", type="string", example="PDF"),
     *                 @OA\Property(property="urlPath", type="string", example="/uploads/documents/123.pdf"),
     *                 @OA\Property(property="hash", type="string", example="2896927389", description="Hash souboru"),
     *                  @OA\Property(
     *                  property="attachmentDataAsBase64",
     *                  type="string",
     *                  example="/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDA...",
     *                  description="Data přílohy ve formátu Base64"
     *              ),
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chybný požadavek – nebyl poskytnut žádný z parametrů `id`, `productId` nebo `productCode`.",
     *     @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=400, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Chybný požadavek – nebyl poskytnut žádný z parametrů `id`, `productId` nebo `productCode`."),
     *          )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Příloha nebo produkt nenalezeny.",
     *     @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=404, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Příloha nebo produkt nenalezeny.", description="Popis chyby")
     *          )
     *     ),
     *      @OA\Response(
     *          response=401,
     *          description="Neautorizovaný přístup",
     *     @OA\JsonContent(
     *              @OA\Property(property="errorCode", type="integer", example=401, description="Kód chyby"),
     *              @OA\Property(property="message", type="string", example="Neautorizovaný přístup.", description="Popis chyby")
     *          )
     *      ),
     *            @OA\Parameter(
     *            name="Authorization",
     *            in="header",
     *            description="Bearer token for authentication",
     *            required=true,
     *            @OA\Schema(type="string")
     *        )
     * )
     */
    public function getProductAttachmentGetAnnotations() {}
}