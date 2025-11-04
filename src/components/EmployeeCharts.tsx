import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface EmployeeData {
  id: number;
  start: string;
  end: string;
  workTime: { hours: number; minutes: number };
  pauseTime: { hours: number; minutes: number };
  projectAllocation: Array<{ label: string; percentage: number }>;
  workplaceAllocation: Array<{ label: string; percentage: number }>;
}

interface EmployeeChartsProps {
  data: EmployeeData[];
}

const EmployeeCharts: React.FC<EmployeeChartsProps> = ({ data }) => {
  // Project allocation aggregation
  const projectTotals = data.reduce((acc, entry) => {
    entry.projectAllocation.forEach(project => {
      acc[project.label] = (acc[project.label] || 0) + project.percentage;
    });
    return acc;
  }, {} as Record<string, number>);

  // Workplace allocation aggregation
  const workplaceTotals = data.reduce((acc, entry) => {
    entry.workplaceAllocation.forEach(workplace => {
      acc[workplace.label] = (acc[workplace.label] || 0) + workplace.percentage;
    });
    return acc;
  }, {} as Record<string, number>);

  // Work hours by day
  const workHoursByDay = data.map(entry => ({
    date: new Date(entry.start).toLocaleDateString(),
    hours: entry.workTime.hours + entry.workTime.minutes / 60
  }));

  // Chart configurations
  const projectChartData = {
    labels: Object.keys(projectTotals),
    datasets: [{
      data: Object.values(projectTotals),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  const workplaceChartData = {
    labels: Object.keys(workplaceTotals),
    datasets: [{
      data: Object.values(workplaceTotals),
      backgroundColor: ['#FF9F40', '#FF6384', '#4BC0C0'],
    }]
  };

  const workHoursChartData = {
    labels: workHoursByDay.map(d => d.date),
    datasets: [{
      label: 'Work Hours',
      data: workHoursByDay.map(d => d.hours),
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', padding: '20px' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Project Allocation</h3>
        <Pie data={projectChartData} options={chartOptions} />
      </div>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Workplace Distribution</h3>
        <Pie data={workplaceChartData} options={chartOptions} />
      </div>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', gridColumn: '1 / -1' }}>
        <h3>Daily Work Hours</h3>
        <Line data={workHoursChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default EmployeeCharts;