import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth";

const JournalPage = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      setMessage({ text: "Failed to load journal entries", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/journal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text: entry }),
      });
      
      if (!res.ok) throw new Error("Failed to save entry");
      
      const newEntry = await res.json();
      setEntries((prev) => [newEntry, ...prev]);
      setEntry("");
      setMessage({ text: "Journal entry saved successfully!", type: "success" });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      setMessage({ text: "Failed to save journal entry", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Journal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-4 rounded-lg bg-gray-700/30 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows="6"
          placeholder="Write your thoughts..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        ></textarea>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Entry"}
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

      <div className="mt-8 space-y-6">
        {entries.length > 0 ? (
          entries.map((e, idx) => (
            <div key={idx} className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-3">
                {new Date(e.date).toLocaleString()}
              </div>
              <p className="text-gray-200 whitespace-pre-wrap">{e.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No entries yet. Start writing your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
