import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const MoodChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5001/api/mood") 
      .then((response) => {
        const moods = response.data;
        const labels = moods.map((entry) => new Date(entry.date).toLocaleDateString());
        const data = moods.map((entry) => entry.mood);

        setChartData({
          labels,
          datasets: [
            {
              label: "Mood Over Time",
              data,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching mood data:", error));
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Mood Tracker</h2>
      <Line data={chartData} />
    </div>
  );
};

export default MoodChart;
