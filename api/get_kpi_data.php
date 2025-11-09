<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include("../config/db_connect.php"); // ✅ Adjust path if needed

$response = [];

// ✅ Total students
$studentQuery = $conn->query("SELECT COUNT(*) AS total_students FROM students");
$response['total_students'] = $studentQuery ? $studentQuery->fetch_assoc()['total_students'] : 0;

// ✅ Today's stats
$today = date('Y-m-d');

// Total present today
$presentQuery = $conn->query("SELECT COUNT(*) AS present_today FROM attendance WHERE date = '$today' AND status = 'Present'");
$response['present_today'] = $presentQuery ? $presentQuery->fetch_assoc()['present_today'] : 0;

// Total absent today
$absentQuery = $conn->query("SELECT COUNT(*) AS absent_today FROM attendance WHERE date = '$today' AND status = 'Absent'");
$response['absent_today'] = $absentQuery ? $absentQuery->fetch_assoc()['absent_today'] : 0;

// Total late today
$lateQuery = $conn->query("SELECT COUNT(*) AS late_today FROM attendance WHERE date = '$today' AND status = 'Late'");
$response['late_today'] = $lateQuery ? $lateQuery->fetch_assoc()['late_today'] : 0;


// ✅ 🔥 NEW SECTION — Last Month Summary for Bar Chart
$lastMonthStart = date('Y-m-01', strtotime('-1 month'));
$lastMonthEnd = date('Y-m-t', strtotime('-1 month'));

$monthQuery = $conn->query("
    SELECT
        SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS total_present_last_month,
        SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) AS total_absent_last_month,
        SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END) AS total_late_last_month
    FROM attendance
    WHERE date BETWEEN '$lastMonthStart' AND '$lastMonthEnd'
");

if ($monthQuery) {
    $monthData = $monthQuery->fetch_assoc();
    $response['total_present_last_month'] = $monthData['total_present_last_month'] ?? 0;
    $response['total_absent_last_month'] = $monthData['total_absent_last_month'] ?? 0;
    $response['total_late_last_month'] = $monthData['total_late_last_month'] ?? 0;
} else {
    $response['total_present_last_month'] = 0;
    $response['total_absent_last_month'] = 0;
    $response['total_late_last_month'] = 0;
}

// ✅ Return JSON
echo json_encode($response);
?>
