import React, { useState } from "react";
import GaugeChart from "./GuageChart.jsx";
import { getToken } from "../utils/auth.js";

const MentalHealthForm = () => {
  const [scores, setScores] = useState({
    day: 5,
    feelings: 5,
    sleep: 5,
    productivity: 5,
    health: 5,
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setScores({ ...scores, [event.target.name]: Number(event.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scores),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Mood entry saved successfully!");
      } else {
        setMessage(data.message || "Error saving entry.");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  const averageScore = (
    (scores.day + scores.feelings + scores.sleep + scores.productivity + scores.health) /
    5
  ).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">Mental Health Check-In</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(scores).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <span className="text-lg font-medium">{value}</span>
                </div>
                <input
                  type="range"
                  name={key}
                  min="0"
                  max="10"
                  value={value}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium mt-6"
            >
              Submit Check-In
            </button>
          </form>
          {message && (
            <div className={`p-4 rounded-lg text-base ${
              message.includes("success")
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <h3 className="text-3xl font-bold text-center">
            Today's Mental Health Score
          </h3>
          <div className="w-full flex justify-center items-center">
            <GaugeChart score={Number(averageScore)} />
          </div>
          <p className="text-center text-xl">
            Average Score: <span className="font-bold">{averageScore}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthForm;
