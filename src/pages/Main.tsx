import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Location,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { MenuBottomNavigationProps } from "../common";
import {
  BottomNavigation,
  InputOTPModal,
  InputPhoneNumberModal,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { AppDispatch, RootState } from "../store";
import { useSelector } from "react-redux";
import { resetDataLogin } from "../features";

const Main = () => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const { isAuthenticated, logout, login } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const dataLogin = useSelector((state: RootState) => state.login);

  const [currentPage, setCurrentPage] = useState<string>("");
  const [openInputPhoneNumber, setOpenInputPhoneNumber] =
    useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [openInputOTP, setOpenInputOTP] = useState<boolean>(false);

  useEffect(() => {
    validationPage();
  }, [location]);

  useEffect(() => {
    if (dataLogin?.data) {
      login();
      setOpenInputOTP(false);
      dispatch(resetDataLogin());
      navigate("/home", { replace: true });
    }
  }, [dataLogin?.data]);

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

  const onClick = (select: MenuBottomNavigationProps) => {
    if (
      !isAuthenticated &&
      (select?.page === "order" || select?.page === "profile")
    ) {
      setOpenInputPhoneNumber(true);
    } else {
      setCurrentPage(select?.page);
      navigate(`/home/${select?.page}`);
    }
  };

  return (
    <div className="background-2 flex flex-col justify-between overflow-hidden">
      <div className="flex overflow-hidden">
        <Outlet />
      </div>

      <BottomNavigation page={currentPage} onClick={onClick} />

      <InputPhoneNumberModal
        open={openInputPhoneNumber}
        value={phoneNumber}
        onDismiss={() => setOpenInputPhoneNumber(false)}
        onChange={(value) => setPhoneNumber(value)}
        onClick={() => {
          setOpenInputPhoneNumber(false);
          setOpenInputOTP(true);
        }}
      />

      <InputOTPModal
        open={openInputOTP}
        phoneNumber={`0${phoneNumber}`}
        onDismiss={() => setOpenInputOTP(false)}
      />
    </div>
  );
};

export default Main;
