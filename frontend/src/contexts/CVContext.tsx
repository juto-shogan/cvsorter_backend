import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CV, FilterCriteria } from '../types';
import api from '../services/api';

interface DashboardStats {
  total: number;
  approved: number;
  reviewed: number;
  rejected: number;
}

interface CVContextType {
  cvs: CV[];
  filteredCVs: CV[];
  isLoading: boolean;
  error: string | null;
  filters: FilterCriteria;
  searchTerm: string;
  sortBy: string;
  dashboardStats: DashboardStats;
  fetchCVs: () => Promise<void>;
  addCV: (newCV: CV) => void;
  updateCV: (id: string, updates: Partial<CV>) => Promise<void>;
  deleteCV: (id: string) => Promise<void>;
  updateFilters: (newFilters: Partial<FilterCriteria>) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (criteria: string) => void;
  refreshStats: () => Promise<void>;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
}

const normalizeCV = (cv: Partial<CV> & { _id?: string; id?: string }): CV => ({
  ...cv,
  id: cv.id || cv._id || '',
  uploadDate: cv.uploadDate || new Date().toISOString(),
  skills: cv.skills || [],
  experience: Number(cv.experience) || 0,
  status: (cv.status as CV['status']) || 'pending',
  fileName: cv.fileName || 'unknown',
  fileSize: Number(cv.fileSize) || 0,
  candidateName: cv.candidateName || 'Unknown Candidate',
  position: cv.position || 'General Applicant',
  education: cv.education || 'N/A',
  location: cv.location || 'N/A',
  email: cv.email || 'N/A',
  phone: cv.phone || 'N/A',
});

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
  const [sortBy, setSortBy] = useState('uploadDate');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total: 0,
    approved: 0,
    reviewed: 0,
    rejected: 0,
  });

  const fetchCVs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<CV[]>('cvs');
      setCVs((data || []).map(normalizeCV));
    } catch (err) {
      console.error('Failed to fetch CVs:', err);
      setError('Failed to load CVs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const stats = await api.get<DashboardStats>('dashboard-stats');
      setDashboardStats(stats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    await Promise.all([fetchCVs(), fetchDashboardStats()]);
  }, [fetchCVs, fetchDashboardStats]);

  const addCV = useCallback((_newCV: CV) => {
    fetchCVs();
  }, [fetchCVs]);

  const updateCV = useCallback(async (id: string, updates: Partial<CV>) => {
    try {
      const updatedPayload = await api.put<{ cv: CV }>(`cvs/${id}`, updates);
      const updatedCV = normalizeCV(updatedPayload.cv);

      setCVs(prevCvs =>
        prevCvs.map(cv => (cv.id === id ? { ...cv, ...updatedCV } : cv))
      );

      if (updates.status) {
        fetchDashboardStats();
      }
    } catch (err) {
      console.error(`Failed to update CV ${id}:`, err);
      throw err;
    }
  }, [fetchDashboardStats]);

  const deleteCV = useCallback(async (id: string) => {
    try {
      await api.delete<void>(`cvs/${id}`);
      setCVs(prevCvs => prevCvs.filter(cv => cv.id !== id));
      fetchDashboardStats();
    } catch (err) {
      console.error(`Failed to delete CV ${id}:`, err);
      throw err;
    }
  }, [fetchDashboardStats]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const filteredAndSortedCVs = useMemo(() => {
    return cvs
      .filter(cv => {
        const matchesSearch = searchTerm ?
          cv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          cv.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cv.location.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

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
            return (b.score || 0) - (a.score || 0);
          case 'experience':
            return b.experience - a.experience;
          default:
            return 0;
        }
      });
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
    refreshStats,
  ]);

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};
