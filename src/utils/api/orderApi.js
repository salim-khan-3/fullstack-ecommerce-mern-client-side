import axiosInstance from "./axiosInstance";

// ==========================
// PLACE ORDER
// ==========================
export const placeOrderApi = async (orderData, token) => {
  const res = await axiosInstance.post("/orders/place", orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// GET MY ORDERS
// ==========================
export const getMyOrdersApi = async (token) => {
  const res = await axiosInstance.get("/orders/my-orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// GET SINGLE ORDER
// ==========================
export const getOrderByIdApi = async (orderId, token) => {
  const res = await axiosInstance.get(`/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// CANCEL ORDER
// ==========================
export const cancelOrderApi = async (orderId, token) => {
  const res = await axiosInstance.put(`/orders/${orderId}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==========================
// INIT PAYMENT (SSLCommerz)
// ==========================
export const initPaymentApi = async (orderId, token) => {
  const res = await axiosInstance.post(
    "/payment/init",
    { orderId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};