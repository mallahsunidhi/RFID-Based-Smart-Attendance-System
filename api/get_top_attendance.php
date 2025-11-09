<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
include_once(__DIR__ . '/../config/db_connect.php');

$query = "
  SELECT 
    s.uid,
    s.name,
    s.class,
    s.roll,
    ROUND(
      (SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.date)) * 100,
      2
    ) AS attendance_percentage
  FROM students s
  JOIN attendance a ON s.uid = a.uid
  GROUP BY s.uid, s.name, s.class, s.roll
  ORDER BY attendance_percentage DESC
  LIMIT 5
";

$result = mysqli_query($conn, $query);

$top_attendance = [];

if ($result && mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $top_attendance[] = $row;
  }
}

echo json_encode($top_attendance);
?>
