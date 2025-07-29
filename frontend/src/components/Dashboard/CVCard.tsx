import React from 'react';
import { CV } from '../../types'; // Correctly imports CV interface from src/types/index.ts (or src/types.ts if renamed)
import { User, MapPin, Calendar, Award, Mail, Phone, Eye, Trash2 } from 'lucide-react';
import { useCV } from '../../contexts/CVContext'; // For updating/deleting from global state
import { useAuth } from '../../contexts/AuthContext'; // Correctly imports useAuth from src/contexts/AuthContext.tsx

interface CVCardProps {
  cv: CV;
  onView: (cv: CV) => void; // Function to open the CVViewer for this CV
}

const CVCard: React.FC<CVCardProps> = ({ cv, onView }) => {
  const { updateCV, deleteCV } = useCV(); // Functions from CVContext to manipulate local CV list
  const { token } = useAuth(); // Get the authentication token for API calls

  // Helper function to determine status-specific styling
  const getStatusColor = (status: CV['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reviewed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'shortlisted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // 1. Handle status change (PATCH /api/cvs/:id)
  const handleStatusChange = async (newStatus: CV['status']) => {
    // If the status hasn't actually changed, do nothing
    if (cv.status === newStatus) {
      return;
    }

    if (!token) {
        console.error("No authentication token available for status update. Please log in.");
        alert("You need to be logged in to update CV status.");
        return;
    }

    const previousStatus = cv.status; // Store current status for potential rollback

    // Optimistic update: Update UI immediately for better user experience
    updateCV({ ...cv, status: newStatus }); // This now correctly matches CVContext's updateCV signature

    try {
      const response = await fetch(`http://localhost:5000/api/cvs/${cv.id}`, { // <-- Correct backend endpoint
        method: 'PATCH', // Use PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the authentication token
        },
        body: JSON.stringify({ status: newStatus }), // Send only the new status
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update CV status');
      }

      // If successful, the optimistic update is confirmed. No need to update state again unless backend returns new data.
      console.log(`CV ${cv.id} status updated to ${newStatus}`);
      // Optionally, you could re-fetch the specific CV or update with response data if the backend modifies other fields
    } catch (error) {
      console.error('Error updating CV status:', error);
      // Rollback: Revert to previous status if the API call fails
      updateCV({ ...cv, status: previousStatus });
      alert(`Failed to update status: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 2. Handle CV deletion (DELETE /api/cvs/:id)
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return; // User cancelled the deletion
    }

    if (!token) {
        console.error("No authentication token available for delete operation. Please log in.");
        alert("You need to be logged in to delete CVs.");
        return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cvs/${cv.id}`, { // <-- Correct backend endpoint
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the authentication token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete CV');
      }

      console.log(`CV ${cv.id} deleted successfully.`);
      deleteCV(cv.id); // Remove the CV from the global state via CVContext
    } catch (error) {
      console.error('Error deleting CV:', error);
      alert(`Failed to delete CV: ${error instanceof Error ? error.message : String(error)}`);
    }
  };


  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 flex flex-col justify-between h-full">
      {/* CV Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="bg-blue-500/20 p-3 rounded-full">
          <User className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{cv.name}</h2>
          <p className="text-slate-400 text-sm flex items-center">
            {cv.position && <span className="mr-2">{cv.position}</span>}
            {cv.location && (
              <>
                <MapPin className="h-3 w-3 mr-1" /> {cv.location}
              </>
            )}
          </p>
        </div>
      </div>

      {/* CV Details */}
      <div className="space-y-3 text-sm text-slate-300 flex-grow">
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
        <p className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-blue-400" />
          <span>{cv.experience} years of experience</span>
        </p>
        <p className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span>Uploaded: {new Date(cv.uploadDate).toLocaleDateString()}</span>
        </p>
        {cv.score !== undefined && (
          <p className="flex items-center space-x-2">
            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md text-xs font-semibold">
              Score: {cv.score}%
            </span>
          </p>
        )}
      </div>

      {/* Skills display */}
      <div className="mt-4 mb-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {cv.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs">
              {skill}
            </span>
          ))}
          {cv.skills.length > 4 && (
            <span className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs">
              +{cv.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-700/50">
        {/* Status dropdown */}
        <select
          value={cv.status}
          onChange={(e) => handleStatusChange(e.target.value as CV['status'])}
          className={`bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getStatusColor(cv.status)}`}
        >
          <option value="pending" className="bg-slate-800 text-yellow-400">Pending</option>
          <option value="reviewed" className="bg-slate-800 text-blue-400">Reviewed</option>
          <option value="shortlisted" className="bg-slate-800 text-green-400">Shortlisted</option>
          <option value="rejected" className="bg-slate-800 text-red-400">Rejected</option>
        </select>
        
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