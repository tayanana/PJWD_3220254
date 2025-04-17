import React, { useState, useEffect } from 'react';

const SendToTherapist = () => {
  const [therapistEmail, setTherapistEmail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [status, setStatus] = useState('');
  const [dashboardData, setDashboardData] = useState({
    moodTrends: [],
    activityMood: [],
    stressLevels: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [moodTrendsRes, activityMoodRes, stressLevelsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/data/mood-trends`),
          fetch(`${process.env.REACT_APP_API_URL}/data/activity-mood`),
          fetch(`${process.env.REACT_APP_API_URL}/data/stress-levels`)
        ]);

        const moodTrends = await moodTrendsRes.json();
        const activityMood = await activityMoodRes.json();
        const stressLevels = await stressLevelsRes.json();

        setDashboardData({
          moodTrends,
          activityMood,
          stressLevels
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/email/send-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: localStorage.getItem('userEmail'),
          therapistEmail,
          moodData: dashboardData.moodTrends,
          activityData: dashboardData.activityMood,
          stressData: dashboardData.stressLevels,
          additionalNotes
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Report sent successfully!');
        setTherapistEmail('');
        setAdditionalNotes('');
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending report:', error);
      setStatus('Failed to send report.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Share Your Progress with Your Therapist</h2>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">What's Included in the Report</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Your mood patterns over the past week</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>How your activity levels relate to your mood</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Your stress level tracking data</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label htmlFor="therapistEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Therapist's Email Address
          </label>
          <input
            id="therapistEmail"
            type="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="therapist@example.com"
            value={therapistEmail}
            onChange={(e) => setTherapistEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            id="additionalNotes"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-gray-900"
            placeholder="Add any specific concerns or context you'd like your therapist to know..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          Send Progress Report
        </button>
      </form>

      {status && (
        <div className={`mt-6 p-4 rounded-lg text-center ${
          status.includes('success') 
            ? 'bg-green-50 text-green-700' 
            : status.includes('Error') 
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default SendToTherapist;
