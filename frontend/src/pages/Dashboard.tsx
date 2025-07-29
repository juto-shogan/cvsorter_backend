import React, { useState } from 'react';
import { useCV } from '../contexts/CVContext';
import CVCard from '../components/Dashboard/CVCard';
import CVViewer from '../components/Dashboard/CVViewer';
import FilterPanel from '../components/Dashboard/FilterPanel';
import { CV } from '../types';
import { Upload, FileText, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { cvs, filteredCVs, dashboardStats } = useCV();
  const [selectedCV, setSelectedCV] = useState<CV | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CV Dashboard</h1>
          <p className="text-slate-400">Manage and review candidate CVs efficiently</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total CVs</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Reviewed</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.reviewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <FilterPanel />
          </div>

          {/* CV Grid */}
          <div className="flex-1">
            {filteredCVs.length === 0 ? (
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-12 border border-slate-700/50 text-center">
                <div className="bg-slate-700/50 p-4 rounded-full inline-block mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No CVs Found</h3>
                <p className="text-slate-400 mb-6">
                  {cvs.length === 0 
                    ? "Start by uploading some CV files to get started with your recruitment process."
                    : "No CVs match your current filters. Try adjusting your search criteria."
                  }
                </p>
                {cvs.length === 0 && (
                  <Link
                    to="/upload"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload CVs</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredCVs.map(cv => (
                  <CVCard
                    key={cv.id}
                    cv={cv}
                    onView={setSelectedCV}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCV && (
        <CVViewer
          cv={selectedCV}
          onClose={() => setSelectedCV(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;