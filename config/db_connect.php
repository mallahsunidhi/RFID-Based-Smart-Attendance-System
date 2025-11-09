<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "rfid_attendance";  // Change if your DB name is different

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]));
}
?>
