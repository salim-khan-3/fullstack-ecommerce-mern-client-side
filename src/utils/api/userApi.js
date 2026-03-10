import axiosInstance from "./axiosInstance";

export const signupUser = async (name, email, phone, password) => {
  const res = await axiosInstance.post("/user/signup", { name, email, phone, password });
  return res.data;
};

export const signinUser = async (email, password) => {
  const res = await axiosInstance.post("/user/signin", { email, password });
  return res.data;
};