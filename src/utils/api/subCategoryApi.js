import axiosInstance from "./axiosInstance";

export const getAllSubCategories = async () => {
  try {
    const response = await axiosInstance.get("/subCategory");
    return response.data || [];
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};