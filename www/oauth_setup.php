<?php
/**
 * OAuth2 token generátor pro Google Analytics
 * Otevřete: http://localhost:8000/oauth_setup.php
 */

$clientSecret = json_decode(file_get_contents(__DIR__ . '/../data/keys/googleapi/client_secret.json'), true);
$client = $clientSecret['installed'] ?? $clientSecret['web'];

$clientId     = $client['client_id'];
$clientSecret = $client['client_secret'];
$redirectUri  = 'http://localhost:8000/oauth_setup.php';

$scopes = implode(' ', [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/webmasters.readonly',
]);

// Krok 2: Zpracování code z Google
if (isset($_GET['code'])) {
    $code = $_GET['code'];

    $response = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query([
                'code'          => $code,
                'client_id'     => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri'  => $redirectUri,
                'grant_type'    => 'authorization_code',
            ]),
        ]
    ]));

    $token = json_decode($response, true);

    if (isset($token['refresh_token'])) {
        $token['expiry_date'] = (time() + ($token['expires_in'] ?? 3600)) * 1000;
        file_put_contents(__DIR__ . '/../data/keys/googleapi/oauth_token.json', json_encode($token, JSON_PRETTY_PRINT));
        echo "<h2 style='color:green;font-family:sans-serif'>✅ Token úspěšně vygenerován a uložen!</h2>";
        echo "<p style='font-family:sans-serif'>Soubor: <code>data/keys/googleapi/oauth_token.json</code></p>";
        echo "<p style='font-family:sans-serif'><a href='/admin/analytics/index'>→ Otevřít Analytics Dashboard</a></p>";
        echo "<pre>" . json_encode($token, JSON_PRETTY_PRINT) . "</pre>";
    } else {
        echo "<h2 style='color:red;font-family:sans-serif'>❌ Chyba:</h2><pre>" . print_r($token, true) . "</pre>";
        echo "<p><a href='/oauth_setup.php'>Zkusit znovu</a></p>";
    }
    exit;
}

// Krok 1: Přesměrování na Google přihlášení
$authUrl = 'https://accounts.google.com/o/oauth2/auth?' . http_build_query([
    'client_id'     => $clientId,
    'redirect_uri'  => $redirectUri,
    'response_type' => 'code',
    'scope'         => $scopes,
    'access_type'   => 'offline',
    'prompt'        => 'consent',  // vynutí vydání refresh_token
]);
?>
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <title>Google Analytics – Nastavení přístupu</title>
    <style>
        body { font-family: sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; }
        .btn { display: inline-block; background: #24c586; color: white; padding: 16px 32px;
               text-decoration: none; border-radius: 8px; font-size: 18px; margin-top: 20px; }
        .btn:hover { background: #1eb077; }
        code { background: #f5f5f5; padding: 3px 8px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🔐 Nastavení Google přístupu</h1>
    <p>Klikněte na tlačítko a <strong>přihlaste se jako</strong>:</p>
    <p><code>analytic.evidsoft@gmail.com</code></p>
    <p>Google vás požádá o souhlas s přístupem k Analytics a Search Console.</p>
    <a href="<?= htmlspecialchars($authUrl) ?>" class="btn">
        Přihlásit se přes Google →
    </a>
    <hr style="margin-top:40px">
    <p style="color:#888;font-size:12px">
        Po přihlášení budete automaticky přesměrováni zpět a token se uloží.
    </p>
</body>
</html>
