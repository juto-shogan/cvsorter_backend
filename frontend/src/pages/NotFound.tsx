// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // You'll want to create this CSS file for styling

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="not-found-link">Go to Dashboard</Link>
      <Link to="/" className="not-found-link">Go to Home</Link>
    </div>
  );
};

export default NotFound;