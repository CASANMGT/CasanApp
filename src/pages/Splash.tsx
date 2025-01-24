import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ILFlashLogo, ILLogo } from "../assets";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setUp();
  }, []);

  const setUp = () => {
    setTimeout(() => {
      navigate("/coming-soon", { replace: true });
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
