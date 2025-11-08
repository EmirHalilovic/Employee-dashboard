import '../styles/AverageCard.css'

interface AverageCardProps {
  label: string
  value: string
}

const AverageCard = ({ label, value }: AverageCardProps) => (
  <div className="average-card">
    <p className="card-label">{label}</p>
    <p className="card-value">{value}</p>
  </div>
)

export default AverageCard