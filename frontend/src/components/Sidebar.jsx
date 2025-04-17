import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ handleLogout }) => {
  return (
    <div className="w-64 bg-gray-800 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Mental Health Tracker</h1>
      <nav className="flex flex-col space-y-3">
        <Link to="/" className="hover:text-blue-400">Daily Tracker</Link>
        <Link to="/journal" className="hover:text-blue-400">Journal</Link>
        <Link to="/send-report" className="hover:text-blue-400">Send to Therapist</Link>
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <li><Link to="/appointment">Next Appointment</Link></li>

      </nav>
      <button onClick={handleLogout} className="mt-6 bg-red-500 px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
