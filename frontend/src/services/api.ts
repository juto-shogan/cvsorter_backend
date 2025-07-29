// src/services/api.ts

// Define the base URL for your backend API.
// It's good practice to use an environment variable for this.
// For development, it's typically 'http://localhost:5000'.
// When deploying, you would change this to your production backend URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * A centralized API client for making authenticated requests to the backend.
 * It automatically includes the authentication token from localStorage.
 */
const api = {
  /**
   * Makes a GET request to the specified endpoint.
   * @param endpoint The API endpoint (e.g., 'auth/profile', 'cvs').
   * @returns A Promise that resolves to the JSON response from the API.
   * @throws An error if the network request fails or the response is not OK.
   */
  get: async <T>(endpoint: string, p0: { responseType: string; }): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
  },

  /**
   * Makes a POST request to the specified endpoint.
   * @param endpoint The API endpoint (e.g., 'auth/login', 'cvs').
   * @param data The data to send in the request body.
   * @returns A Promise that resolves to the JSON response from the API.
   * @throws An error if the network request fails or the response is not OK.
   */
  post: async <T>(endpoint: string, data?: any, p0?: { onUploadProgress: (progressEvent: any) => void; }): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
  },

  /**
   * Makes a PUT request to the specified endpoint.
   * @param endpoint The API endpoint (e.g., 'cvs/{id}').
   * @param data The data to send in the request body.
   * @returns A Promise that resolves to the JSON response from the API.
   * @throws An error if the network request fails or the response is not OK.
   */
  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
  },

  /**
   * Makes a DELETE request to the specified endpoint.
   * @param endpoint The API endpoint (e.g., 'cvs/{id}').
   * @returns A Promise that resolves to the JSON response from the API.
   * @throws An error if the network request fails or the response is not OK.
   */
  delete: async <T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {}; // No Content-Type for DELETE unless sending body
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    // DELETE requests might not always return a body, so handle accordingly
    return response.json().catch(() => ({} as T)); // Return empty object if no JSON
  },

  /**
   * Makes a file upload (POST) request.
   * Specifically for handling multipart/form-data for file uploads.
   * @param endpoint The API endpoint (e.g., 'upload').
   * @param formData The FormData object containing the file(s).
   * @returns A Promise that resolves to the JSON response from the API.
   * @throws An error if the network request fails or the response is not OK.
   */
  uploadFile: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {}; // Do NOT set Content-Type for FormData, browser sets it correctly
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Something went wrong' }));
      throw new Error(errorData.message || 'Network response was not ok');
    }
    return response.json();
  },

  /**
   * Handles downloading a file from a GET endpoint.
   * @param endpoint The API endpoint (e.g., 'cvs/{id}/download').
   * @returns A Promise that resolves to a Blob representing the file content.
   * @throws An error if the network request fails or the response is not OK.
   */
  downloadFile: async (endpoint: string): Promise<Blob> => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error('File download failed');
    }
    return response.blob();
  },
};

export default api;