import api from './api';

export const storeService = {
  getAllStores: async () => {
    const response = await api.get('/stores');
    return response.data;
  },

  getStoreById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  addStore: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },

  updateStore: async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },

  deleteStore: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },
};
