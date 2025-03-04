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

dayjs.extend(relativeTime);
dayjs.locale("id");

function App() {
  const { loading } = useSelector((state: RootState) => state.global);

  return (
      <div className="relative">
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
      </div>
  );
}

export default App;
