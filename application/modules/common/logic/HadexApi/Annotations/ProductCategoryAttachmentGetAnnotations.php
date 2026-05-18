<?php
namespace common\logic\HadexApi\Annotations;

class ProductCategoryAttachmentGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/product-category-attachment",
     *     summary="Získání příloh kategorie",
     *     description="Tato metoda vrací seznam příloh podle `id`, `categoryId` nebo `categoryCode`. Jeden z těchto parametrů je povinný.",
     *     tags={"Product Category Attachment"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="ID konkrétní přílohy",
     *         @OA\Schema(type="integer", example=123)
     *     ),
     *     @OA\Parameter(
     *         name="categoryId",
     *         in="query",
     *         required=false,
     *         description="ID kategorie, ke kterému přílohy patří",
     *         @OA\Schema(type="integer", example=22)
     *     ),
     *     @OA\Parameter(
     *         name="productCode",
     *         in="query",
     *         required=false,
     *         description="Kód kateogire, ke kterému přílohy patří",
     *         @OA\Schema(type="string", example="neco")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Seznam příloh",
     *        @OA\JsonContent(
     *              type="array",
     *               @OA\Items(ref="#/components/schemas/ProductCategoryAttachment")
     *          )
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