import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
// import { useAuth } from "../context/AuthContext";

const useRequireAuth = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const guardedNavigate = (path) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: path } });
      return;
    }
    navigate(path);
  };

  return guardedNavigate;
};

export default useRequireAuth;