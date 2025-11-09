import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { fetchWeeklyComparison } from "./api";

import {
  FaUserGraduate,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaChartLine,
  FaMedal,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// ✅ API Endpoints
const KPI_URL = "http://localhost/rfid_attendance_system/api/get_kpi_data.php";
const TREND_URL = "http://localhost/rfid_attendance_system/api/get_attendance_trend.php";
const TOP_URL = "http://localhost/rfid_attendance_system/api/get_top_attendance.php";
const REPORT_URL = "http://localhost/rfid_attendance_system/api/get_attendance_report.php";

function App() {
  const [kpi, setKpi] = useState({});
  const [trend, setTrend] = useState([]);
  const [topAttendance, setTopAttendance] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);

  // Fetch KPI data
  const fetchKpi = () => {
    fetch(KPI_URL)
      .then((res) => res.json())
      .then(setKpi)
      .catch((err) => console.error("KPI fetch error:", err));
  };

  // Fetch trend data
  const fetchTrend = () => {
    fetch(TREND_URL)
      .then((res) => res.json())
      .then(setTrend)
      .catch((err) => console.error("Trend fetch error:", err));
  };

  // Fetch top 5 attendance
  const fetchTopAttendance = () => {
    fetch(TOP_URL)
      .then((res) => res.json())
      .then(setTopAttendance)
      .catch((err) => console.error("Top attendance fetch error:", err));
  };

  // Fetch attendance report (monthly comparison)
  const fetchAttendanceReport = () => {
    fetch(REPORT_URL)
      .then((res) => res.json())
      .then(setAttendanceReport)
      .catch((err) => console.error("Attendance report fetch error:", err));
  };

  useEffect(() => {
    fetchKpi();
    fetchTrend();
    fetchTopAttendance();
    fetchAttendanceReport();

    const interval = setInterval(fetchKpi, 30000);
    return () => clearInterval(interval);
  }, []);
  const [weeklyComparison, setWeeklyComparison] = useState([]);

useEffect(() => {
  const loadData = async () => {
    try {
      const weeklyData = await fetchWeeklyComparison();
      setWeeklyComparison(weeklyData);
    } catch (err) {
      console.error("Error fetching weekly data:", err);
    }
  };
  loadData();
}, []);


  // 🕒 Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      document.getElementById("currentDate").textContent = now.toLocaleDateString();
      document.getElementById("currentTime").textContent = now.toLocaleTimeString();
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // KPI cards
  const kpis = [
    {
      title: "Total Students",
      value: kpi.total_students,
      color: "from-indigo-500 to-blue-400",
      icon: <FaUserGraduate className="text-5xl text-white drop-shadow-lg" />,
    },
    {
      title: "Present Today",
      value: kpi.present_today,
      color: "from-green-500 to-emerald-400",
      icon: <FaUserCheck className="text-5xl text-white drop-shadow-lg" />,
    },
    {
      title: "Absent Today",
      value: kpi.absent_today,
      color: "from-rose-500 to-pink-400",
      icon: <FaUserTimes className="text-5xl text-white drop-shadow-lg" />,
    },
    {
      title: "Late Today",
      value: kpi.late_today,
      color: "from-amber-500 to-yellow-400",
      icon: <FaUserClock className="text-5xl text-white drop-shadow-lg" />,
    },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* 🔥 Glowing Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.4),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.4),transparent_60%)] animate-pulse"></div>
        <div className="absolute inset-0 animate-[spin_30s_linear_infinite] bg-[conic-gradient(at_top_left,_rgba(14,165,233,0.2),_rgba(147,51,234,0.2),_transparent_70%)] blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center p-10">
        {/* Header */}
        <div className="w-full max-w-7xl mb-14 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 rounded-2xl shadow-2xl p-[2px] animate-pulse">
          <div className="bg-gray-900 rounded-2xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-300 to-blue-400 text-transparent bg-clip-text text-center sm:text-left">
              🎓 Student Attendance Dashboard
            </h1>
            <div className="mt-4 sm:mt-0 text-center sm:text-right">
              <p id="currentDate" className="text-lg font-semibold text-gray-300"></p>
              <p id="currentTime" className="text-xl font-bold text-cyan-400"></p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map((card, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-white relative transition transform hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                </div>
                {card.icon}
              </div>
              <button className="mt-4 text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Attendance Trend */}
        <div className="w-full max-w-7xl space-y-10 pb-20">
          <div className="text-3xl font-bold text-center flex justify-center items-center gap-2">
            <FaChartLine className="text-cyan-400" /> Attendance Trend (Last 30 Days)
          </div>
          <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", color: "#fff", borderRadius: "10px" }} />
                <Legend />
                <Line type="monotone" dataKey="Present" stroke="#22c55e" strokeWidth={3} />
                <Line type="monotone" dataKey="Absent" stroke="#ef4444" strokeWidth={3} />
                <Line type="monotone" dataKey="Late" stroke="#eab308" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top 5 Attendance */}
          <div className="text-3xl font-bold text-center flex justify-center items-center gap-2 mt-16">
            <FaMedal className="text-yellow-400" /> Top 5 Attendance
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topAttendance.map((student, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-center shadow-lg hover:scale-105 transition"
              >
                <h3 className="text-lg font-semibold text-cyan-300">{student.name}</h3>
                <p className="text-sm text-gray-400">ID: {student.student_id}</p>
                <p className="mt-2 text-2xl font-bold text-green-400">{student.attendance_percentage}%</p>
              </div>
            ))}
          </div>

         {/* 📊 Attendance Overview: Pie + Bar side by side */}
