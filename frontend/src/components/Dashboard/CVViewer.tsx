import React from 'react';
import { CV } from '../../types';
import { X, Download, User, MapPin, Mail, Phone, Award, GraduationCap, Calendar } from 'lucide-react';

interface CVViewerProps {
  cv: CV;
  onClose: () => void;
}

const CVViewer: React.FC<CVViewerProps> = ({ cv, onClose }) => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/cvs/${cv.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = cv.fileName;
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
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">CV Details</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors duration-200"
              title="Download CV"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Candidate information */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{cv.candidateName}</h3>
                    <p className="text-blue-400 font-medium">{cv.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Mail className="h-4 w-4" />
                    <span>{cv.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone className="h-4 w-4" />
                    <span>{cv.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="h-4 w-4" />
                    <span>{cv.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Award className="h-4 w-4" />
                    <span>{cv.experience} years experience</span>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Education</span>
                </h4>
                <p className="text-slate-300">{cv.education}</p>
              </div>

              {/* Skills */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Professional summary */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Professional Summary</h4>
                <p className="text-slate-300 leading-relaxed">
                  Experienced {cv.position.toLowerCase()} with {cv.experience} years of expertise in software development 
                  and project management. Proven track record of delivering high-quality solutions and leading 
                  cross-functional teams. Strong background in {cv.skills.slice(0, 3).join(', ')} and modern 
                  development practices.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Assessment */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Assessment</h4>
                <div className="space-y-4">
                  {cv.score && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-300 text-sm">Overall Score</span>
                        <span className="text-white font-semibold">{cv.score}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${cv.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Experience Match</span>
                      <span className={`text-sm ${cv.experience >= 5 ? 'text-green-400' : cv.experience >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {cv.experience >= 5 ? 'High' : cv.experience >= 3 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Skills Match</span>
                      <span className={`text-sm ${cv.skills.length >= 5 ? 'text-green-400' : cv.skills.length >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {cv.skills.length >= 5 ? 'High' : cv.skills.length >= 3 ? 'Good' : 'Basic'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Education</span>
                      <span className={`text-sm ${['PhD', 'Master'].includes(cv.education) ? 'text-green-400' : 'text-blue-400'}`}>
                        {['PhD', 'Master'].includes(cv.education) ? 'Advanced' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* File information */}
              <div className="bg-slate-700/30 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">File Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Name</span>
                    <span className="text-white truncate max-w-[150px]" title={cv.fileName}>{cv.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size</span>
                    <span className="text-white">{(cv.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Upload Date</span>
                    <span className="text-white">{cv.uploadDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={`font-medium ${
                      cv.status === 'shortlisted' ? 'text-green-400' :
                      cv.status === 'reviewed' ? 'text-blue-400' :
                      cv.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
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