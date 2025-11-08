import '../styles/LoadingSpinner.css'

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner" />
    <p>Fetching time tracking data...</p>
  </div>
)

export default LoadingSpinner