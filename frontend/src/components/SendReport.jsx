import { useState } from 'react';
import axios from 'axios';

const SendToTherapist = () => {
  const [therapistEmail, setTherapistEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/email/send-report`, {
        therapistEmail,
        moodData: [
          { date: '2025-04-01', mood: 4 },
          { date: '2025-04-02', mood: 3 },
          { date: '2025-04-03', mood: 5 },
        ],
      });
      setStatus('Email sent successfully!');
    } catch (err) {
      setStatus('Failed to send email.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Send Mood Report to Therapist</h2>
      <input
        type="email"
        value={therapistEmail}
        onChange={(e) => setTherapistEmail(e.target.value)}
        placeholder="Enter therapist's email"
        className="border px-2 py-1 rounded w-full mb-2"
      />
      <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send Report
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default SendToTherapist;
