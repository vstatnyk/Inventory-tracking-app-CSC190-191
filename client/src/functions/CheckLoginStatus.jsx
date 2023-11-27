import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CheckLoginStatus = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return true;
};
