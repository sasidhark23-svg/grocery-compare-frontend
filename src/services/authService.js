import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password, role = 'ROLE_USER') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (name) => {
    const response = await api.put('/users/me', { name });
    return response.data;
  },
};
