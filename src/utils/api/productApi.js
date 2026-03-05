import axiosInstance from "./axiosInstance";

export const getFeaturedProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/featured');
    return response.data.products;
  } catch (error) {
    throw error.response ? error.response.data : new Error(error.message);
  }
};