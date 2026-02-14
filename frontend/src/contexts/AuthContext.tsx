// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api'; // Import the new API service

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login function with backend integration using the new API client
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use the api.post method for login
      const data = await api.post<{ user: User; token: string }>('auth/login', { email, password });
      
      localStorage.setItem('authToken', data.token);
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        name: data.user.name,
        company: data.user.company || 'OGTL'
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('authToken'); // Ensure token is removed on failure
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with backend integration using the new API client
  const signup = async (username: string, email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use the api.post method for signup
      const data = await api.post<{ user: User; token: string }>('auth/register', { username, email, password, name });

      localStorage.setItem('authToken', data.token);
      setUser({
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        name: data.user.name,
        company: data.user.company || 'OGTL'
      });
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      localStorage.removeItem('authToken'); // Ensure token is removed on failure
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Update profile function using the new API client
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use the api.put method for profile updates
      const data = await api.put<{ user: User }>('auth/profile', updates);
      setUser(prev => (prev ? { ...prev, ...data.user } : null));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password function using the new API client
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Use the api.post method for changing password
      await api.post('auth/change-password', { currentPassword, newPassword });
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Token persistence - check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Use the api.get method to fetch user profile
      api.get<{ user: User }>('auth/profile')
        .then(data => {
          if (data.user) {
            setUser({
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              name: data.user.name,
              company: data.user.company || 'OGTL'
            });
          } else {
            localStorage.removeItem('authToken');
          }
        })
        .catch(error => {
          console.error('Failed to fetch user profile on app load:', error);
          localStorage.removeItem('authToken');
        });
    }
  }, []); // Run once on component mount

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};