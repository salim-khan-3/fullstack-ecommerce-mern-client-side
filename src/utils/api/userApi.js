import axiosInstance from "./axiosInstance";

export const signupUser = async (name, email, phone, password) => {
  const res = await axiosInstance.post("/user/signup", { name, email, phone, password });
  return res.data;
};

export const signinUser = async (email, password) => {
  const res = await axiosInstance.post("/user/signin", { email, password });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await axiosInstance.post(`/user/verify-otp`, { email, otp });
  return res.data;
};

export const resendOtp = async (email) => {
  const res = await axiosInstance.post(`/user/resend-otp`, { email });
  return res.data;
};