import React from 'react';
import { useCV } from '../../contexts/CVContext';
import { Search, Filter, X } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const { 
    filters, 
    updateFilters, 
    searchTerm, 
    setSearchTerm, 
    sortBy, 
    setSortBy,
    filteredCVs,
    cvs
  } = useCV();

  // Reset all filters to default values
  const clearFilters = () => {
    updateFilters({
      position: '',
      minExperience: 0,
      maxExperience: 20,
      skills: [],
      education: '',
      location: '',
      status: ''
    });
    setSearchTerm('');
    setSortBy('uploadDate');
  };

  // Check if any filters are currently active
  const hasActiveFilters = searchTerm || filters.position || filters.status || 
    filters.location || filters.minExperience > 0 || filters.maxExperience < 20;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 space-y-6">
      {/* FILTER HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {/* RESULTS COUNTER */}
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
            {filteredCVs.length}/{cvs.length}
          </span>
        </div>
        {/* CLEAR FILTERS BUTTON */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-slate-400 hover:text-red-400 transition-colors duration-200 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span className="text-sm">Clear</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* SEARCH INPUT */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or position..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* SORT DROPDOWN */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="uploadDate">Upload Date</option>
            <option value="name">Name</option>
            <option value="experience">Experience</option>
            <option value="score">Score</option>
          </select>
        </div>

        {/* POSITION FILTER */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
          <input
            type="text"
            value={filters.position}
            onChange={(e) => updateFilters({ position: e.target.value })}
            placeholder="e.g., Software Engineer"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>

        {/* STATUS FILTER */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value })}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* LOCATION FILTER */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            placeholder="e.g., New York"
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>

        {/* EXPERIENCE RANGE SLIDERS */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Experience: {filters.minExperience} - {filters.maxExperience} years
          </label>
          <div className="space-y-2">
            {/* MINIMUM EXPERIENCE SLIDER */}
            <input
              type="range"
              min="0"
              max="20"
              value={filters.minExperience}
              onChange={(e) => updateFilters({ minExperience: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
            {/* MAXIMUM EXPERIENCE SLIDER */}
            <input
              type="range"
              min="0"
              max="20"
              value={filters.maxExperience}
              onChange={(e) => updateFilters({ maxExperience: Number(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;