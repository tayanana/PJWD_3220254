// src/components/AppointmentForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../utils/auth";

function AppointmentForm() {
  const [appointment, setAppointment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (res.data.appointments) {
        setUpcomingAppointments(res.data.appointments.filter(apt => new Date(apt.date) > new Date()));
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setMessage({ text: "Failed to load appointments", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!appointment) {
      setMessage({ text: "Please select a date and time", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, {
        date: appointment
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setMessage({ text: "Appointment scheduled successfully!", type: "success" });
      fetchAppointments(); // Refresh the appointments list
      setAppointment(""); // Clear the input
    } catch (err) {
      console.error("Error saving appointment:", err);
      setMessage({ text: "Failed to schedule appointment", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setMessage({ text: "Appointment cancelled successfully", type: "success" });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setMessage({ text: "Failed to cancel appointment", type: "error" });
    }
  };

  // Set minimum date to today
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minDateTime = today.toISOString().slice(0, 16);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Therapy Appointments</h2>
      
      {/* New Appointment Form */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Schedule New Appointment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Date & Time
            </label>
            <input
              type="datetime-local"
              value={appointment}
              onChange={(e) => setAppointment(e.target.value)}
              min={minDateTime}
              className="w-full bg-gray-700/30 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Schedule Appointment</span>
              )}
            </button>

            {message.text && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div>
                  <p className="text-lg font-medium">
                    {new Date(apt.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-400">
                    {new Date(apt.date).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(apt._id)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">
              No upcoming appointments scheduled
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentForm;
