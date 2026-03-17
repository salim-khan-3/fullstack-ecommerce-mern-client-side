// pages/ResetPassword/ResetPassword.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../Components/layouts/Logo/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword, forgotPassword } from "../../utils/api/userApi";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const { setIsShowHeaderFooter } = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    setIsShowHeaderFooter(false);
    return () => setIsShowHeaderFooter(true);
  }, [setIsShowHeaderFooter]);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await forgotPassword(email);
      toast.success("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async () => {
    const otpStr = otp.join("");

    if (otpStr.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otpStr, newPassword);
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
          <div className="w-16 h-16 bg-[#fff3f0] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#dc2626]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#4c3585] text-center mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm text-center mb-1">OTP sent to</p>
        <p className="text-[#4c3585] font-semibold text-center text-sm mb-6 truncate px-4">{email}</p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all
                ${digit ? "border-[#dc2626] bg-[#fff3f0] text-[#dc2626]" : "border-gray-300 text-gray-700"}
                focus:border-[#dc2626] focus:bg-[#fff3f0]`}
              style={{ height: "52px" }}
            />
          ))}
        </div>

        {/* Resend Timer */}
        <div className="text-center mb-6">
          {canResend ? (
            <button onClick={handleResend} disabled={resendLoading}
              className="text-[#5c449b] font-semibold text-sm hover:underline disabled:opacity-50">
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Resend OTP in{" "}
              <span className="text-[#5c449b] font-semibold">
                {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
              </span>
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-6 mb-8">
          <div>
            <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
              <input
                type={showPassword ? "text" : "password"}
                className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent pr-8"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm">
                New Password <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
              <input
                type={showConfirm ? "text" : "password"}
                className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent pr-8"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password match indicator */}
            {confirmPassword && (
              <p className={`text-xs mt-1 ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`}>
                {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-[#5c449b] hover:bg-[#4c3585] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95">
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Remember your password?{" "}
          <span onClick={() => navigate("/login")}
            className="text-[#5c449b] font-semibold cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;