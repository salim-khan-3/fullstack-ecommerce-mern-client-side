import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../Components/layouts/Logo/Logo";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginButton from "../../Components/Shared/GoogleLoginButton/GoogleLoginButton";
const Login = () => {
  const { setIsShowHeaderFooter } = useContext(MyContext);
  const { signin,loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setIsShowHeaderFooter(false);
    return () => setIsShowHeaderFooter(true);
  }, [setIsShowHeaderFooter]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signin(data.email, data.password);
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#5c449b] bg-gradient-to-br from-[#4c3585] via-[#5c449b] to-[#7a5cc7] p-4 relative overflow-hidden">
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>

      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 md:p-12 z-10">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-8">
          <h2 className="text-2xl font-bold text-[#4c3585]">Sign In</h2>
          <Link
            to="/signup"
            className="text-2xl font-bold text-gray-300 hover:text-[#4c3585] transition-colors"
          >
            Sign Up
          </Link>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
              <input
                type="email"
                id="email"
                className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm"
              >
                Email <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent pr-8"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0 peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right -mt-4">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-[#5c449b] text-sm font-semibold hover:underline cursor-pointer"
            >
              Forgot password?
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer bg-[#5c449b] hover:bg-[#4c3585] disabled:opacity-60 text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <button
              type="button"
              className="flex-1 border cursor-pointer border-gray-300 text-gray-600 font-bold py-3 rounded-md hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Not Registered?{" "}
          <Link
            to="/signup"
            className="text-[#5c449b] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <div className="mt-10 text-center">
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <p className="mx-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
              Or continue with
            </p>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <GoogleLoginButton
            onSuccess={(token, user) => {
              loginWithGoogle(token, user);
              navigate("/");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useContext, useEffect } from "react";
// import { MyContext } from "../../App";
// import Logo from "../../Components/layouts/Logo/Logo";
// import { Link } from "react-router-dom";

// const Login = () => {
//   // const { setIsShowHeaderFooter } = useContext(MyContext);

//  const { setIsShowHeaderFooter } = useContext(MyContext);
// useEffect(() => {
//   setIsShowHeaderFooter(false);        // বড় হাতি 'I'
//   return () => setIsShowHeaderFooter(true);
// }, [setIsShowHeaderFooter]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#5c449b] bg-gradient-to-br from-[#4c3585] via-[#5c449b] to-[#7a5cc7] p-4 relative overflow-hidden">

//       {/* Background Shapes for Professional Look */}
//       <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
//       <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>

//       {/* Login Card */}
//       <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8 md:p-12 z-10">

//         {/* Logo Section */}
//         <div className="flex justify-center mb-6">
//           <Logo />
//         </div>

//         <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-8">
//           <h2 className="text-2xl font-bold text-[#4c3585] cursor-pointer">Sign In</h2>
//           <h2 className="text-2xl font-bold text-gray-300 hover:text-[#4c3585] transition-colors cursor-pointer">Sign Up</h2>
//         </div>

//         <form className="space-y-8">
//           {/* Email Input */}
//           <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
//             <input
//               type="email"
//               id="email"
//               className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent"
//               placeholder="Email"
//               required
//             />
//             <label
//               htmlFor="email"
//               className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all
//               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0
//               peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm"
//             >
//               Email <span className="text-red-500">*</span>
//             </label>
//           </div>

//           {/* Password Input */}
//           <div className="relative border-b border-gray-300 focus-within:border-[#5c449b] transition-all">
//             <input
//               type="password"
//               id="password"
//               className="peer w-full pb-2 outline-none text-gray-700 bg-transparent placeholder-transparent"
//               placeholder="Password"
//               required
//             />
//             <label
//               htmlFor="password"
//               className="absolute left-0 -top-3.5 text-gray-400 text-sm transition-all
//               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-0
//               peer-focus:-top-3.5 peer-focus:text-[#5c449b] peer-focus:text-sm"
//             >
//               Password <span className="text-red-500">*</span>
//             </label>
//           </div>

//           {/* Forgot Password */}
//           <div className="text-right">
//             <a href="#" className="text-[#5c449b] text-sm font-semibold hover:underline">
//               Forgot password?
//             </a>
//           </div>

//           {/* Sign In & Cancel Buttons */}
//           <div className="flex gap-4">
//             <button
//               type="submit"
//               className="flex-1 cursor-pointer bg-[#5c449b] hover:bg-[#4c3585] text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95"
//             >
//               Sign In
//             </button>

//             <button
//               type="button"
//               className="flex-1 border cursor-pointer border-gray-300 text-gray-600 font-bold py-3 rounded-md hover:bg-gray-50 transition-all active:scale-95"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>

//         {/* Not Registered */}
//         <p className="text-center text-sm text-gray-500 mt-6">
//           Not Registered?{" "}
//           <Link to={"/signup"} className="text-[#5c449b] font-bold hover:underline">
//             Sign Up
//           </Link>
//         </p>

//         {/* Social Login Divider */}
//         <div className="mt-10 text-center">
//           <div className="flex items-center my-6">
//             <div className="flex-1 border-t border-gray-300"></div>
//             <p className="mx-4 text-gray-500 text-xs font-medium uppercase tracking-wider">
//               Or continue with
//             </p>
//             <div className="flex-1 border-t border-gray-300"></div>
//           </div>

//           {/* Google Sign In Button */}
//           <button className="w-full flex cursor-pointer items-center justify-center gap-3 border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]">
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               className="w-5 h-5"
//               alt="Google"
//             />
//             <span className="text-gray-700 font-bold text-sm">
//               Sign In With Google
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