<div className="w-full max-w-7xl mt-16 pb-20">
  <h2 className="text-3xl font-bold text-center flex justify-center items-center gap-2 mb-10">
    <FaChartLine className="text-cyan-400" /> Attendance Overview
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
    {/* 🥧 Donut Chart - Attendance Distribution */}
    <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 flex justify-center relative">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <defs>
            <radialGradient id="presentGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34,197,94,1)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0.2)" />
            </radialGradient>
            <radialGradient id="absentGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239,68,68,1)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.2)" />
            </radialGradient>
          </defs>

          {(() => {
            const present = Number(kpi.present_today) || 0;
            const late = Number(kpi.late_today) || 0;
            const absent = Number(kpi.absent_today) || 0;
            const total = present + late + absent;

            const presentTotal = present + late;
            const absentTotal = absent;

            const presentPercent = total ? ((presentTotal / total) * 100).toFixed(1) : 0;
            const absentPercent = total ? ((absentTotal / total) * 100).toFixed(1) : 0;

            const chartData = [
              { name: `Present (${presentPercent}%)`, value: presentTotal, fill: "url(#presentGrad)" },
              { name: `Absent (${absentPercent}%)`, value: absentTotal, fill: "url(#absentGrad)" },
            ];

            return (
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                label={({ name }) => name}
                labelLine={false}
                animationBegin={300}
                animationDuration={1500}
                isAnimationActive={true}
              >
                <Cell key="present" fill="url(#presentGrad)" />
                <Cell key="absent" fill="url(#absentGrad)" />
              </Pie>
            );
          })()}

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              color: "#fff",
              borderRadius: "10px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Center overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        <h2 className="text-4xl font-extrabold text-green-400 drop-shadow-lg">
          {(() => {
            const present = Number(kpi.present_today) || 0;
            const late = Number(kpi.late_today) || 0;
            const absent = Number(kpi.absent_today) || 0;
            const total = present + late + absent;
            return total ? `${(((present + late) / total) * 100).toFixed(1)}%` : "0%";
          })()}
        </h2>
        <p className="text-gray-400 text-xs tracking-wide">Overall Attendance</p>
      </div>

      {/* Glowing background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15),transparent_70%)] blur-3xl"></div>
    </div>
{/* 📊 Bar Chart - Monthly Summary */}
<div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center relative">
  <h3 className="text-xl font-semibold mb-6 text-cyan-300">Last Month Summary</h3>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={[
        {
          name: "Last Month",
          Present: kpi.total_present_last_month || 0,
          Absent: kpi.total_absent_last_month || 0,
          Late: kpi.total_late_last_month || 0,
        },
      ]}
      margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis dataKey="name" stroke="#ccc" />
      <YAxis
        stroke="#ccc"
        label={{
          value: "No. of Students",
          angle: -90,
          position: "insideLeft",
          style: { textAnchor: "middle", fill: "#ccc", fontSize: 12 },
        }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: "10px",
        }}
      />
      <Legend />

      {/* ✅ Bars with glowing effect */}
      <Bar
        dataKey="Present"
        fill="#22c55e"
        barSize={60}
        radius={[8, 8, 0, 0]}
        style={{ filter: "drop-shadow(0 0 8px rgba(34,197,94,0.7))" }}
        label={{ position: "top", fill: "#22c55e", fontWeight: "bold" }}
      />
      <Bar
        dataKey="Absent"
        fill="#ef4444"
        barSize={60}
        radius={[8, 8, 0, 0]}
        style={{ filter: "drop-shadow(0 0 8px rgba(239,68,68,0.7))" }}
        label={{ position: "top", fill: "#ef4444", fontWeight: "bold" }}
      />
      <Bar
        dataKey="Late"
        fill="#eab308"
        barSize={60}
        radius={[8, 8, 0, 0]}
        style={{ filter: "drop-shadow(0 0 8px rgba(234,179,8,0.7))" }}
        label={{ position: "top", fill: "#eab308", fontWeight: "bold" }}
      />
    </BarChart>
  </ResponsiveContainer>

  {/* Soft glowing backdrop */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1),transparent_70%)] blur-3xl"></div>
</div>
</div>
</div>


{/* Weekly Comparison Chart */}
<div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-lg p-6 mt-10">
  <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">
    Weekly Attendance Comparison
  </h2>

  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={weeklyComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
      <XAxis dataKey="day" stroke="#9CA3AF" />
      <YAxis stroke="#9CA3AF" label={{ value: "Present Count", angle: -90, position: "insideLeft", fill: "#9CA3AF" }} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRadius: "10px",
          border: "1px solid #4B5563"
        }}
      />
      <Legend />
      <Bar dataKey="thisWeek" fill="url(#thisWeekGrad)" name="This Week" radius={[6, 6, 0, 0]} />
      <Bar dataKey="lastWeek" fill="url(#lastWeekGrad)" name="Last Week" radius={[6, 6, 0, 0]} />

      <defs>
        <linearGradient id="thisWeekGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
        </linearGradient>
        <linearGradient id="lastWeekGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9}/>
          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.3}/>
        </linearGradient>
      </defs>
    </BarChart>
  </ResponsiveContainer>
</div>





               


         
        </div>
      </div>
    </div>
  );
}

export default App;
