import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="auth-container min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md fade-in">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Mental Health Tracker
          </h1>
          <p className="text-lg text-gray-400">
            Take control of your mental well-being
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 rounded-2xl shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[#6366f1]/10 rounded-full flex items-center justify-center ring-2 ring-[#6366f1]/20">
              <span className="text-4xl">🧠</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-white mb-8">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>

          {/* Form */}
          <div className="space-y-6">
            {isLogin ? (
              <>
                <LoginForm onLoginSuccess={onLoginSuccess} />
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#1e293b] text-gray-400">
                      Don't have an account?
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleForm}
                  className="w-full py-3 px-4 border border-[#6366f1] text-[#6366f1] font-medium rounded-lg hover:bg-[#6366f1]/10 transition-colors duration-200"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                <RegisterForm />
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#1e293b] text-gray-400">
                      Already have an account?
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleForm}
                  className="w-full py-3 px-4 border border-[#6366f1] text-[#6366f1] font-medium rounded-lg hover:bg-[#6366f1]/10 transition-colors duration-200"
                >
                  Login here
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Your mental health journey starts here
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
