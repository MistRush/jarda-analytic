<?php
namespace common\logic\HadexApi\Annotations;

class CustomerCreateAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/customer",
     *     summary="Create a new customer",
     *     description="Creates a new customer with the given details.",
     *     tags={"Customer"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 required={"login", "externalId"},
     *                 @OA\Property(property="login", type="string", example="ferdinand.krupke@seznam.cz"),
     *                 @OA\Property(property="firstName", type="string", example="Jacek"),
     *                 @OA\Property(property="lastName", type="string", example="Jošt"),
     *                 @OA\Property(property="code", type="string", example="DFSFSF"),
     *                 @OA\Property(property="companyName", type="string", nullable=true, example="KrupkeInvest"),
     *                 @OA\Property(property="identification", type="string", nullable=true, example="24564654"),
     *                 @OA\Property(property="taxIdentification", type="string", nullable=true, example="CZ24564654"),
     *                 @OA\Property(property="state", type="string", example="CZ"),
     *                 @OA\Property(property="street", type="string", example="Příční 25"),
     *                 @OA\Property(property="city", type="string", example="Opava"),
     *                 @OA\Property(property="zipCode", type="string", example="74706"),
     *                 @OA\Property(property="phone", type="string", example="123456789"),
     *                 @OA\Property(property="email", type="string", example="krupke@seznam.cz"),
     *                 @OA\Property(property="active", type="boolean", example=true),
     *                 @OA\Property(property="externalId", type="integer", example=222),
     *                 @OA\Property(property="basePriceTypeCode", type="string", nullable=true, example="ToDo"),
     *                 @OA\Property(property="discount", type="integer", example=0),
     *                 @OA\Property(property="deactivateQuantityMin", type="boolean", example=false),
     *                 @OA\Property(property="allowInvoicePayment", type="integer", nullable=true, example=null),
     *                 @OA\Property(
     *                     property="customerMetas",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="code", type="string", example="RATING"),
     *                         @OA\Property(property="value", type="string", example="25")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Customer created successfully",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="id", type="string", example="22"),
     *                 @OA\Property(property="createdOnUtc", type="string", format="date-time", example="2025-03-11T09:37:22.000Z"),
     *                 @OA\Property(property="updatedOnUtc", type="string", format="date-time", example="2025-03-11T09:37:22.000Z"),
     *                 @OA\Property(property="login", type="string", example="ferdinand.krupke@seznam.cz"),
     *                 @OA\Property(property="firstName", type="string", example="Jacek"),
     *                 @OA\Property(property="lastName", type="string", example="Jošt"),
     *                 @OA\Property(property="code", type="string", example="DFSFSF"),
     *                 @OA\Property(property="companyName", type="string", nullable=true, example="KrupkeInvest"),
     *                 @OA\Property(property="identification", type="string", nullable=true, example="24564654"),
     *                 @OA\Property(property="taxIdentification", type="string", nullable=true, example="CZ24564654"),
     *                 @OA\Property(property="state", type="string", example="CZ"),
     *                 @OA\Property(property="street", type="string", example="Příční 25"),
     *                 @OA\Property(property="city", type="string", example="Opava"),
     *                 @OA\Property(property="zipCode", type="string", example="74706"),
     *                 @OA\Property(property="phone", type="string", example="123456789"),
     *                 @OA\Property(property="email", type="string", example="krupke@seznam.cz"),
     *                 @OA\Property(property="active", type="boolean", example=true),
     *                 @OA\Property(property="synced", type="boolean", example=true),
     *                 @OA\Property(property="externalId", type="integer", example=222),
     *                 @OA\Property(property="basePriceTypeCode", type="string", nullable=true, example=null),
     *                 @OA\Property(property="discount", type="integer", example=0),
     *                 @OA\Property(property="allowInvoicePayment", type="integer", example=0),
     *                 @OA\Property(
     *                     property="customerMetas",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="string", example="2"),
     *                         @OA\Property(property="code", type="string", example="RATING"),
     *                         @OA\Property(property="value", type="string", example="25")
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid request",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Missing required fields: login or externalId")
     *         )
     *     )
     * )
     */


    public function getCustomerCreateAnnotations() {}
}