import React from 'react'
import { Pie } from 'react-chartjs-2'
import '../styles/PieChart.css'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  title: string
  data: { [key: string]: number }
}

const COLORS = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
]

export const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
  const labels = Object.keys(data)
  const values = Object.values(data)

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const hours = Math.floor(context.parsed / 60)
            const minutes = Math.round(context.parsed % 60)
            return `${context.label}: ${hours}h ${minutes}m`
          },
        },
      },
    },
  }

  return (
    <div className="chart-section">
      <h2>{title}</h2>
      <div className="chart-wrapper">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}