import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header, LoadingPage, TransactionHistoryItem } from "../components";
import { AppDispatch, RootState } from "../store";

const WithdrawalHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const balanceList = useSelector((state: RootState) => state.balanceList);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {};

  const isShowData: boolean = false;

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat Penarikan Saldo" onDismiss={() => navigate(-1)} />

      <LoadingPage loading={false}>
        {/* TITLE */}
        <div className="px-4 py-6">
          <p className="text-base font-medium">Riwayat Penarikan Saldo</p>
          <p className="text-xs text-black100/70">Riwayat penarikan saldo anda</p>
        </div>

        {/* LIST */}
        <div className="overflow-auto scrollbar-none">
          {isShowData &&
            balanceList?.data?.data.map((item, index: number) => (
              <TransactionHistoryItem
                key={index}
                data={item}
                onClick={() => {
                  navigate("/balance-history-details", {
                    state: { data: item },
                  });
                }}
              />
            ))}
        </div>
      </LoadingPage>
    </div>
  );
};

export default WithdrawalHistory;
