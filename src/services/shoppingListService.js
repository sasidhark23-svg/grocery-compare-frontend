import api from './api';

export const shoppingListService = {
  getUserLists: async () => {
    const response = await api.get('/lists');
    return response.data;
  },

  getListById: async (id) => {
    const response = await api.get(`/lists/${id}`);
    return response.data;
  },

  createList: async (name) => {
    const response = await api.post('/lists', { name });
    return response.data;
  },

  deleteList: async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },

  addItem: async (listId, productId, quantity = 1) => {
    const response = await api.post(`/lists/${listId}/items`, { productId, quantity });
    return response.data;
  },

  removeItem: async (listId, itemId) => {
    const response = await api.delete(`/lists/${listId}/items/${itemId}`);
    return response.data;
  },

  compareList: async (listId) => {
    const response = await api.get(`/lists/${listId}/compare`);
    return response.data;
  },
};
