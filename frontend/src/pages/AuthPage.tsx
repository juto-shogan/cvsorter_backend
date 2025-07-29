// src/pages/AuthPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import LoginForm from '../components/Auth/LoginForm'; // Adjust path if your LoginForm is elsewhere
import SignupForm from '../components/Auth/SignupForm'; // Adjust path if your SignupForm is elsewhere
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to update the global authentication state

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // State to toggle between Login and Signup forms
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const { login } = useAuth(); // Destructure the 'login' function from your AuthContext

  // Function to toggle between login and signup forms
  const handleToggleMode = () => {
    setIsLoginMode(prevMode => !prevMode);
  };

  // This function is called by LoginForm and SignupForm upon successful authentication
  const handleAuthSuccess = (token: string, user: any) => {
    // 1. Update the global authentication state via AuthContext
    // This is crucial for your ProtectedRoute and Navbar to recognize the user as logged in
    login(token, user);

    // 2. Redirect the user to the dashboard page
    // This will trigger the route change in your application
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Conditionally render LoginForm or SignupForm */}
      {isLoginMode ? (
        <LoginForm
          onToggleMode={handleToggleMode}
          onLoginSuccess={handleAuthSuccess} // Pass the success handler to LoginForm
        />
      ) : (
        <SignupForm
          onToggleMode={handleToggleMode}
          // Assuming SignupForm will also call a similar prop on successful registration
          // You might need to add onAuthSuccess to your SignupFormProps and call it
          onAuthSuccess={handleAuthSuccess} // Pass the success handler to SignupForm
        />
      )}
    </div>
  );
};

export default AuthPage;