import React, { useState } from "react";
import GaugeChart from "./GaugeChart";

const MoodTrackerForm = () => {
  const [ratings, setRatings] = useState({
    sleep: 5,
    morning: 5,
    exercise: 5,
    stress: 5,
    diet: 5,
  });
  const [moodScore, setMoodScore] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRatings((prevRatings) => ({
      ...prevRatings,
      [name]: parseInt(value),
    }));
  };

  const calculateMoodScore = () => {
    const total = Object.values(ratings).reduce((a, b) => a + b, 0);
    const average = total / Object.keys(ratings).length;
    setMoodScore(Math.round(average));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Rate Your Day</h2>
      {Object.keys(ratings).map((key) => (
        <div key={key}>
          <label>{key.charAt(0).toUpperCase() + key.slice(1)}: {ratings[key]}</label>
          <input
            type="range"
            name={key}
            min="1"
            max="10"
            value={ratings[key]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button onClick={calculateMoodScore}>Calculate Mood Score</button>
      {moodScore !== null && <GaugeChart score={moodScore} />}
    </div>
  );
};

export default MoodTrackerForm;
