import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Fetching time tracking data...</p>
    </div>
  );
}

export default LoadingSpinner;