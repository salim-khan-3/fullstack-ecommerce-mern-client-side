// pages/ForgotPassword/ForgotPassword.jsx
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../Components/layouts/Logo/Logo";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { forgotPassword } from "../../utils/api/userApi";

const ForgotPassword = () => {
  const { setIsShowHeaderFooter } = useContext(MyContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    setIsShowHeaderFooter(false);
    return () => setIsShowHeaderFooter(true);
  }, [setIsShowHeaderFooter]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      toast.success("OTP sent to your email!");
      navigate("/reset-password", { state: { email: data.email } });
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#4c3585] via-[#5c449b] to-[#7a5cc7] p-4 relative overflow-hidden">
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>

      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 md:p-12 z-10">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#f3f0ff] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#5c449b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#4c3585] text-center mb-2">Forgot Password?</h2>
        <p className="text-gray-500 text-sm text-center mb-8">
          Enter your registered email. We'll send you an OTP to reset your password.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
              <input
                type="email"
                id="email"
                className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                })}
              />
              <label htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm">
                Email Address <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#5c449b] hover:bg-[#4c3585] disabled:opacity-60 text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95">
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}
            className="text-[#5c449b] font-bold cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;