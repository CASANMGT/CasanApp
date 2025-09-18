import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Location,
  NavigateFunction,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BottomNavigation,
  InputOTPModal,
  InputPhoneNumberModal,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { resetDataLogin } from "../features";
import { AppDispatch, RootState } from "../store";

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
      let to = `/home/${select?.page}`;

      if (select?.page === "scan") to = `/${select?.page}`;

      navigate(to);
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
