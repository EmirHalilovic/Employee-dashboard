import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartData } from '../services/calculations';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: ChartData;
}

function PieChart({ data }: PieChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.datasets.label,
        data: data.datasets.data,
        backgroundColor: data.datasets.backgroundColor,
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const hours = Math.floor(value / 60);
            const minutes = Math.round(value % 60);
            return `${hours}h ${minutes}m`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}

export default PieChart;