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



export const getPopularProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/popular');
    return response.data.products || [];
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};



// ==========================
// GET PRODUCTS (search + filter + pagination)
// ==========================
// params: { search, category, subCat, brand, page, limit }
export const getProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams();
 
    if (params.search)   query.set("search",   params.search);
    if (params.category) query.set("category", params.category);
    if (params.subCat)   query.set("subCat",   params.subCat);
    if (params.brand)    query.set("brand",    params.brand);
    if (params.page)     query.set("page",     params.page);
    if (params.limit)    query.set("limit",    params.limit);
 
    const response = await axiosInstance.get(`/products?${query.toString()}`);
    return response.data; // { products, totalPages, currentPage, totalItems }
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};