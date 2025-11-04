import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        ⏰ Time, Divided & Conquered
      </h1>

      {/* Averages Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#495057' }}>
            {avgStartTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg Start Time</div>
        </div>
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#495057' }}>
            {avgEndTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg End Time</div>
        </div>
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#495057' }}>
            {(avgBreakMinutes / 60).toFixed(2)}h
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg Break Duration</div>
        </div>
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#495057' }}>
            {(avgWorkMinutes / 60).toFixed(2)}h
          </div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Avg Work Duration</div>
        </div>
      </div>

      {/* Pie Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#495057' }}>Project Allocation</h3>
          <Pie data={projectChartData} options={chartOptions} />
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#495057' }}>Workplace Allocation</h3>
          <Pie data={workplaceChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;