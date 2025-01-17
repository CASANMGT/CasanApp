import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setUp();
  }, []);

  const setUp = () => {
    setTimeout(() => {
      navigate("home", { replace: true });
      // navigate("login", { replace: true });
    }, 1500);
  };

  return (
    <div className="background-1 justify-center items-center flex font-bold">Splash</div>
  );
};

export default Splash;
