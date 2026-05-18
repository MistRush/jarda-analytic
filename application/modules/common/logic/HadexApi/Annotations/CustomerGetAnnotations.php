<?php
namespace common\logic\HadexApi\Annotations;

class CustomerGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/customer",
     *     summary="Získat zákazníky",
     *     description="Vrátí seznam zákazníků. Lze filtrovat podle ID nebo podle času změny.",
     *     tags={"Customer"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         description="ID zákazníka",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="changedSince",
     *         in="query",
     *         required=false,
     *         description="Vrací jen zákazníky změněné od tohoto data (ISO 8601)",
     *         @OA\Schema(type="string", format="date-time")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Seznam zákazníků",
     *     @OA\JsonContent(
     *                type="array",
     *                 @OA\Items(ref="#/components/schemas/Customer")
     *              )
     *     ),
 *   @OA\Response(
 *       response=404,
 *       description="Chyba: Zákazník nebyl nalezen.",
 *       @OA\JsonContent(
 *           type="object",
 *           @OA\Property(property="status", type="integer", example="not found", description="Stav"),
 *           @OA\Property(property="code", type="integer", example=404, description="Kód chyby"),
 *           @OA\Property(property="message", type="string", example="Product not found.")
 *       )
 *   ),
 *         @OA\Response(
 *         response=401,
 *         description="Neautorizovaný přístup",
 *    @OA\JsonContent(
 *        @OA\Property(property="status", type="integer", example="unauthorized", description="Stav"),
 *             @OA\Property(property="code", type="integer", example=401, description="Kód chyby"),
 *             @OA\Property(property="message", type="string", example="Neautorizovaný přístup.", description="Popis chyby")
 *         )
 *     ),
     *              @OA\Parameter(
     *              name="Authorization",
     *              in="header",
     *              description="Bearer token for authentication",
     *              required=true,
     *              @OA\Schema(type="string")
     *          )
     * )
     */


    public function getCustomerAnnotations() {}
}