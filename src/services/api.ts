import axios from 'axios';

// Create axios instance with base configuration
// In development, use empty baseURL to leverage Vite proxy
// In production, use full API URL
const api = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? ''
    : (import.meta.env.VITE_API_BASE_URL || 'https://zenfinity-intern-api-104290304048.europe-west1.run.app'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers or logging
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
