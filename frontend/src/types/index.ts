export interface CV {
  id: string;
  _id?: string;
  fileName: string;
  uploadDate: Date | string;
  fileSize: number;
  candidateName: string;
  position: string;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  email: string;
  phone: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  score?: number;
  file?: File;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  name: string;
  company?: string;
}

export interface DashboardAnalytics {
  total: number;
  approved: number;
  reviewed: number;
  rejected: number;
  recentUploads?: number;
  averageScore?: number;
}

export interface FilterCriteria {
  position: string;
  minExperience: number;
  maxExperience: number;
  skills: string[];
  education: string;
  location: string;
  status: string;
}
