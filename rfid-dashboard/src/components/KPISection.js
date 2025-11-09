import React, { useEffect, useState } from 'react';
import { fetchKPIs } from '../api';
import { FaUserGraduate, FaUserCheck, FaUserTimes, FaUserClock } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const KPISection = () => {
  const [kpiData, setKpiData] = useState({
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    late_today: 0
  });

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        const data = await fetchKPIs();
        setKpiData(data);
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };
    loadKPIs();
  }, []);

  const cards = [
    { title: 'Total Students', value: kpiData.total_students, icon: <FaUserGraduate />, color: '#007bff' },
    { title: 'Present Today', value: kpiData.present_today, icon: <FaUserCheck />, color: '#28a745' },
    { title: 'Absent Today', value: kpiData.absent_today, icon: <FaUserTimes />, color: '#dc3545' },
    { title: 'Late Today', value: kpiData.late_today, icon: <FaUserClock />, color: '#ffc107' }
  ];

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎓 Student Attendance Dashboard</h2>
      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-md-3 mb-4">
            <div className="card shadow-lg text-center p-4" style={{ borderRadius: '20px', backgroundColor: card.color, color: 'white', transition: '0.3s', transform: 'scale(1)' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '40px' }}>{card.icon}</div>
              <h5 className="mt-3">{card.title}</h5>
              <h3 className="fw-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPISection;
