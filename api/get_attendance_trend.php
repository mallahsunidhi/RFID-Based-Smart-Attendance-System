<?php
header("Access-Control-Allow-Origin: *");  // ✅ Allow React frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include '../config/db_connect.php';

// ✅ Generate last 30 days (even if no data)
$query = "
WITH dates AS (
  SELECT CURDATE() - INTERVAL (a.a + (10 * b.a)) DAY AS date
  FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 
        UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) a
  CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2) b
)
SELECT 
  d.date AS date,
  COALESCE(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END), 0) AS present_count,
  COALESCE(SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END), 0) AS absent_count,
  COALESCE(SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END), 0) AS late_count
FROM dates d
LEFT JOIN attendance a ON DATE(a.date) = d.date
GROUP BY d.date
ORDER BY d.date;
";

$result = mysqli_query($conn, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        'date' => $row['date'],
        'Present' => (int)$row['present_count'],
        'Absent' => (int)$row['absent_count'],
        'Late' => (int)$row['late_count']
    ];
}

echo json_encode($data, JSON_PRETTY_PRINT);
?>
