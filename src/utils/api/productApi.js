import axiosInstance from "./axiosInstance";

export const getFeaturedProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/featured');
    return response.data.products;
  } catch (error) {
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/products/category/${categoryId}`);
    return response.data.data || [];
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const getNewProducts = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`/products/new?limit=${limit}`);
    return response.data.products || [];
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};