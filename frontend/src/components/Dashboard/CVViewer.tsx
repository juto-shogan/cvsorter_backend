import React, { useState } from 'react';
import { CV } from '../../types';
import { X, Download, User, MapPin, Mail, Phone, Award, GraduationCap, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to get the token

interface CVViewerProps {
  cv: CV;
  onClose: () => void;
}

const CVViewer: React.FC<CVViewerProps> = ({ cv, onClose }) => {
  const { token } = useAuth(); // Get the authentication token from AuthContext
  const [isDownloading, setIsDownloading] = useState(false); // State for download loading

  const handleDownload = async () => {
    if (!token) {
      alert('You must be logged in to download CVs.');
      return;
    }

    setIsDownloading(true); // Set loading state
    try {
      const response = await fetch(`http://localhost:5000/api/cvs/${cv.id}/download`, { // Ensure correct URL
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try to read error message from backend if available
        const errorText = await response.text();
        let errorMessage = 'Failed to download CV. Please try again.';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // If not JSON, use the plain text
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Get the file name from the Content-Disposition header, or fallback to cv.fileName
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = cv.fileName || 'download.pdf'; // Default fallback
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Use filename from header or fallback
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Clean up the URL object
      alert('CV downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="h-7 w-7 text-blue-400" />
            {cv.name}'s CV
          </h2>
          <div className="flex space-x-3">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Download CV</span>
                </>
              )}
            </button>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 p-2 rounded-full transition-colors duration-200"
              title="Close viewer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-grow hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main CV Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-400" />
                    <span>{cv.name}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-400" />
                    <span>{cv.email}</span>
                  </p>
                  {cv.phone && (
                    <p className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <span>{cv.phone}</span>
                    </p>
                  )}
                  {cv.location && (
                    <p className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span>{cv.location}</span>
                    </p>
                  )}
                  <p className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Uploaded: {new Date(cv.uploadDate).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Professional Details</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-400" />
                    <span>{cv.experience} years of experience</span>
                  </p>
                  {cv.position && (
                    <p className="flex items-center space-x-2">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-semibold">
                        Position: {cv.position}
                      </span>
                    </p>
                  )}
                  <p className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-blue-400" />
                    <span>Education: {cv.education}</span>
                  </p>
                  {cv.score !== undefined && (
                    <p className="flex items-center space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-xs font-semibold">
                        Matching Score: {cv.score}%
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (AI Insights, etc.) */}
            <div className="md:col-span-1 space-y-6">
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