import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { signinUser, signupUser } from "../utils/api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const isLoggedIn = !!token;

  const signin = async (email, password) => {
    const data = await signinUser(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, phone, password) => {
    const data = await signupUser(name, email, phone, password);
    return data;
  };

  // ==========================
  // LOGOUT (callback pattern)
  // অন্য context এর reset functions
  // callbacks হিসেবে receive করে call করে
  // ==========================
  const logout = (callbacks = {}) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    callbacks.resetCart?.();
    callbacks.resetMyList?.();
    toast.success("Logged out successfully");
  };
  const loginWithGoogle = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };
  // ==========================
  // UPDATE USER
  // ==========================
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, signin, signup, logout, updateUser, loginWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);














// import { createContext, useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { signinUser, signupUser } from "../utils/api/userApi";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(
//     localStorage.getItem("token") || null
//   );

//   const isLoggedIn = !!token;

//   const signin = async (email, password) => {
//     const data = await signinUser(email, password);
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));
//     setToken(data.token);
//     setUser(data.user);
//     return data;
//   };

//   const signup = async (name, email, phone, password) => {
//     const data = await signupUser(name, email, phone, password);
//     return data;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     setUser(null);
//     toast.success("Logged out successfully");
//   };

//   // profile update হলে user state sync করবে
//   const updateUser = (updatedUser) => {
//     const merged = { ...user, ...updatedUser };
//     localStorage.setItem("user", JSON.stringify(merged));
//     setUser(merged);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isLoggedIn, signin, signup, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

















// import { createContext, useContext, useState } from "react";
// import toast from "react-hot-toast";
// import { signinUser, signupUser } from "../utils/api/userApi";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );
//   const [token, setToken] = useState(
//     localStorage.getItem("token") || null
//   );

//   const isLoggedIn = !!token;

//   const signin = async (email, password) => {
//     const data = await signinUser(email, password);
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("user", JSON.stringify(data.user));
//     setToken(data.token);
//     setUser(data.user);
//     return data;
//   };

//   const signup = async (name, email, phone, password) => {
//     const data = await signupUser(name, email, phone, password);
//     return data;
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setToken(null);
//     setUser(null);
//     toast.success("Logged out successfully");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isLoggedIn, signin, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);