<?php
try {
    $pdo = new PDO("mysql:host=127.0.0.1", "root", "");
    $pdo->exec("CREATE DATABASE IF NOT EXISTS trym CHARACTER SET utf8 COLLATE utf8_czech_ci");
    echo "Databáze 'trym' byla vytvořena.\n";
} catch (PDOException $e) {
    echo "CHYBA: " . $e->getMessage() . "\n";
}
