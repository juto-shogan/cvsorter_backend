import React from 'react';
import { CV } from '../../types';
import { User, MapPin, Calendar, Award, Mail, Phone, Eye, Trash2, CheckCircle } from 'lucide-react';
import { useCV } from '../../contexts/CVContext';

interface CVCardProps {
  cv: CV;
  onView: (cv: CV) => void;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onView }) => {
  const { updateCV, deleteCV } = useCV();

  // Get status-specific styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Handle status change with optimistic updates
  const handleStatusChange = async (newStatus: CV['status']) => {
    try {
      await updateCV(cv.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update CV status:', error);
      // Could show a toast notification here
    }
  };

  // Handle CV approval
  const handleApprove = async () => {
    if (cv.status !== 'approved') {
      await handleStatusChange('approved');
    }
  };

  // Handle CV deletion with confirmation
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${cv.candidateName}'s CV?`)) {
      try {
        await deleteCV(cv.id);
      } catch (error) {
        console.error('Failed to delete CV:', error);
        alert('Failed to delete CV. Please try again.');
      }
    }
  };

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-200 group">
      {/* Candidate header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{cv.candidateName}</h3>
          <p className="text-blue-400 font-medium">{cv.position}</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* AI matching score */}
          {cv.score && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {cv.score}%
            </div>
          )}
          {/* Status badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(cv.status)}`}>
            {cv.status}
          </div>
        </div>
      </div>

      {/* Candidate details grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2 text-slate-300">
          <Award className="h-4 w-4" />
          <span>{cv.experience} years exp.</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <MapPin className="h-4 w-4" />
          <span>{cv.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <Mail className="h-4 w-4" />
          <span className="truncate">{cv.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <Calendar className="h-4 w-4" />
          <span>{cv.uploadDate.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Skills section */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {cv.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md text-xs"
            >
              {skill}
            </span>
          ))}
          {cv.skills.length > 4 && (
            <span className="bg-slate-700/50 text-slate-400 px-2 py-1 rounded-md text-xs">
              +{cv.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Approve button */}
          {cv.status !== 'approved' && (
            <button
              onClick={handleApprove}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center space-x-1"
              title="Approve CV"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve</span>
            </button>
          )}
          
          {/* Status dropdown */}
          <select
            value={cv.status}
            onChange={(e) => handleStatusChange(e.target.value as CV['status'])}
            className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {/* View and delete buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(cv)}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 rounded-lg transition-colors duration-200"
            title="View CV details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors duration-200"
            title="Delete CV"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CVCard;