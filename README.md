# Mental Health Tracker

A full-stack application for tracking mental health progress and well-being.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas)

## Project Structure

```
mental-health-tracker/
├── frontend/     # React + Vite frontend
└── backend/      # Express.js backend
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mental-health-tracker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

The application should be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Build

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

## Technologies Used

### Frontend
- React
- Vite
- TailwindCSS
- Chart.js
- React Router
- Axios

### Backend
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

## Features
- User authentication
- Mental health tracking
- Data visualization
- Progress monitoring
- Email notifications

