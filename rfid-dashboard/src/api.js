// api.js
export const fetchTopAttendance = async () => {
  const res = await fetch("http://localhost/rfid_attendance_system/api/get_top_attendance.php");
  if (!res.ok) throw new Error("Failed to fetch top attendance");
  return await res.json();
};

export const fetchAttendanceReport = async () => {
  const res = await fetch("http://localhost/rfid_attendance_system/api/get_attendance_report.php");
  if (!res.ok) throw new Error("Failed to fetch attendance report");
  return await res.json();
};
export const fetchWeeklyComparison = async () => {
  const res = await fetch("http://localhost/rfid_attendance_system/api/get_weekly_comparison.php");
  return res.json();
};
