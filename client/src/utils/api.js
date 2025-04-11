import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords)
};

// Sessions API calls
export const sessionsAPI = {
  getAll: () => api.get('/sessions'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (sessionData) => api.post('/sessions', sessionData),
  update: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  delete: (id) => api.delete(`/sessions/${id}`),
  book: (id) => api.post(`/sessions/${id}/book`),
  cancel: (id) => api.post(`/sessions/${id}/cancel`),
  complete: (id) => api.post(`/sessions/${id}/complete`)
};

// Reviews API calls
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  getBySession: (sessionId) => api.get(`/reviews/session/${sessionId}`),
  getByUser: (userId) => api.get(`/reviews/user/${userId}`)
};

// Wishlist API calls
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (tutorId) => api.post('/wishlist', { tutorId }),
  remove: (tutorId) => api.delete(`/wishlist/${tutorId}`),
  check: (tutorId) => api.get(`/wishlist/check/${tutorId}`)
};

// Tutors API calls
export const tutorsAPI = {
  getAll: () => api.get('/tutor'),
  getById: (id) => api.get(`/tutor/${id}`),
  search: (params) => api.get('/tutor/search', { params }),
  getReviews: (id) => api.get(`/tutor/${id}/reviews`),
  getSessions: (id) => api.get(`/tutor/${id}/sessions`)
};

// Students API calls
export const studentsAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getSessions: (id) => api.get(`/students/${id}/sessions`),
  getReviews: (id) => api.get(`/students/${id}/reviews`)
};

export default api; 