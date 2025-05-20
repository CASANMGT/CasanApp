import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Header,
  LoadingPage,
  WithdrawHistoryItem
} from "../components";
import { fetchWithdrawList } from "../features";
import { AppDispatch, RootState } from "../store";

const WithdrawalHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const withdrawList = useSelector((state: RootState) => state.withdrawList);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(fetchWithdrawList({ page: 1, limit: 10 }));
  };

  const isShowData: boolean =
    withdrawList?.data?.data && withdrawList?.data?.data.length ? true : false;

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat Penarikan Saldo" onDismiss={() => navigate(-1)} />

      <LoadingPage loading={withdrawList?.loading}>
        {/* TITLE */}
        <div className="px-4 py-6">
          <p className="text-base font-medium">Riwayat Penarikan Saldo</p>
          <p className="text-xs text-black100/70">
            Riwayat penarikan saldo anda
          </p>
        </div>

        {/* LIST */}
        <div className="overflow-auto scrollbar-none">
          {isShowData &&
            withdrawList?.data?.data.map((item, index: number) => (
              <WithdrawHistoryItem
                key={index}
                data={item}
                onClick={() => {
                  navigate("details", {
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
