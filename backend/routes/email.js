const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/send-report', async (req, res) => {
  const { userEmail, therapistEmail, moodData, activityData, stressData, additionalNotes } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Format the data for the email
  const formatMoodData = (data) => {
    return data.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      mood: entry.mood,
      notes: entry.notes || 'No notes'
    }));
  };

  const formatActivityData = (data) => {
    return data.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      activityLevel: entry.activityLevel,
      mood: entry.mood
    }));
  };

  const formatStressData = (data) => {
    return data.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      stressLevel: entry.stressLevel
    }));
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: therapistEmail,
    subject: `Mental Health Dashboard Report from ${userEmail}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Mental Health Dashboard Report</h2>
        <p><strong>Patient:</strong> ${userEmail}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3 style="color: #2563eb; margin-top: 20px;">Mood Trends (Last 7 Days)</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Mood</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Notes</th>
          </tr>
          ${formatMoodData(moodData).map(entry => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.date}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.mood}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.notes}</td>
            </tr>
          `).join('')}
        </table>

        <h3 style="color: #2563eb;">Activity vs. Mood Correlation</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Activity Level</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Mood</th>
          </tr>
          ${formatActivityData(activityData).map(entry => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.date}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.activityLevel}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.mood}</td>
            </tr>
          `).join('')}
        </table>

        <h3 style="color: #2563eb;">Stress Levels</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; border: 1px solid #ddd;">Date</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Stress Level</th>
          </tr>
          ${formatStressData(stressData).map(entry => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.date}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${entry.stressLevel}</td>
            </tr>
          `).join('')}
        </table>

        ${additionalNotes ? `
          <h3 style="color: #2563eb;">Additional Notes</h3>
          <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">${additionalNotes}</p>
        ` : ''}
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send report', error });
  }
});

module.exports = router;