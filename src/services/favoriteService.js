import api from './api';

export const favoriteService = {
  getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addFavoriteProduct: async (productId) => {
    const response = await api.post(`/favorites/products/${productId}`);
    return response.data;
  },

  removeFavoriteProduct: async (productId) => {
    const response = await api.delete(`/favorites/products/${productId}`);
    return response.data;
  },

  addFavoriteStore: async (storeId) => {
    const response = await api.post(`/favorites/stores/${storeId}`);
    return response.data;
  },

  removeFavoriteStore: async (storeId) => {
    const response = await api.delete(`/favorites/stores/${storeId}`);
    return response.data;
  },
};
