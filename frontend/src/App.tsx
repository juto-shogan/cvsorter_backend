import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CVProvider } from './contexts/CVContext';
import Navbar from './components/Layout/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import EmailPage from './pages/EmailPage';

// 🔥 PROTECTED ROUTE COMPONENT
// This component checks if user is authenticated before allowing access
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

// 🔥 MAIN APP CONTENT COMPONENT
// This component handles routing and conditional navbar rendering
const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* CONDITIONAL NAVBAR - Only show when user is logged in */}
        {user && <Navbar />}
        
        {/* ROUTE DEFINITIONS */}
        <Routes>
          {/* AUTH ROUTE - Redirect to dashboard if already logged in */}
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/dashboard" /> : <AuthPage />} 
          />
          
          {/* DASHBOARD ROUTE - Protected, requires authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* UPLOAD ROUTE - Protected, requires authentication */}
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } 
          />
          
          {/* EMAIL ROUTE - Protected, requires authentication */}
          <Route 
            path="/email" 
            element={
              <ProtectedRoute>
                <EmailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* ROOT ROUTE - Redirect based on auth status */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/auth"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

// 🔥 MAIN APP COMPONENT
// This is the root component that provides all contexts
function App() {
  return (
    // AUTH PROVIDER - Manages authentication state globally
    <AuthProvider>
      {/* CV PROVIDER - Manages CV data and filtering state globally */}
      <CVProvider>
        <AppContent />
      </CVProvider>
    </AuthProvider>
  );
}

export default App;