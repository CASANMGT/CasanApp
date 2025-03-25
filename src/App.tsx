import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { LoadingModal } from "./components";
import RoutesPage from "./routes";
import { RootState } from "./store";
import { AuthProvider } from "./context/AuthContext";
import PopupAlert from "./components/atoms/PopupAlert";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("id");

function App() {
  const { loading } = useSelector((state: RootState) => state.global);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="relative bg-white dark:bg-[#22303C] text-black100 dark:text-white">
      <BrowserRouter>
        <RoutesPage />
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />

      {loading && <LoadingModal />}

      <PopupAlert />
    </div>
  );
}

export default App;
