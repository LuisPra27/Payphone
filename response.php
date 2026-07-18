<?php
// 1. Capturar parámetros y validar que existan
$id = isset($_GET["id"]) ? (int)$_GET["id"] : 0;
$clientTxId = isset($_GET["clientTransactionId"]) ? $_GET["clientTransactionId"] : "";

if ($id === 0 || empty($clientTxId)) {
    die("<h2>Error: No se recibieron los parámetros de la transacción.</h2>");
}

// 2. Credenciales
$token = "MH6_LOtu5OI4o4qmPxT70VGVeeT181uPdbeb4oIFBDlkzKckD7p6s0TMc4a-F5EIU3_aE7rmbhn2SnBb4mt0qvGGkJBpvTpSEvHdoStJgnusCLrMB3JTXXknaVwfGbue8FJYWp2hSyImwHODeDxGnDjq63Lsmn7Op0VSBBtR5sua81v15wj1mZ6PDvv9gLfNOCZBcPVKqXVLYHkwLn5UzMWUP6Hl-KQ2UMFEND4ogzFShWxrikoDSBqvbCcq6yfetBwODnLiF7dPatPC5Mf-lTYCD-y85tSSjIZcp-UwUXFChJB2ozAWp4CuCrJU0nBfaqriCcaCi5Fq0j97_oBiCY-IiyU";

$headers = [
    "Authorization: Bearer " . $token,
    "Content-Type: application/json"
];

$data = ["id" => $id, "clientTxId" => $clientTxId];
$json = json_encode($data);

// 3. Solicitud POST con cURL
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://paymentbox.payphonetodoesposible.com/api/confirm");
curl_setopt($curl, CURLOPT_POST, 1);
curl_setopt($curl, CURLOPT_POSTFIELDS, $json);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($curl);
$curl_error = curl_error($curl); // Capturar posible error de conexión
curl_close($curl);

if ($response === false) {
    die("<h2>Error de conexión con la pasarela de pagos: " . htmlspecialchars($curl_error) . "</h2>");
}

$result = json_decode($response, true);

if (!$result || isset($result['error'])) {
    die("<h2>Error: Respuesta inválida desde el servidor de pago.</h2><pre>" . htmlspecialchars($response) . "</pre>");
}

if (isset($result["transactionStatus"]) && $result["transactionStatus"] === "Approved") {
    echo "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #27ae60; border-radius: 8px; background-color: #eafaf1; max-width: 500px;'>";
    echo "<h2 style='color: #27ae60; margin-top: 0;'>✅ Pago Aprobado</h2>";
    echo "<p><strong>ID de Transacción:</strong> " . htmlspecialchars($result["transactionId"]) . "</p>";
    echo "<p><strong>Código de Autorización:</strong> " . htmlspecialchars($result["authorizationCode"]) . "</p>";
    echo "<p><strong>Monto cobrado:</strong> $" . number_format($result["amount"] / 100, 2) . " USD</p>";
    echo "</div>";
} else {
    $estado = isset($result["transactionStatus"]) ? $result["transactionStatus"] : "Desconocido";
    echo "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #e74c3c; border-radius: 8px; background-color: #fceae9; max-width: 500px;'>";
    echo "<h2 style='color: #e74c3c; margin-top: 0;'>❌ Pago No Aprobado</h2>";
    echo "<p><strong>Estado:</strong> " . htmlspecialchars($estado) . "</p>";
    echo "</div>";
}

/*
echo "<br><hr><br><h3>Detalles técnicos (Debug):</h3>";
echo "<pre style='background: #f4f4f4; padding: 10px; border-radius: 4px;'>" . json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "</pre>";
?>
*/