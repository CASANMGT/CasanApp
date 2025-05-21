import { useEffect, useState } from "react";
import {
  Location,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { BottomNavigation, InputPhoneNumberModal } from "../components";
import { useAuth } from "../context/AuthContext";

const Main = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentPage, setCurrentPage] = useState<string>("");
  const [openInputPhoneNumber, setOpenInputPhoneNumber] =
    useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [openRequestOTP, setOpenRequestOTP] = useState<boolean>(false);
  const [openInputOTP, setOpenInputOTP] = useState<boolean>(false);

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

      <InputPhoneNumberModal
        open={openInputPhoneNumber}
        value={phoneNumber}
        onDismiss={() => setOpenInputPhoneNumber(false)}
        onChange={(value) => setPhoneNumber(value)}
        onClick={() => {
          setOpenInputPhoneNumber(false);
          setOpenRequestOTP(true);
        }}
      />
    </div>
  );
};

export default Main;
