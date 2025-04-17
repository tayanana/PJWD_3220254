import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";

Chart.register(ArcElement, Tooltip);

const GaugeChart = ({ score }) => {
  const data = {
    datasets: [
      {
        data: [score, 10 - score], // Score and remaining
        backgroundColor: [
          score < 4 ? "red" : score < 7 ? "yellow" : "green",
          "lightgray",
        ],
        borderWidth: 0,
        cutout: "75%",
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        bottom: 30 // Increased padding for better spacing
      }
    },
    plugins: {
      tooltip: { enabled: false },
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-[400px] h-[200px] relative">
        <Doughnut data={data} options={options} />
      </div>
      <div className="text-3xl font-bold text-white mt-4">
        {score}
      </div>
    </div>
  );
};

export default GaugeChart;
