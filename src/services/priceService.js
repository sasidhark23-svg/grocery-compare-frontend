import api from './api';

export const priceService = {
  getAllPrices: async () => {
    const response = await api.get('/prices');
    return response.data;
  },

  addPrice: async (productId, storeId, price, discount = 0, stockStatus = 'IN_STOCK') => {
    const response = await api.post('/prices', null, {
      params: { productId, storeId, price, discount, stockStatus }
    });
    return response.data;
  },

  getCheapestPrice: async (productId) => {
    const response = await api.get(`/prices/cheapest/${productId}`);
    return response.data;
  },

  comparePrices: async (productId) => {
    const response = await api.get(`/prices/compare/${productId}`);
    return response.data;
  },

  getSummary: async (productId) => {
    const response = await api.get(`/prices/summary/${productId}`);
    return response.data;
  },

  getHistory: async (productId, storeId = null) => {
    const response = await api.get(`/prices/history/${productId}`, {
      params: storeId ? { storeId } : {}
    });
    return response.data;
  },
};
