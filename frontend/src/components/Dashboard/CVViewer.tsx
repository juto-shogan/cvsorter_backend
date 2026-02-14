// src/components/Dashboard/CVViewer.tsx

import React from 'react';
import { CV } from '../../types';
import { X, Download, User, MapPin, Mail, Phone, Award, GraduationCap, Calendar, FileText, TrendingUp } from 'lucide-react'; // Added FileText and TrendingUp for completeness, assuming they are used
import api from '../../services/api'; // Import the new API service

interface CVViewerProps {
  cv: CV;
  onClose: () => void;
}

const CVViewer: React.FC<CVViewerProps> = ({ cv, onClose }) => {
  const handleDownload = async () => {
    try {
      // Use the api.get method for file download
      // The api service automatically handles token and base URL
      const fileBlob = await api.get<Blob>(`cvs/${cv.id || cv._id}/download`, {
        responseType: 'blob', // Important: tell Axios to expect a blob response
      });

      // Corrected: response.data is already the Blob
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cv.fileName; // Use the original file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download CV. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-8 border border-blue-800/30 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-3">
            <FileText className="h-7 w-7 text-blue-400" />
            <span>CV Details: {cv.candidateName}</span>
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors duration-200 shadow-md flex items-center space-x-2"
              title="Download CV"
            >
              <Download className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">Download</span>
            </button>
            <button
              onClick={onClose}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 p-3 rounded-full transition-colors duration-200 shadow-md"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Candidate Info */}
              <div className="bg-slate-700/30 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600/50 pb-3">Candidate Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Name:</span> {cv.candidateName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Location:</span> {cv.location || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Email:</span> {cv.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Phone:</span> {cv.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Uploaded:</span> {new Date(cv.uploadDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Original File:</span> {cv.fileName}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600/50 pb-3">Skills</h3>
                {cv.skills && cv.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cv.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No skills listed.</p>
                )}
              </div>
            </div>

            {/* Right Column: Professional Info & AI Insights */}
            <div className="lg:col-span-1 space-y-6">
              {/* Professional Summary */}
              <div className="bg-slate-700/30 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-slate-600/50 pb-3">Professional Summary</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Position:</span> {cv.position || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Experience:</span> {cv.experience} years</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                    <span><span className="font-semibold text-white">Education:</span> {cv.education || 'N/A'}</span>
                  </div>
                  {cv.score !== undefined && (
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      <span><span className="font-semibold text-white">AI Score:</span> {cv.score}%</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cv.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      cv.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Status: {cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI insights */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">AI Insights</h4>
                <div className="space-y-3 text-sm">
                  {cv.experience >= 5 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-400">• Highly experienced candidate</p>
                    </div>
                  )}
                  {cv.skills.length >= 4 && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-400">• Strong technical skill set</p>
                    </div>
                  )}
                  {['PhD', 'Master'].includes(cv.education) && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
                      <p className="text-indigo-400">• Advanced educational background</p>
                    </div>
                  )}
                  {cv.score && cv.score >= 80 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-400">• Recommended for interview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVViewer;