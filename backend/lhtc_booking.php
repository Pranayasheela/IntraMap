<?php
require_once "db.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit();

// ─────────────────────────────────────────────
// AUTO CLEANUP
// ─────────────────────────────────────────────
function cleanupExpiredBookings($conn) {
    $today   = date("Y-m-d");
    $nowTime = date("H:i:s");

    $stmt = $conn->prepare("
        DELETE FROM lhtc_bookings
        WHERE date < ?
           OR (date = ? AND end_time <= ?)
    ");
    $stmt->bind_param("sss", $today, $today, $nowTime);
    $stmt->execute();
    $stmt->close();
}

// ─────────────────────────────────────────────
// OVERLAP CHECK
// ─────────────────────────────────────────────
function hasOverlap($conn, $room, $date, $startTime, $endTime) {
    $stmt = $conn->prepare("
        SELECT id FROM lhtc_bookings
        WHERE room_name = ?
          AND date = ?
          AND start_time < ?
          AND end_time > ?
    ");
    $stmt->bind_param("ssss", $room, $date, $endTime, $startTime);
    $stmt->execute();
    $stmt->store_result();
    $found = $stmt->num_rows > 0;
    $stmt->close();
    return $found;
}

$method = $_SERVER["REQUEST_METHOD"];

// ─────────────────────────────────────────────
// POST → CREATE BOOKING
// ─────────────────────────────────────────────
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"), true);

    $room      = trim($data["room_name"]  ?? "");
    $floor     = trim($data["floor"]      ?? "");
    $date      = trim($data["date"]       ?? "");
    $startTime = trim($data["start_time"] ?? "");
    $endTime   = trim($data["end_time"]   ?? "");
    $bookedBy  = trim($data["booked_by"]  ?? "");
    $purpose   = trim($data["purpose"]    ?? "");

    if (!$room || !$floor || !$date || !$startTime || !$endTime || !$bookedBy || !$purpose) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }

    $startTime = date("H:i:s", strtotime($startTime));
    $endTime   = date("H:i:s", strtotime($endTime));

    $start = new DateTime("$date $startTime");
    $end   = new DateTime("$date $endTime");
    $now   = new DateTime();

    if ($start <= $now) {
        echo json_encode([
            "status"  => "error",
            "message" => "Start time has already passed. Please choose a future time."
        ]);
        exit();
    }

    if ($end <= $start) {
        echo json_encode([
            "status"  => "error",
            "message" => "End time must be after start time."
        ]);
        exit();
    }

    cleanupExpiredBookings($conn);

    if (hasOverlap($conn, $room, $date, $startTime, $endTime)) {
        echo json_encode([
            "status"  => "error",
            "message" => "This room is already booked during that time slot. Please choose a different time."
        ]);
        exit();
    }

    $stmt = $conn->prepare("
        INSERT INTO lhtc_bookings (room_name, floor, date, start_time, end_time, booked_by, purpose)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssssss", $room, $floor, $date, $startTime, $endTime, $bookedBy, $purpose);

    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Room booked successfully.",
            "id"      => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Booking failed. Try again."
        ]);
    }

    $stmt->close();
}

// ─────────────────────────────────────────────
// GET → FETCH BOOKINGS
// ─────────────────────────────────────────────
elseif ($method === "GET") {

    $room = trim($_GET["room"] ?? "");

    if (!$room) {
        echo json_encode(["status" => "error", "message" => "Room name is required."]);
        exit();
    }

    cleanupExpiredBookings($conn);

    $stmt = $conn->prepare("
        SELECT id, room_name, floor, date, start_time, end_time, booked_by, purpose
        FROM lhtc_bookings
        WHERE room_name = ?
        ORDER BY date ASC, start_time ASC
    ");
    $stmt->bind_param("s", $room);
    $stmt->execute();

    $result   = $stmt->get_result();
    $bookings = [];

    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }

    echo json_encode([
        "status"   => "success",
        "bookings" => $bookings
    ]);

    $stmt->close();
}

// ─────────────────────────────────────────────
// DELETE → CANCEL BOOKING
// ─────────────────────────────────────────────
elseif ($method === "DELETE") {

    $data = json_decode(file_get_contents("php://input"), true);
    $id   = intval($data["id"] ?? 0);

    if (!$id) {
        echo json_encode(["status" => "error", "message" => "Booking ID is required."]);
        exit();
    }

    cleanupExpiredBookings($conn);

    $stmt = $conn->prepare("DELETE FROM lhtc_bookings WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute() && $conn->affected_rows > 0) {
        echo json_encode([
            "status"  => "success",
            "message" => "Booking cancelled."
        ]);
    } else {
        echo json_encode([
            "status"  => "error",
            "message" => "Booking not found."
        ]);
    }

    $stmt->close();
}

else {
    http_response_code(405);
    echo json_encode([
        "status"  => "error",
        "message" => "Method not allowed."
    ]);
}

$conn->close();
?>