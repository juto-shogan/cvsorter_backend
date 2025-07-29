// src/contexts/CVContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CV, FilterCriteria } from '../types';
import api from '../services/api'; // Import the new API service

// Define the shape of your dashboard statistics
interface DashboardStats {
  total: number;
  approved: number;
  reviewed: number;
  rejected: number;
}

// Define the shape of your CVContext values
interface CVContextType {
  cvs: CV[];
  filteredCVs: CV[];
  isLoading: boolean;
  error: string | null;
  filters: FilterCriteria;
  searchTerm: string;
  sortBy: string;
  dashboardStats: DashboardStats; // Add dashboardStats to context type
  fetchCVs: () => Promise<void>;
  addCV: (newCV: CV) => void;
  updateCV: (id: string, updates: Partial<CV>) => Promise<void>; // Make updateCV return a promise
  deleteCV: (id: string) => Promise<void>; // Make deleteCV return a promise
  updateFilters: (newFilters: Partial<FilterCriteria>) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (criteria: string) => void;
  refreshStats: () => Promise<void>; // Add refreshStats to context type
}

// Create the CVContext
const CVContext = createContext<CVContextType | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
}

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterCriteria>({
    position: '',
    minExperience: 0,
    maxExperience: 20,
    skills: [],
    education: '',
    location: '',
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate'); // Default sort by upload date
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total: 0,
    approved: 0,
    reviewed: 0,
    rejected: 0,
  });

  // Function to fetch all CVs
  const fetchCVs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the api.get method to fetch CVs
      const data = await api.get<CV[]>('cvs');
      setCVs(data);
    } catch (err) {
      console.error('Failed to fetch CVs:', err);
      setError('Failed to load CVs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to fetch dashboard statistics
  const fetchDashboardStats = useCallback(async () => {
    try {
      // Use the api.get method to fetch dashboard stats
      const stats = await api.get<DashboardStats>('dashboard-stats');
      setDashboardStats(stats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      // Optionally set an error state for stats if needed
    }
  }, []);

  // Combined refresh function for dashboard data
  const refreshStats = useCallback(async () => {
    await Promise.all([fetchCVs(), fetchDashboardStats()]);
  }, [fetchCVs, fetchDashboardStats]);

  // Add a new CV (assuming it's handled by the upload process and then potentially added locally or refetched)
  // For now, we'll keep it simple: if a CV is added, we'll refetch all CVs to ensure consistency.
  const addCV = useCallback((newCV: CV) => {
    // In a real scenario, this would likely be called after a successful upload
    // that returns the new CV data from the backend.
    // For now, if we call addCV directly, we will just refetch everything.
    fetchCVs();
  }, [fetchCVs]);

  // Update an existing CV
  const updateCV = useCallback(async (id: string, updates: Partial<CV>) => {
    try {
      // Use the api.put method to update a CV
      const updatedData = await api.put<CV>(`cvs/${id}`, updates);
      setCVs(prevCvs =>
        prevCvs.map(cv => (cv.id === id ? { ...cv, ...updatedData } : cv))
      );
      // Refresh stats if status changes
      if (updates.status) {
        fetchDashboardStats();
      }
    } catch (err) {
      console.error(`Failed to update CV ${id}:`, err);
      throw err; // Re-throw to allow component to handle
    }
  }, [fetchDashboardStats]);

  // Delete a CV
  const deleteCV = useCallback(async (id: string) => {
    try {
      // Use the api.delete method to delete a CV
      await api.delete<void>(`cvs/${id}`);
      setCVs(prevCvs => prevCvs.filter(cv => cv.id !== id));
      fetchDashboardStats(); // Refresh stats after deletion
    } catch (err) {
      console.error(`Failed to delete CV ${id}:`, err);
      throw err; // Re-throw to allow component to handle
    }
  }, [fetchDashboardStats]);


  // Fetch CVs and dashboard stats on component mount
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // Filter and sort CVs based on state
  const filteredAndSortedCVs = useMemo(() => {
    let currentCVs = cvs
      .filter(cv => {
        // Search term filter
        const matchesSearch = searchTerm ?
          cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.location.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        // Filters from FilterCriteria
        const matchesPosition = filters.position ? cv.position.toLowerCase().includes(filters.position.toLowerCase()) : true;
        const matchesExperience = cv.experience >= filters.minExperience && cv.experience <= filters.maxExperience;
        const matchesStatus = filters.status ? cv.status === filters.status : true;
        const matchesLocation = filters.location ? cv.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
        const matchesEducation = filters.education ? cv.education.toLowerCase().includes(filters.education.toLowerCase()) : true;
        const matchesSkills = filters.skills.length > 0 ? filters.skills.every(filterSkill =>
          cv.skills.some(cvSkill => cvSkill.toLowerCase().includes(filterSkill.toLowerCase()))
        ) : true;

        return matchesSearch && matchesPosition && matchesExperience && matchesStatus && matchesLocation && matchesEducation && matchesSkills;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'uploadDate':
            return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
          case 'candidateName':
            return a.candidateName.localeCompare(b.candidateName);
          case 'score':
            // Assuming score can be undefined, handle it
            return (b.score || 0) - (a.score || 0);
          case 'experience':
            return b.experience - a.experience;
          default:
            return 0;
        }
      });

    return currentCVs;
  }, [cvs, searchTerm, filters, sortBy]);

  const updateFilters = useCallback((newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const value = useMemo(() => ({
    cvs,
    filteredCVs: filteredAndSortedCVs,
    isLoading,
    error,
    filters,
    searchTerm,
    sortBy,
    dashboardStats,
    fetchCVs,
    addCV,
    updateCV,
    deleteCV,
    updateFilters,
    setSearchTerm,
    setSortBy,
    refreshStats,
  }), [
    cvs,
    filteredAndSortedCVs,
    isLoading,
    error,
    filters,
    searchTerm,
    sortBy,
    dashboardStats,
    fetchCVs,
    addCV,
    updateCV,
    deleteCV,
    updateFilters,
    setSearchTerm,
    setSortBy,
    refreshStats,
  ]);

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};