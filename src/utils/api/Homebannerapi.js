import axiosInstance from "./axiosInstance";

// ================================
// PUBLIC — frontend use করবে
// ================================

// GET ALL BANNERS
export const getAllBannersApi = async () => {
  const res = await axiosInstance.get("/banners");
  return res.data;
};

// ================================
// ADMIN — dashboard use করবে
// ================================

// CREATE BANNER
export const createBannerApi = async (formData, token) => {
  const res = await axiosInstance.post("/banners/create", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// UPDATE BANNER
export const updateBannerApi = async (id, formData, token) => {
  const res = await axiosInstance.put(`/banners/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// DELETE BANNER
export const deleteBannerApi = async (id, token) => {
  const res = await axiosInstance.delete(`/banners/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};