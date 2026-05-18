<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=trym', 'root', '');
$stmt = $pdo->query('DESCRIBE common__model__settings');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
