// src/components/Dashboard/FilterPanel.tsx
import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useCV } from '../../contexts/CVContext';
import { FilterCriteria } from '../../types'; // Ensure FilterCriteria is imported
import './FilterPanel.css'; // Assuming you have some basic CSS for styling

const FilterPanel: React.FC = () => {
  const { filters, updateFilters, cvs } = useCV(); // Get filters and updateFilters from context, also cvs to extract unique positions/skills

  // Local state to manage filter inputs before applying them (optional, but good for UX)
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  // Update local filters when context filters change (e.g., if reset from another component)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setLocalFilters(prev => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setLocalFilters(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSkillChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setLocalFilters(prev => ({
      ...prev,
      skills: selectedOptions,
    }));
  };

  const applyFilters = () => {
    updateFilters(localFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterCriteria = {
      position: '',
      minScore: 0,
      maxScore: 100,
      minExperience: 0,
      maxExperience: 50,
      status: 'all',
      skills: [],
    };
    setLocalFilters(defaultFilters);
    updateFilters(defaultFilters);
  };

  // Extract unique positions and skills from the available CVs for dropdowns
  const uniquePositions = useMemo(() => {
    const positions = new Set<string>();
    cvs.forEach(cv => {
      if (cv.analysis.position) {
        positions.add(cv.analysis.position);
      }
    });
    return Array.from(positions).sort();
  }, [cvs]);

  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    cvs.forEach(cv => {
      cv.analysis.skills.forEach(skill => {
        skills.add(skill);
      });
    });
    return Array.from(skills).sort();
  }, [cvs]);

  return (
    <div className="filter-panel">
      <h3>Filter & Sort CVs</h3>

      <div className="filter-group">
        <label htmlFor="position-filter">Position:</label>
        <select
          id="position-filter"
          name="position"
          value={localFilters.position}
          onChange={handleInputChange}
        >
          <option value="">All Positions</option>
          {uniquePositions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          name="status"
          value={localFilters.status}
          onChange={handleInputChange}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="filter-group score-experience-group">
        <label>Score:</label>
        <div className="range-inputs">
          <input
            type="number"
            name="minScore"
            value={localFilters.minScore}
            onChange={handleInputChange}
            placeholder="Min Score"
            min="0"
            max="100"
          />
          <span>-</span>
          <input
            type="number"
            name="maxScore"
            value={localFilters.maxScore}
            onChange={handleInputChange}
            placeholder="Max Score"
            min="0"
            max="100"
          />
        </div>
      </div>

      <div className="filter-group score-experience-group">
        <label>Experience (Years):</label>
        <div className="range-inputs">
          <input
            type="number"
            name="minExperience"
            value={localFilters.minExperience}
            onChange={handleInputChange}
            placeholder="Min Exp"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            name="maxExperience"
            value={localFilters.maxExperience}
            onChange={handleInputChange}
            placeholder="Max Exp"
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="skills-filter">Skills (Ctrl+Click to select multiple):</label>
        <select
          id="skills-filter"
          name="skills"
          multiple
          value={localFilters.skills}
          onChange={handleSkillChange}
          size={5} // Show multiple options at once
        >
          {uniqueSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      <div className="filter-actions">
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Sorting options - integrate with useCV's sortBy */}
      <div className="filter-group">
        <label htmlFor="sort-by">Sort By:</label>
        <select
          id="sort-by"
          name="sortBy"
          value={useCV().sortBy} // Directly use sortBy from context
          onChange={(e) => useCV().setSortBy(e.target.value)} // Directly update sortBy in context
        >
          <option value="uploadDate">Upload Date (Newest First)</option>
          <option value="candidateName">Candidate Name (A-Z)</option>
          <option value="score">Score (High to Low)</option>
          <option value="experience">Experience (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;