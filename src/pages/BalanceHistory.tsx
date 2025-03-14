import { useDispatch } from "react-redux";
import { Header, LoadingPage } from "../components";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";

const BalanceHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat Saldo" onDismiss={onDismiss} />

      <LoadingPage loading={false}>
        {/* TITLE */}
        <div className="px-4 py-6">
          <p className="text-base font-medium">Riwayat Saldo</p>
          <p className="text-xs text-black100/70">Riwayat saldo terbaru anda</p>
        </div>
      </LoadingPage>
    </div>
  );
};

export default BalanceHistory;
