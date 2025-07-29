// src/pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useCV } from '../contexts/CVContext';
import { useAuth } from '../contexts/AuthContext';
import { CV } from '../types'; // Ensure CV type is imported
import FilterPanel from '../components/Dashboard/FilterPanel';
import CVList from '../components/Dashboard/CVList';
import './Dashboard.css'; // For dashboard specific styling, you'll need to create this CSS file

const Dashboard: React.FC = () => {
  const { filteredCVs, isLoading, error, fetchCVs, setSearchTerm, sortBy, setSortBy } = useCV(); // Added setSearchTerm, sortBy, setSortBy
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchCVs();
    }
  }, [user, token, fetchCVs]);

  if (!user) {
    return <div className="dashboard-container">Please log in to view the dashboard.</div>;
  }

  // Handle search input for the CVList
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search CVs by name, position, skills..."
            className="search-input"
            onChange={handleSearchChange}
          />
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <FilterPanel />
        </aside>

        <main className="dashboard-main-content">
          {isLoading && <p className="loading-message">Loading CVs...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {!isLoading && !error && filteredCVs.length === 0 && (
            <p className="no-results-message">No CVs found matching your criteria. Try adjusting your filters.</p>
          )}
          {!isLoading && !error && filteredCVs.length > 0 && (
            <CVList cvs={filteredCVs} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;