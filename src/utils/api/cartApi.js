import axiosInstance from "./axiosInstance";

// ==========================
// GET CART
// ==========================
export const getCart = async (token) => {
  const res = await axiosInstance.get("/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// ADD TO CART
// ==========================
export const addToCartApi = async (cartData, token) => {
  const res = await axiosInstance.post("/cart/add", cartData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const clearCartApi = async (token) => {
  const res = await axiosInstance.delete("/cart/clear-cart/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
// ==========================
// REMOVE FROM CART
// ==========================
export const removeFromCartApi = async (cartItemId, token) => {
  const res = await axiosInstance.delete(`/cart/${cartItemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// UPDATE CART ITEM
// ==========================
export const updateCartApi = async (cartItemId, data, token) => {
  const res = await axiosInstance.put(`/cart/${cartItemId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};