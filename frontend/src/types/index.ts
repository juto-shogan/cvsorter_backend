// src/types.ts

export interface CV {
  _id: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  analysis: {
    candidateName: string;
    email: string;
    phone: string;
    position: string;
    score: number;
    experience: number; // In years
    skills: string[];
    status: 'pending' | 'shortlisted' | 'rejected';
    feedback?: string;
  };
  uploadedBy: string; // User ID
  uploadDate: string; // ISO date string
  lastUpdated: string; // ISO date string
}

export interface FilterCriteria {
  position: string;
  minScore: number;
  maxScore: number;
  minExperience: number;
  maxExperience: number;
  status: 'all' | 'pending' | 'shortlisted' | 'rejected';
  skills: string[]; // Keywords to filter by
}