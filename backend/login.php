<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db.php';

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check if data received
if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

// Validate inputs
if (!isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit();
}

$email = $data["email"];
$password = $data["password"];

// 🔐 Use prepared statement (SECURE)
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // ⚠️ If using plain password (temporary)
    if ($user["password"] === $password) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Wrong password"]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}

$stmt->close();
$conn->close();

?>
