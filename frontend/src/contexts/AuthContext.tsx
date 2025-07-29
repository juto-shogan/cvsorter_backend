// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';

// Define the shape of your user object
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  // Add other user properties as needed
}

// Define the shape of your AuthContext values
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  API_BASE_URL: string; // <--- ADDED THIS LINE
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define your API base URL here. Use environment variables in a real app.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'; // Make sure this matches your backend

  // Function to save user and token to local storage
  const saveAuthData = useCallback((userData: User, userToken: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  }, []);

  // Function to clear user and token from local storage
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }, []);

  // Load user from local storage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        clearAuthData(); // Clear invalid data
      }
    }
  }, [clearAuthData]);


  const login = useCallback(async (email: any, password: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveAuthData(data.user, data.token);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err: any) {
      setError('Network error or server unavailable.');
      console.error('Login error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, saveAuthData]);

  const register = useCallback(async (username: any, email: any, password: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveAuthData(data.user, data.token);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err: any) {
      setError('Network error or server unavailable.');
      console.error('Registration error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, saveAuthData]);

  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);


  const contextValue = useMemo(() => ({
    user,
    token,
    isLoading,
    error,
    API_BASE_URL, // <--- ADDED THIS TO THE CONTEXT VALUE
    login,
    logout,
    register,
  }), [user, token, isLoading, error, API_BASE_URL, login, logout, register]);


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};