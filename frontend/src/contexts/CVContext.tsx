import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CV, FilterCriteria } from '../types';

interface DashboardStats {
  total: number;
  approved: number;
  reviewed: number;
  rejected: number;
}

interface CVContextType {
  cvs: CV[];
  addCV: (cv: CV) => void;
  updateCV: (id: string, updates: Partial<CV>) => void;
  deleteCV: (id: string) => void;
  filteredCVs: CV[];
  filters: FilterCriteria;
  updateFilters: (filters: Partial<FilterCriteria>) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dashboardStats: DashboardStats;
  refreshStats: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};

interface CVProviderProps {
  children: ReactNode;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [filters, setFilters] = useState<FilterCriteria>({
    position: '',
    minExperience: 0,
    maxExperience: 20,
    skills: [],
    education: '',
    location: '',
    status: ''
  });
  const [sortBy, setSortBy] = useState('uploadDate');
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total: 0,
    approved: 0,
    reviewed: 0,
    rejected: 0
  });

  // Fetch CVs on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://localhost:5000/api/cvs', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setCVs(data.cvs || []);
      })
      .catch(console.error);
    }
  }, []);

  // Fetch dashboard analytics
  const refreshStats = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://localhost:5000/api/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        setDashboardStats(data.stats || {
          total: 0,
          approved: 0,
          reviewed: 0,
          rejected: 0
        });
      })
      .catch(console.error);
    }
  };

  // Fetch stats on component mount and when CVs change
  useEffect(() => {
    refreshStats();
  }, [cvs]);

  // Add CV to backend and local state
  const addCV = async (cv: CV) => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/cvs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cv),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add CV');
      }
      
      const savedCV = await response.json();
      setCVs(prev => [...prev, savedCV.cv || savedCV]);
      refreshStats(); // Update stats after adding CV
    } catch (error) {
      console.error('Error adding CV:', error);
      throw error; // Re-throw for component error handling
    }
  };

  // Update CV status in backend and local state
  const updateCV = async (id: string, updates: Partial<CV>) => {
    const token = localStorage.getItem('authToken');
    
    // Optimistic update
    setCVs(prev => prev.map(cv => cv.id === id ? { ...cv, ...updates } : cv));
    
    try {
      const response = await fetch(`http://localhost:5000/api/cvs/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update CV');
      }
      
      const updatedCV = await response.json();
      setCVs(prev => prev.map(cv => cv.id === id ? updatedCV.cv || updatedCV : cv));
      refreshStats(); // Update stats after updating CV
    } catch (error) {
      console.error('Update failed:', error);
      // Revert optimistic update on error
      setCVs(prev => prev.map(cv => cv.id === id ? cv : cv));
      throw error;
    }
  };

  // Delete CV from backend and local state
  const deleteCV = async (id: string) => {
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/cvs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete CV');
      }
      
      setCVs(prev => prev.filter(cv => cv.id !== id));
      refreshStats(); // Update stats after deleting CV
    } catch (error) {
      console.error('Delete failed:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Client-side filtering and sorting
  const filteredCVs = cvs
    .filter(cv => {
      if (searchTerm && !cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !cv.position.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.position && !cv.position.toLowerCase().includes(filters.position.toLowerCase())) {
        return false;
      }
      if (cv.experience < filters.minExperience || cv.experience > filters.maxExperience) {
        return false;
      }
      if (filters.status && cv.status !== filters.status) {
        return false;
      }
      if (filters.location && !cv.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.candidateName.localeCompare(b.candidateName);
        case 'experience':
          return b.experience - a.experience;
        case 'uploadDate':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'score':
          return (b.score || 0) - (a.score || 0);
        default:
          return 0;
      }
    });

  const value = {
    cvs,
    addCV,
    updateCV,
    deleteCV,
    filteredCVs,
    filters,
    updateFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    dashboardStats,
    refreshStats
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};