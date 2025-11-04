import { useEffect, useState } from 'react';
import axios from 'axios';
import { TimeChangeEntry } from './types';
import {
  calculateProjectAllocation,
  calculateEmployeeStats,
  calculateDailyTracking,
  getSummaryStats,
} from './services/calculations';
import Dashboard from './components/Dashboard';
import './App.css';

const API_BASE_URL = 'https://api.dummy.in-lotion.de';
const API_ENDPOINT = `${API_BASE_URL}/api/time-changes`;

function App() {
  const [data, setData] = useState<TimeChangeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container">
      <Dashboard data={data} />
    </div>
  );
}

export default App;