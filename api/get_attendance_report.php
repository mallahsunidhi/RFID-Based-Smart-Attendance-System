<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once(__DIR__ . '/../config/db_connect.php');

// Get last 30 days attendance summary (grouped by date)
$query = "
  SELECT 
    date,
    SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) AS present,
    SUM(CASE WHEN status='Absent' THEN 1 ELSE 0 END) AS absent,
    SUM(CASE WHEN status='Late' THEN 1 ELSE 0 END) AS late
  FROM attendance
  WHERE date >= CURDATE() - INTERVAL 30 DAY
  GROUP BY date
  ORDER BY date ASC
";

$result = mysqli_query($conn, $query);
$data = [];

if ($result && mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
      'date' => $row['date'],
      'Present' => (int)$row['present'],
      'Absent' => (int)$row['absent'],
      'Late' => (int)$row['late']
    ];
  }
}

echo json_encode($data);
?>
