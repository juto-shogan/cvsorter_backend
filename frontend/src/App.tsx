// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CVProvider } from './contexts/CVContext'; // Import CVProvider
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound'; // Assuming you have a NotFound component
import './App.css'; // Global application styles

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// A simple protected route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Optionally render a loading spinner or skeleton while checking auth status
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      {/* AuthProvider wraps the entire application or relevant parts */}
      <AuthProvider>
        {/* CVProvider should wrap components that need CV data, typically inside ProtectedRoute */}
        <CVProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Protect the dashboard route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Redirect root to dashboard if logged in, otherwise to login */}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              {/* Catch-all for unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </CVProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;