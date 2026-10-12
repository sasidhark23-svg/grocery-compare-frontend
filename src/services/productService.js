import api from './api';

export const productService = {
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (params) => {
    // Supports both simple query or object with page/size/category/brand
    if (typeof params === 'string') {
      const response = await api.get(`/products/search`, { params: { name: params } });
      return response.data;
    }
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
