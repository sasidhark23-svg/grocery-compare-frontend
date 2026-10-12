import api from './api';

export const alertService = {
  getUserAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },

  createAlert: async (productId, targetPrice) => {
    const response = await api.post('/alerts', { productId, targetPrice });
    return response.data;
  },

  updateAlert: async (id, targetPrice, active) => {
    const response = await api.put(`/alerts/${id}`, { targetPrice, active });
    return response.data;
  },

  deleteAlert: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};
