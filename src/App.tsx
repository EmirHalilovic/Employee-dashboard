import { useState, useEffect } from 'react'
import { DefaultApi, Configuration } from './api'
import { PieChart } from './components/PieChart'
import { StatsCard } from './components/StatsCard'
import LoadingSpinner from './components/LoadingSpinner'
import { processTimeData, ProcessedData } from './utils/dataProcessor'

const api = new DefaultApi(new Configuration({ basePath: 'https://api.dummy.in-lotion.de' }))

const STAT_CARDS = [
  { title: 'Average Start Time', key: 'startTime' },
  { title: 'Average End Time', key: 'endTime' },
  { title: 'Average Break Duration', key: 'breakDuration' },
  { title: 'Average Work Duration', key: 'workDuration' }
] as const

const CHARTS = [
  { title: 'Project Allocation', key: 'projectData' },
  { title: 'Workplace Allocation', key: 'workplaceData' }
] as const

function App() {
  const [data, setData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.listTimeChanges()
        setData(processTimeData(response.data))
      } catch {
        setError('Failed to fetch data from API')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="container"><div className="error">{error}</div></div>
  if (!data) return <div className="container"><div className="error">No data available</div></div>

  return (
    <div className="container">
      <div className="header">
        <h1>Time, Divided & Conquered</h1>
      </div>
      <div className="stats-grid">
        {STAT_CARDS.map(({ title, key }) => (
          <StatsCard key={key} title={title} value={data.averages[key]} />
        ))}
      </div>
      <div className="charts-container">
        {CHARTS.map(({ title, key }) => (
          <PieChart key={key} title={title} data={data[key]} />
        ))}
      </div>
    </div>
  )
}

export default App