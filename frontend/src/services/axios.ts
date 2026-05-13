import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Pre-configured Axios instance for API requests.
 * Automatically sends cookies and handles auth errors globally.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 401) {
      // Don't toast on /me endpoint (initial auth check)
      if (!error.config.url?.includes('/auth/me')) {
        toast.error('Session expired. Please login again.');
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
