import './AverageCard.css';

interface AverageCardProps {
  label: string;
  value: string;
}

function AverageCard({ label, value }: AverageCardProps) {
  return (
    <div className="average-card">
      <p className="card-label">{label}</p>
      <p className="card-value">{value}</p>
    </div>
  );
}

export default AverageCard;