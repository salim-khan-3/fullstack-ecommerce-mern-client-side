import { useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/api/axiosInstance";

const GOOGLE_CLIENT_ID = "698536624546-0m6nnvgtabnlihdvfkrc3pq4pbf37cpe.apps.googleusercontent.com";

const GoogleLoginButton = ({ onSuccess }) => {
  const { signin } = useAuth();
  const navigate   = useNavigate();
  const btnRef     = useRef();

  useEffect(() => {
    // Google Identity Services script load করো
    const script = document.createElement("script");
    script.src   = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initGoogle = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback:  handleCredentialResponse,
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme:  "outline",
      size:   "large",
      width:  "100%",
      text:   "continue_with",
      shape:  "rectangular",
      logo_alignment: "left",
    });
  };

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axiosInstance.post("/user/google", {
        idToken: response.credential,
      });

      const { token, user } = res.data;

      // AuthContext এ save করো
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // AuthContext update
      if (onSuccess) {
        onSuccess(token, user);
      } else {
        // page reload করে context update করো
        window.location.href = "/";
      }

      toast.success(`Welcome, ${user.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div ref={btnRef} className="w-full" />
  );
};

export default GoogleLoginButton;