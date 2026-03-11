import axiosInstance from "./axiosInstance";

// ==========================
// GET MY LIST
// ==========================
export const getMyList = async (token) => {
  const res = await axiosInstance.get("/myList", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// ADD TO MY LIST
// ==========================
export const addToMyListApi = async (itemData, token) => {
  const res = await axiosInstance.post("/myList/add", itemData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// REMOVE FROM MY LIST
// ==========================
export const removeFromMyListApi = async (itemId, token) => {
  const res = await axiosInstance.delete(`/myList/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};