// src/contexts/CVContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react'; // Added useMemo import
import { CV, FilterCriteria } from '../types'; // Adjust path if your types.ts is elsewhere
import { useAuth } from './AuthContext';

// Define the shape of your CVContext values
interface CVContextType {
  cvs: CV[];
  filteredCVs: CV[];
  isLoading: boolean;
  error: string | null;
  filters: FilterCriteria;
  searchTerm: string;
  sortBy: string;
  fetchCVs: () => Promise<void>;
  addCV: (newCV: CV) => void;
  updateCV: (updatedCV: CV) => void;
  deleteCV: (id: string) => void;
  updateFilters: (newFilters: Partial<FilterCriteria>) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (criteria: string) => void;
}

// Create the CVContext
const CVContext = createContext<CVContextType | undefined>(undefined);

interface CVProviderProps {
  children: ReactNode;
}

export const CVProvider: React.FC<CVProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
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
    status: 'all', // Default status to 'all' to show all CVs initially
    minScore: 0, // Added minScore
    maxScore: 100, // Added maxScore
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('uploadDate');

  const API_BASE_URL = 'http://localhost:5000/api'; // Make sure this is your correct backend URL

  const fetchCVs = useCallback(async () => {
    if (!user || !token) {
      setCVs([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/cvs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch CVs');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCVs(data);
      } else {
        console.warn("Backend /api/cvs did not return an array directly:", data);
        setError("Unexpected data format from backend for CVs. Please check backend response structure.");
        setCVs([]);
      }

    } catch (error: any) {
      console.error('Error fetching CVs:', error);
      setError(error.message || 'Failed to fetch CVs.');
      setCVs([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, token, API_BASE_URL]);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const addCV = useCallback((newCV: CV) => {
    setCVs(prev => [newCV, ...prev]);
  }, []);

  const updateCV = useCallback((updatedCV: CV) => {
    setCVs(prev => prev.map(cv => (cv._id === updatedCV._id ? updatedCV : cv))); // Use _id from types.ts
  }, []);

  const deleteCV = useCallback((id: string) => {
    setCVs(prev => prev.filter(cv => cv._id !== id)); // Use _id from types.ts
  }, []);

  // Filter and sort logic
  const filteredAndSortedCVs = useMemo(() => {
    let currentCVs = [...cvs];

    // 1. Apply Search Term Filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentCVs = currentCVs.filter(cv =>
        cv.fileName.toLowerCase().includes(lowerCaseSearchTerm) ||
        // Added safe access for cv.analysis properties
        (cv.analysis?.candidateName && cv.analysis.candidateName.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (cv.analysis?.position && cv.analysis.position.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (cv.analysis?.skills && cv.analysis.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm)))
      );
    }

    // 2. Apply Filters
    currentCVs = currentCVs.filter(cv => {
      // CRITICAL: Check if cv.analysis exists before accessing its properties
      if (!cv.analysis) {
        // If analysis data is missing, we'll filter it out for now.
        // You might decide to handle this differently (e.g., show a placeholder)
        return false;
      }

      // Position filter
      if (filters.position && cv.analysis.position.toLowerCase() !== filters.position.toLowerCase()) {
        return false;
      }
      // Score filter - now safe because cv.analysis is checked above
      if (cv.analysis.score === undefined || cv.analysis.score < filters.minScore || cv.analysis.score > filters.maxScore) {
        return false;
      }
      // Experience filter - now safe
      if (cv.analysis.experience === undefined || cv.analysis.experience < filters.minExperience || cv.analysis.experience > filters.maxExperience) {
        return false;
      }
      // Status filter - now safe
      if (filters.status !== 'all' && cv.analysis.status !== filters.status) {
        return false;
      }
      // Skills filter (check if all selected skills are present) - now safe
      if (filters.skills.length > 0) {
        const cvSkillsLower = cv.analysis.skills.map(s => s.toLowerCase());
        const allRequiredSkillsPresent = filters.skills.every(filterSkill =>
          cvSkillsLower.includes(filterSkill.toLowerCase())
        );
        if (!allRequiredSkillsPresent) {
          return false;
        }
      }
      // Education filter (add safe access)
      if (filters.education && (!cv.analysis.education || cv.analysis.education.toLowerCase() !== filters.education.toLowerCase())) {
        return false;
      }
      // Location filter (add safe access)
      if (filters.location && (!cv.analysis.location || cv.analysis.location.toLowerCase() !== filters.location.toLowerCase())) {
        return false;
      }

      return true;
    });

    // 3. Apply Sort
    currentCVs.sort((a, b) => {
      // Also add checks here if analysis or specific properties might be missing
      const aAnalysis = a.analysis || {}; // Provide default empty object
      const bAnalysis = b.analysis || {};

      switch (sortBy) {
        case 'uploadDate':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'candidateName':
          // Safely access candidateName, default to empty string if undefined
          return (aAnalysis.candidateName || '').localeCompare(bAnalysis.candidateName || '');
        case 'score':
          // Safely access score, default to 0 if undefined
          return (bAnalysis.score || 0) - (aAnalysis.score || 0);
        case 'experience':
          // Safely access experience, default to 0 if undefined
          return (bAnalysis.experience || 0) - (aAnalysis.experience || 0);
        default:
          return 0;
      }
    });

    return currentCVs;
  }, [cvs, searchTerm, filters, sortBy]);


  const updateFilters = useCallback((newFilters: Partial<FilterCriteria>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const contextValue = useMemo(() => ({
    cvs,
    filteredCVs: filteredAndSortedCVs,
    isLoading,
    error,
    filters,
    searchTerm,
    sortBy,
    fetchCVs,
    addCV,
    updateCV,
    deleteCV,
    updateFilters,
    setSearchTerm,
    setSortBy,
  }), [
    cvs,
    filteredAndSortedCVs,
    isLoading,
    error,
    filters,
    searchTerm,
    sortBy,
    fetchCVs,
    addCV,
    updateCV,
    deleteCV,
    updateFilters,
    setSearchTerm,
    setSortBy,
  ]);

  return (
    <CVContext.Provider value={contextValue}>
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};