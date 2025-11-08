import { TimeChange } from '../api'

export interface ProcessedData {
  projectData: Record<string, number>
  workplaceData: Record<string, number>
  averages: {
    startTime: string
    endTime: string
    breakDuration: string
    workDuration: string
  }
}

const toMinutes = (time: { hours: number; minutes: number } | undefined) => 
  (time?.hours || 0) * 60 + (time?.minutes || 0)

const parseTimeString = (dateTime: string) => {
  const timeStr = dateTime.split('T')[1]
  if (!timeStr) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return hours * 60 + minutes
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

const formatDuration = (minutes: number) => 
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`

export const processTimeData = (timeChanges: TimeChange[]): ProcessedData => {
  const projectData: Record<string, number> = {}
  const workplaceData: Record<string, number> = {}
  const totals = { start: 0, end: 0, break: 0, work: 0 }

  timeChanges.forEach(entry => {
    const workMinutes = toMinutes(entry.workTime)
    
    entry.projectAllocation?.forEach(project => {
      const allocated = workMinutes * (project.percentage / 100)
      projectData[project.label] = (projectData[project.label] || 0) + allocated
    })
    
    entry.workplaceAllocation?.forEach(workplace => {
      const allocated = workMinutes * (workplace.percentage / 100)
      workplaceData[workplace.label] = (workplaceData[workplace.label] || 0) + allocated
    })
    
    totals.start += parseTimeString(entry.start)
    totals.end += parseTimeString(entry.end)
    totals.break += toMinutes(entry.pauseTime)
    totals.work += workMinutes
  })

  const count = timeChanges.length
  const averages = {
    startTime: formatTime(Math.round(totals.start / count)),
    endTime: formatTime(Math.round(totals.end / count)),
    breakDuration: formatDuration(Math.round(totals.break / count)),
    workDuration: formatDuration(Math.round(totals.work / count))
  }

  return { projectData, workplaceData, averages }
}