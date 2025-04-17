import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import AuthPage from "./components/AuthPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MentalHealthForm from "./components/MentalHealthForm.jsx";
import JournalPage from "./components/JournalPage.jsx";
import AppointmentForm from "./components/AppointmentForm";
import ReminderPrompt from "./components/ReminderPrompt.jsx";
import SendToTherapist from "./components/SendToTherapist.jsx";
import { getToken, isLoggedIn, logout } from "./utils/auth.js";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn()) {
      try {
        const token = getToken();
        const decoded = jwtDecode(token);
        setUser(decoded.username);
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }
  }, []);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark p-8">
        <div className="card w-full max-w-md">
          <AuthPage onLoginSuccess={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-zinc-900 border-r border-gray-800 p-6 overflow-y-auto">
        <h2 className="mb-8 text-2xl font-bold">Mental Health Tracker</h2>
        <nav className="flex flex-col space-y-3">
          <Link to="/" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/dashboard" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/journal" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📝</span>
            <span>Journal</span>
          </Link>
          <Link to="/appointment" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📅</span>
            <span>Appointments</span>
          </Link>
          <Link to="/send-report" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
            <span className="text-lg">📤</span>
            <span>Send to Therapist</span>
          </Link>
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main content with offset for fixed sidebar */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          <ReminderPrompt />
          <div className="fade-in">
            <Routes>
              <Route path="/" element={<MentalHealthForm />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/appointment" element={<AppointmentForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send-report" element={<SendToTherapist />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
