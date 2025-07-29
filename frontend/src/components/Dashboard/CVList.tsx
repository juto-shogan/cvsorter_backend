// src/components/Dashboard/CVList.tsx
import React from 'react';
import { CV } from '../../types'; // Import your CV type
import './CVList.css'; // Assuming you'll have CSS for the list

interface CVListProps {
  cvs: CV[];
  // You might add props for handling actions like:
  // onCVClick?: (cv: CV) => void;
  // onDeleteCV?: (id: string) => void;
  // onUpdateStatus?: (id: string, newStatus: 'pending' | 'shortlisted' | 'rejected') => void;
}

const CVList: React.FC<CVListProps> = ({ cvs }) => {
  if (cvs.length === 0) {
    return <p className="no-cvs-message">No CVs to display with the current filters.</p>;
  }

  return (
    <div className="cv-list-container">
      {cvs.map((cv) => (
        <div key={cv._id} className="cv-card">
          <div className="cv-header">
            <h3>{cv.analysis.candidateName || cv.fileName}</h3>
            <span className={`cv-status status-${cv.analysis.status}`}>
              {cv.analysis.status.charAt(0).toUpperCase() + cv.analysis.status.slice(1)}
            </span>
          </div>
          <div className="cv-details">
            <p><strong>Position:</strong> {cv.analysis.position || 'N/A'}</p>
            <p><strong>Score:</strong> {cv.analysis.score !== undefined ? `${cv.analysis.score}%` : 'N/A'}</p>
            <p><strong>Experience:</strong> {cv.analysis.experience !== undefined ? `${cv.analysis.experience} years` : 'N/A'}</p>
            <p><strong>Email:</strong> {cv.analysis.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {cv.analysis.phone || 'N/A'}</p>
            <p className="cv-skills">
              <strong>Skills:</strong> {cv.analysis.skills.length > 0 ? cv.analysis.skills.join(', ') : 'None listed'}
            </p>
            {cv.analysis.feedback && <p><strong>Feedback:</strong> {cv.analysis.feedback}</p>}
            <p className="cv-upload-info">
              Uploaded on: {new Date(cv.uploadDate).toLocaleDateString()}
            </p>
          </div>
          <div className="cv-actions">
            {/* Example buttons - uncomment and implement handlers in Dashboard or useCV context */}
            {/* <button className="view-button">View Details</button> */}
            {/* <button className="edit-button">Edit</button> */}
            {/* <button className="delete-button">Delete</button> */}
            {/* <select
              value={cv.analysis.status}
              onChange={(e) => onUpdateStatus && onUpdateStatus(cv._id, e.target.value as any)}
            >
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CVList;