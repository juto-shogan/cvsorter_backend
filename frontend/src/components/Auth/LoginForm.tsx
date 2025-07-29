import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, FileText, AlertCircle } from 'lucide-react';

// Props for toggling between login and signup modes
interface LoginFormProps {
  onToggleMode: () => void;
  // Add a prop for successful login, e.g., to redirect or update parent state
  onLoginSuccess: (token: string, user: any) => void;
}

// LoginForm component handles user login UI and logic
const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onLoginSuccess }) => {
  // State for email input
  const [email, setEmail] = useState('');
  // State for password input
  const [password, setPassword] = useState('');
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for error messages
  const [error, setError] = useState('');
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  // Handles form submission and login logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation for empty fields
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email format validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // --- FETCH API USAGE STARTS HERE ---
      // Sends login request to backend API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Handles error response from API
      if (!response.ok) { // Check if the response status is not in the 200-299 range
        setError(data.message || 'Invalid credentials. Please check your email and password.');
      } else {
        // --- MODIFIED: Handle successful login ---
        console.log('Login successful:', data);
        // Assuming your backend sends 'token' and 'user' data upon successful login
        localStorage.setItem('token', data.token); // Save the token
        // You might want to save user details too
        localStorage.setItem('user', JSON.stringify(data.user));

        // Call the onLoginSuccess prop to handle redirection or state update in the parent component
        if (onLoginSuccess) {
            onLoginSuccess(data.token, data.user);
        }
        // Example: Redirecting to a dashboard or profile page.
        // If you are using react-router-dom, you would use navigate('/dashboard');
        // window.location.href = '/dashboard'; // Simple full page reload redirect
      }
      // --- FETCH API USAGE ENDS HERE ---
    } catch (err) {
      // Handles network errors
      console.error('Login network error:', err); // Log the actual error for debugging
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card container */}
      <div className="bg-slate-800/60 backdrop-blur-lg rounded-2xl p-8 border border-blue-800/30">
        {/* Header section */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl inline-block mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to continue to OGTL</p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              {/* Toggle password visibility button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Link to switch to signup mode */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;