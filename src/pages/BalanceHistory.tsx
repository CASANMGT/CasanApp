import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bodyListProps } from "../common";
import { Header, LoadingPage, TransactionHistoryItem } from "../components";
import { fetchBalanceList } from "../features";
import { AppDispatch, RootState } from "../store";

const BalanceHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const balanceList = useSelector((state: RootState) => state.balanceList);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const body: bodyListProps = {
      page: 1,
      limit: 10,
    };

    dispatch(fetchBalanceList(body));
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const isShowData =
    balanceList?.data?.data && balanceList?.data?.data.length ? true : false;

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat Saldo" onDismiss={onDismiss} />

      <LoadingPage loading={balanceList?.loading}>
        {/* TITLE */}
        <div className="px-4 py-6">
          <p className="text-base font-medium">Riwayat Saldo</p>
          <p className="text-xs text-black100/70">Riwayat saldo terbaru anda</p>
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

export default BalanceHistory;
