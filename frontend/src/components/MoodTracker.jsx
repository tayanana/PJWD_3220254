import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";


Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);

const MoodTracker = () => {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5001/api/tracker/mood") 
      .then((response) => {
        setMoodData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching mood data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Prepare data for Chart.js
  const chartData = {
    labels: moodData.map(entry => new Date(entry.date).toLocaleDateString()), // Dates on X-axis
    datasets: [
      {
        label: "Mood Level",
        data: moodData.map(entry => entry.moodLevel), // Mood values on Y-axis
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Mood Level" }, min: 1, max: 10 },
    },
  };

  return (
    <div>
      <h1>Mental Health Tracker</h1>
      <h2>Mood Tracker</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MoodTracker;
