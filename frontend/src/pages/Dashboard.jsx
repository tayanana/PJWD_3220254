// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { getToken } from '../utils/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/entries`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Calculate average for each entry if not already present
        const processedEntries = res.data.map(entry => ({
          ...entry,
          average: entry.average || calculateAverage(entry)
        }));
        setEntries(processedEntries);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverage = (entry) => {
    const categories = ['feelings', 'day', 'sleep', 'productivity', 'health'];
    const sum = categories.reduce((acc, category) => acc + (entry[category] || 0), 0);
    return (sum / categories.length).toFixed(1);
  };

  const deleteAllData = async () => {
    try {
      const token = getToken();
      await axios.delete(`${import.meta.env.VITE_API_URL}/entries`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEntries([]);
    } catch (err) {
      console.error('Error deleting data:', err);
      setError('Failed to delete data');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-zinc-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-zinc-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-6 bg-zinc-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>No data available yet. Start tracking your mental health to see your progress!</p>
      </div>
    );
  }

  const categories = ['feelings', 'day', 'sleep', 'productivity', 'health'];
  const labels = entries.map((entry) => new Date(entry.date).toLocaleDateString());
  const averageData = entries.map((entry) => parseFloat(entry.average));

  const categorySeries = categories.map((category) => {
    return {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      data: entries.map((entry) => entry[category]),
      fill: false,
      tension: 0.4,
    };
  });

  const categoryAverages = categories.map((category) => {
    const total = entries.reduce((sum, entry) => sum + (entry[category] || 0), 0);
    return (total / entries.length).toFixed(1);
  });

  const overallAverage = (averageData.reduce((a, b) => a + b, 0) / averageData.length).toFixed(1);

  return (
    <div className="p-6 bg-zinc-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mental Health Data</h1>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm text-gray-400">Overall Average</p>
          <p className="text-2xl font-bold">{overallAverage}</p>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Average Mental Health Score Over Time</h2>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: 'Average',
                  data: averageData,
                  borderColor: 'rgb(99, 102, 241)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: 'white' } },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                }
              },
              scales: {
                x: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: 'white' }
                },
                y: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: 'white' }
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Mental Health Categories Over Time</h2>
          <Line
            data={{
              labels,
              datasets: categorySeries.map((cat, index) => ({
                ...cat,
                borderColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
              })),
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { labels: { color: 'white' } },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                }
              },
              scales: {
                x: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: 'white' }
                },
                y: {
                  grid: { color: 'rgba(255, 255, 255, 0.1)' },
                  ticks: { color: 'white' }
                },
              },
            }}
          />
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Category Averages</h2>
          <Radar
            data={{
              labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
              datasets: [
                {
                  label: 'Average Score',
                  data: categoryAverages,
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  borderColor: 'rgba(99, 102, 241, 1)',
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              scales: {
                r: {
                  angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                  grid: { color: 'rgba(255, 255, 255, 0.2)' },
                  pointLabels: { color: 'white' },
                  ticks: { color: 'white', backdropColor: 'transparent' },
                },
              },
              plugins: {
                legend: { labels: { color: 'white' } },
              },
            }}
          />
        </div>
      </div>

      <button
        onClick={deleteAllData}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mb-6"
      >
        Delete all data
      </button>
    </div>
  );
};

export default Dashboard;
