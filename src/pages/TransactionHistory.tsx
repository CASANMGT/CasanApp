import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcMenuBlack } from "../assets";
import { Header, TransactionHistoryItem } from "../components";

const dataDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const TransactionHistory = () => {
  const navigate: NavigateFunction = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  const onMenu = () => {
    alert("coming soon");
  };

  const onDetails = () => {
    navigate("/transaction-history-details");
  };

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat" onDismiss={onDismiss} />

      {/* TITLE */}
      <div className="px-4 py-6 between">
        <div>
          <p className="text-base font-medium">Riwayat Transacksi</p>
          <p className="text-xs text-black100/70">Transaksi terbaru anda</p>
        </div>

        <div onClick={onMenu} className="w-10 h-10 center -mr-3 cursor-pointer">
          <IcMenuBlack />
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-auto scrollbar-none">
        {dataDummy.map((_, index: number) => (
          <TransactionHistoryItem key={index} onClick={onDetails} />
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
