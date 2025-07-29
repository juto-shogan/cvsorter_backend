import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

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

  // Login function with backend integration
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is ok and has content
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Safely parse JSON response
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

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
      // Handle network errors (backend not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Backend server is not running. Please start your Express.js server.');
      }
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with backend integration
  const signup = async (username: string, email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name }),
      });

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }

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
      // Handle network errors (backend not running)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Backend server is not running. Please start your Express.js server.');
      }
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function with backend integration
  const logout = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optional: Call backend to invalidate token
      fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(console.error);
    }
    
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(prev => prev ? { ...prev, ...data.user } : null);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

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
      fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then(response => response.json())
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
      .catch(() => {
        localStorage.removeItem('authToken');
      });
    }
  }, []);

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