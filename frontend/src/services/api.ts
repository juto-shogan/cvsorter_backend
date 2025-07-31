// src/services/api.ts

import axios, { InternalAxiosRequestConfig } from 'axios';
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Your backend API base URL
  // No need to set Content-Type here; Axios handles it automatically for FormData.
});

// Request interceptor to add the authorization token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken'); // Get token from local storage

    // Direct assignment to config.headers.Authorization.
    // InternalAxiosRequestConfig ensures config.headers is always an AxiosHeaders object
    // (or compatible) where direct property setting works.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    // When sending FormData, Axios automatically sets 'Content-Type' to 'multipart/form-data'.
    // We explicitly remove any pre-existing 'Content-Type' header here to ensure Axios
    // correctly applies its automatic handling for FormData.
    // This is safer than relying on implicit behavior, especially if default headers were set elsewhere.
    if (config.data instanceof FormData) {
      // Use the 'delete' method provided by AxiosHeaders for robustness,
      // or direct property deletion if it's treated as a Record<string, any>.
      // For modern Axios and InternalAxiosRequestConfig, direct deletion works.
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the full Axios error response for debugging
    console.error('API call error details:', error.response || error); 
    
    // Check for 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access detected. Clearing token and redirecting to login.');
      localStorage.removeItem('authToken'); // Clear invalid token
      // Redirect to login page (adjust '/login' to your actual login route)
      window.location.href = '/login'; 
    }
    
    // Create a more informative error message for frontend
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage)); // Re-throw a custom error
  }
);

export default api;