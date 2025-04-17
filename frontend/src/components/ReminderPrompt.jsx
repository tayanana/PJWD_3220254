// src/components/ReminderPrompt.jsx
import React, { useEffect } from "react";

const ReminderPrompt = () => {
  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastReminderDate");
    const today = new Date().toLocaleDateString();

    if (lastPrompt !== today) {
      if (Notification.permission === "granted") {
        new Notification("Don't forget to log your mental health stats today!");
      }

      localStorage.setItem("lastReminderDate", today);
    }
  }, []);

  return null; 
};

export default ReminderPrompt;
