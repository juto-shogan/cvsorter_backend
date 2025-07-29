import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, FileText, Upload, Mail, BarChart3 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-blue-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">OGTL</h1>
          </Link>
          
          {user && (
            <div className="flex items-center space-x-6">
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/dashboard'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/upload"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/upload'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                <Link
                  to="/email"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname === '/email'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </Link>
              </nav>
              
              {/* User Info and Logout */}
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200 bg-slate-800/60 hover:bg-slate-700/60 px-3 py-2 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;