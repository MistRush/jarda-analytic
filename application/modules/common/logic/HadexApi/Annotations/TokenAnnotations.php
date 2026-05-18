<?php
namespace common\logic\HadexApi\Annotations;

class TokenAnnotations {
    /**
     * @OA\Post(
     *     path="/hadex-api/token",
     *     summary="Generuje přístupový token pro uživatele",
     *     description="Endpoint pro získání access tokenu na základě přihlašovacích údajů.",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             type="object",
     *             required={"Username", "Password"},
     *             @OA\Property(property="Username", type="string", example="YOUR_USERNAME", description="Uživatelské jméno pro autentizaci"),
     *             @OA\Property(property="Password", type="string", example="YOUR_PASSWORD", description="Heslo pro autentizaci")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Úspěšné přihlášení",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="code", type="integer", example=200, description="Kód odpovědi"),
     *             @OA\Property(property="status", type="string", example="success", description="Stav odpovědi"),
     *             @OA\Property(property="message", type="string", example="Access token for user YOUR_USERNAME", description="Zpráva pro uživatele"),
     *             @OA\Property(property="accessToken", type="string", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description="JWT token pro autentizaci dalších požadavků")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Chybějící povinné údaje",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="code", type="integer", example=400, description="Kód odpovědi"),
     *             @OA\Property(property="status", type="string", example="error", description="Stav odpovědi"),
     *             @OA\Property(property="message", type="string", example="Username and Password are required", description="Chybová zpráva")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Neautorizovaný přístup",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="code", type="integer", example=401, description="Kód odpovědi"),
     *             @OA\Property(property="status", type="string", example="error", description="Stav odpovědi"),
     *             @OA\Property(property="message", type="string", example="Invalid credentials", description="Chybová zpráva")
     *         )
     *     )
     * )
     */
    public function getTokenAnnotations() {}
}