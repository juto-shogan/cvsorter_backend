import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, FileText } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-blue-800/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">CVSorter</h1>
            <h1 className="text-xl font-bold text-white">OGTL</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
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