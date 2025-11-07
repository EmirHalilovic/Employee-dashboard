import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface EmployeeData {
  id: number;
  start: string;
  end: string;
  workTime: { hours: number; minutes: number };
  pauseTime: { hours: number; minutes: number };
  projectAllocation: Array<{ label: string; percentage: number }>;
  workplaceAllocation: Array<{ label: string; percentage: number }>;
}

interface DashboardProps {
  data: EmployeeData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  // Calculate time-weighted aggregations
  const projectTotals: Record<string, number> = {};
  const workplaceTotals: Record<string, number> = {};

  data.forEach(entry => {
    const workMinutes = entry.workTime.hours * 60 + entry.workTime.minutes;
    
    entry.projectAllocation.forEach(project => {
      const minutesForLabel = workMinutes * (project.percentage / 100);
      projectTotals[project.label] = (projectTotals[project.label] || 0) + minutesForLabel;
    });

    entry.workplaceAllocation.forEach(workplace => {
      const minutesForLabel = workMinutes * (workplace.percentage / 100);
      workplaceTotals[workplace.label] = (workplaceTotals[workplace.label] || 0) + minutesForLabel;
    });
  });

  // Calculate averages
  const totalEntries = data.length;
  const avgStartTime = new Date(data.reduce((sum, entry) => sum + new Date(entry.start).getTime(), 0) / totalEntries);
  const avgEndTime = new Date(data.reduce((sum, entry) => sum + new Date(entry.end).getTime(), 0) / totalEntries);
  const avgBreakMinutes = data.reduce((sum, entry) => sum + entry.pauseTime.hours * 60 + entry.pauseTime.minutes, 0) / totalEntries;
  const avgWorkMinutes = data.reduce((sum, entry) => sum + entry.workTime.hours * 60 + entry.workTime.minutes, 0) / totalEntries;

  // Chart data
  const projectChartData = {
    labels: Object.keys(projectTotals),
    datasets: [{
      data: Object.values(projectTotals).map(minutes => (minutes / 60).toFixed(2)),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  };

  const workplaceChartData = {
    labels: Object.keys(workplaceTotals),
    datasets: [{
      data: Object.values(workplaceTotals).map(minutes => (minutes / 60).toFixed(2)),
      backgroundColor: ['#FF9F40', '#FF6384', '#4BC0C0'],
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}h`
        }
      }
    },
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">
         Time, Divided & Conquered
      </h1>

      {/* Averages Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">
            {avgStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="stat-label">Avg Start Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {avgEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="stat-label">Avg End Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {(avgBreakMinutes / 60).toFixed(2)}h
          </div>
          <div className="stat-label">Avg Break Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {(avgWorkMinutes / 60).toFixed(2)}h
          </div>
          <div className="stat-label">Avg Work Duration</div>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Project Allocation</h3>
          <Pie data={projectChartData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Workplace Allocation</h3>
          <Pie data={workplaceChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;