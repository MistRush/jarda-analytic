<?php

namespace common\logic\HadexApi\Annotations\schemas;

/**
 * @OA\Schema(
 *      schema="Customer",
 *      type="object"
 * )
 */
class Customer {
    /**
     * @OA\Property(property="id", type="string", example="1"),
    *               @OA\Property(property="createdOnUtc", type="string", format="date-time", example="2025-02-17T13:47:18.382Z"),
    *               @OA\Property(property="updatedOnUtc", type="string", format="date-time", example="2025-02-17T13:47:18.382Z"),
    *               @OA\Property(property="login", type="string", example="admin"),
    *               @OA\Property(property="code", type="string", example="DFSFSF"),
    *               @OA\Property(property="firstName", type="string", example=""),
    *               @OA\Property(property="lastName", type="string", nullable=true),
    *               @OA\Property(property="companyName", type="string", nullable=true),
    *               @OA\Property(property="identification", type="string", nullable=true),
    *               @OA\Property(property="taxIdentification", type="string", nullable=true),
    *               @OA\Property(property="state", type="string", nullable=true),
    *               @OA\Property(property="street", type="string", example="Příční 25"),
    *               @OA\Property(property="city", type="string", nullable=true),
    *               @OA\Property(property="zipCode", type="string", nullable=true),
    *               @OA\Property(property="phone", type="string", nullable=true),
    *               @OA\Property(property="email", type="string", nullable=true),
    *               @OA\Property(property="active", type="boolean", example=true),
    *               @OA\Property(property="synced", type="boolean", example=false),
    *               @OA\Property(property="externalId", type="string", nullable=true),
    *               @OA\Property(property="basePriceTypeCode", type="string", example="ToDo"),
    *               @OA\Property(property="discount", type="integer", example=0),
    *               @OA\Property(property="deactivateQuantityMin", type="boolean", example=false),
    *               @OA\Property(property="allowInvoicePayment", type="boolean", nullable=true),
    *               @OA\Property(
    *                   property="customerMetas",
    *                   type="array",
    *                   description="Metadata zákazníka",
    *                   @OA\Items(type="object",
     *                           @OA\Property(property="id", type="string", example="1"),
     *                @OA\Property(property="code", type="string", example="TEST"),
     *                @OA\Property(property="value", type="string", nullable="some string"),
     *                     )
    *               )
    *           )
     *     )
     */
    public function getCustomerSchema() {}
}