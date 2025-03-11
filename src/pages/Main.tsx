import { useEffect, useState } from "react";
import {
  Location,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BottomNavigation } from "../components";

const Main = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const [currentPage, setCurrentPage] = useState<string>("");

  useEffect(() => {
    validationPage();
  }, [location]);

  const validationPage = () => {
    const currentPath: string = location?.pathname.replace("/home", "");

    switch (currentPath) {
      case "":
      case "/":
        setCurrentPage("index");
        navigate("/home/index", { replace: true });
        break;

      case "/index":
      case "/location":
      case "/order":
      case "/profile":
        setCurrentPage(currentPath.replace("/", ""));
        break;

      default:
        break;
    }

    if (currentPath === "" || currentPath === "/") {
      setCurrentPage("index");
      navigate("/home/index", { replace: true });
    }
  };

  return (
    <div className="background-2 flex flex-col justify-between overflow-hidden">
      <div className="flex overflow-hidden">
        <Outlet />
      </div>

      <BottomNavigation
        page={currentPage}
        onClick={(select: string) => setCurrentPage(select)}
      />
    </div>
  );
};

export default Main;
