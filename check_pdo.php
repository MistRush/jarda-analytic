<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=trym", "root", "");
    $stmt = $pdo->query("SELECT * FROM common__model__settings");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Count: " . count($rows) . "\n";
    foreach ($rows as $row) {
        echo "ID: {$row['ID']}, Email: " . var_export($row['ContactEmail'], true) . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
