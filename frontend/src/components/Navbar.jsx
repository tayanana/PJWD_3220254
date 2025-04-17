import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="bg-zinc-800 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Mental Health Tracker</h1>
        <div className="space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
          <Link to="/journal" className="hover:text-indigo-400 transition">Journal</Link>
          <Link to="/appointment" className="hover:text-indigo-400 transition">Appointments</Link>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
