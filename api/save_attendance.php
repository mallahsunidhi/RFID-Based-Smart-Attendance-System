<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include '../config/db_connect.php';
include_once 'send_email.php';
include_once 'send_sms.php';

// ✅ Accept UID from GET or POST
$uid = $_GET['uid'] ?? $_POST['uid'] ?? '';

if (empty($uid)) {
    echo json_encode(["status" => "error", "message" => "UID not provided"]);
    exit;
}

// Escape UID
$uid = mysqli_real_escape_string($conn, $uid);

// ✅ Fetch student details using UID
$query = "SELECT uid, name, class, roll, email, contact FROM students WHERE uid='$uid' LIMIT 1";
$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(["status" => "error", "message" => "Database query failed: " . mysqli_error($conn)]);
    exit;
}

if (mysqli_num_rows($result) == 0) {
    echo json_encode(["status" => "error", "message" => "UID not found in students table"]);
    exit;
}

$student = mysqli_fetch_assoc($result);
$name = $student['name'];
$email = $student['email'];
$contact = $student['contact'];
$class = $student['class'];
$roll = $student['roll'];

// ✅ Check if attendance already recorded today
$check = "SELECT * FROM attendance WHERE uid='$uid' AND date = CURDATE()";
$checkResult = mysqli_query($conn, $check);

if (!$checkResult) {
    echo json_encode(["status" => "error", "message" => "Attendance check failed: " . mysqli_error($conn)]);
    exit;
}

if (mysqli_num_rows($checkResult) > 0) {
    echo json_encode(["status" => "info", "message" => "Attendance already recorded today for $name"]);
    exit;
}

// ✅ Insert new attendance record
$insert = "INSERT INTO attendance (uid, name, class, roll, email, status, check_in_time, date, timestamp)
           VALUES ('$uid', '$name', '$class', '$roll', '$email', 'Present', NOW(), CURDATE(), NOW())";

if (!mysqli_query($conn, $insert)) {
    echo json_encode(["status" => "error", "message" => "Failed to record attendance: " . mysqli_error($conn)]);
    exit;
}

// ✅ Response to Arduino
echo json_encode(["status" => "success", "message" => "Attendance recorded for $name"]);

if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    @ob_end_flush();
    @flush();
}

// ✅ Send Email & SMS notification
try {
    sendEmail($email, $name);
} catch (Exception $e) {
    error_log("Email failed for $email: " . $e->getMessage());
}

try {
    sendSMS($contact, "Attendance marked successfully for $name.");
} catch (Exception $e) {
    error_log("SMS failed for $contact: " . $e->getMessage());
}
?>
