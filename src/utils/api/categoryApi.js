import axiosInstance from "./axiosInstance";

export const getAllCategoriesForUI = async () => {
  try {
    const response = await axiosInstance.get("/category?page=1&limit=1000");
    return response.data.categoryList || response.data || [];
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};