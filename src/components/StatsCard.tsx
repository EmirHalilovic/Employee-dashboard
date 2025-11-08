import React from 'react'
import '../styles/StatsCard.css'

interface StatsCardProps {
  title: string
  value: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => (
  <div className="stat-card">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{title}</div>
  </div>
)