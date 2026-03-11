import axiosInstance from "./axiosInstance";

// ==========================
// GET REVIEWS BY PRODUCT ID
// ==========================
export const getReviewsByProduct = async (productId) => {
  const res = await axiosInstance.get(`/reviews?productId=${productId}`);
  return res.data;
};

// ==========================
// GET REVIEW BY ID
// ==========================
export const getReviewById = async (reviewId) => {
  const res = await axiosInstance.get(`/reviews/${reviewId}`);
  return res.data;
};

// ==========================
// GET TOTAL REVIEW COUNT
// ==========================
export const getReviewCount = async () => {
  const res = await axiosInstance.get("/reviews/get/count");
  return res.data;
};

// ==========================
// ADD REVIEW
// ==========================
export const addReview = async (reviewData) => {
  const res = await axiosInstance.post("/reviews/add", reviewData);
  return res.data;
};