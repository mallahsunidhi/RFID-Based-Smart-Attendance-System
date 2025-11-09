<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// ✅ Include DB connection
include_once("../config/db_connect.php");

// Get current week and last week dates
$today = date('Y-m-d');
$thisMonday = date('Y-m-d', strtotime('monday this week', strtotime($today)));
$lastMonday = date('Y-m-d', strtotime('monday last week', strtotime($today)));
$lastSunday = date('Y-m-d', strtotime('sunday last week', strtotime($today)));

// Helper function to get attendance by date range
function getWeeklyData($conn, $startDate, $endDate) {
    $data = [];
    $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    
    foreach ($days as $i => $day) {
        $date = date('Y-m-d', strtotime("+$i day", strtotime($startDate)));
        $query = "
            SELECT 
                SUM(CASE WHEN status IN ('Present', 'Late') THEN 1 ELSE 0 END) AS present_count
            FROM attendance 
            WHERE DATE(date) = '$date'
        ";
        $result = $conn->query($query);
        $row = $result ? $result->fetch_assoc() : ['present_count' => 0];
        $data[] = ['day' => $day, 'count' => (int)$row['present_count']];
    }
    return $data;
}

$thisWeekData = getWeeklyData($conn, $thisMonday, $today);
$lastWeekData = getWeeklyData($conn, $lastMonday, $lastSunday);

// Merge both weeks by day
$response = [];
foreach ($thisWeekData as $index => $dayData) {
    $response[] = [
        'day' => $dayData['day'],
        'thisWeek' => $dayData['count'],
        'lastWeek' => $lastWeekData[$index]['count']
    ];
}

echo json_encode($response);
?>
