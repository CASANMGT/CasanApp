import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ILFlashLogo, ILLogo } from "../assets";
import { PRODUCTION } from "../common";
import { useAuth } from "../context/AuthContext";
const cluster = import.meta.env.VITE_CLUSTER;

const Splash = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUp();
  }, []);

  const setUp = () => {
    setTimeout(() => {
      let nextPage: string;
      if (cluster === PRODUCTION) nextPage = "/coming-soon";
      else if (isAuthenticated) nextPage = "/home";
      else nextPage = "/login";

      navigate(nextPage, { replace: true });
    }, 2000);
  };

  return (
    <div className="container-screen !bg-primary100 center relative">
      <div className="center">
        <img src={ILLogo} alt="logo" className="w-[293px] h-[52.7px]" />

        <img
          src={ILFlashLogo}
          alt="logo"
          className="w-[76.83px] h-[104.57px] absolute transition-transform transform animate-slideDown"
        />
      </div>
    </div>
  );
};

export default Splash;
