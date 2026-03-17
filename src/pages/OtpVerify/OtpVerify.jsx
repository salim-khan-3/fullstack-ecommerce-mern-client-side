// pages/OtpVerify/OtpVerify.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../Components/layouts/Logo/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp, resendOtp } from "../../utils/api/userApi";

const OtpVerify = () => {
  const { setIsShowHeaderFooter } = useContext(MyContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    setIsShowHeaderFooter(false);
    return () => setIsShowHeaderFooter(true);
  }, [setIsShowHeaderFooter]);

  // যদি email না থাকে, signup এ পাঠাও
  useEffect(() => {
    if (!email) navigate("/signup");
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // OTP input handler — auto focus next
  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace handler
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste handler
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(email, otpStr);
      toast.success("Email verified! Please login.");
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp(email);
      toast.success("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to resend OTP";
      toast.error(msg);
    } finally {
      setResendLoading(false);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#4c3585] text-center mb-2">Verify Your Email</h2>
        <p className="text-gray-500 text-sm text-center mb-1">
          We've sent a 6-digit OTP to
        </p>
        <p className="text-[#4c3585] font-semibold text-center text-sm mb-8 truncate px-4">
          {email}
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
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
              className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all
                ${digit ? "border-[#5c449b] bg-[#f3f0ff] text-[#4c3585]" : "border-gray-300 text-gray-700"}
                focus:border-[#5c449b] focus:bg-[#f3f0ff]`}
              style={{ height: "52px" }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full bg-[#5c449b] hover:bg-[#4c3585] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95 mb-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-[#5c449b] font-semibold text-sm hover:underline disabled:opacity-50"
            >
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

        <p className="text-center text-xs text-gray-400 mt-6">
          Wrong email?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#5c449b] font-semibold cursor-pointer hover:underline"
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;