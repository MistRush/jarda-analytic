<?php
namespace common\logic\HadexApi\Annotations;

class OrderGetAnnotations {
    /**
     * @OA\Get(
     *     path="/hadex-api/order",
     *     summary="Get order details",
     *     description="Returns details of an order based on the given ID or changes since a specific date.",
     *     tags={"Order"},
     *     @OA\Parameter(
     *         name="id",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="changedSince",
     *         in="query",
     *         required=false,
     *         description="Return orders changed since this date (ISO 8601 format).",
     *         @OA\Schema(type="string", format="date-time")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful response",
     *             @OA\JsonContent(
     *               type="array",
     *                @OA\Items(ref="#/components/schemas/Order")
     *             )
     *        ),
     *             @OA\Parameter(
     *             name="Authorization",
     *             in="header",
     *             description="Bearer token for authentication",
     *             required=true,
     *             @OA\Schema(type="string")
     *         )
     * )
     */

    public function getOrderAnnotations() {}
}