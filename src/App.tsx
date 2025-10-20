import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Flip, ToastContainer } from "react-toastify";
import { LoadingModal, MetaPixel } from "./components";
import PopupAlert from "./components/atoms/PopupAlert";
import RoutesPage from "./routes";
import { RootState } from "./store";
import { AuthProvider } from "./context/AuthContext";
const metaID = import.meta.env.VITE_META_ID;

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
    <div className="relative">
      {/* <div className="relative bg-white dark:bg-[#22303C] text-black100 dark:text-white"> */}

      <MetaPixel pixelId={metaID} />

      <BrowserRouter>
        <AuthProvider>
          <RoutesPage />
        </AuthProvider>
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
