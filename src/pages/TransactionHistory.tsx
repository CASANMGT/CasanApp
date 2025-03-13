import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { bodyListProps, DataTransaction } from "../common";
import { Header, LoadingPage, TransactionHistoryItem } from "../components";
import { fetchTransactionList } from "../features";
import { AppDispatch, RootState } from "../store";

const dataDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const TransactionHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  const transactionList = useSelector(
    (state: RootState) => state.transactionList
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const body: bodyListProps = {
      page: 1,
      limit: 10,
    };

    dispatch(fetchTransactionList(body));
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const onDetails = (select: DataTransaction) => {
    const type: string = select?.Transaction?.Type === 2 ? "session" : "top-up";

    navigate(`/transaction-history-details/${type}/${select?.Session?.ID}`);
  };

  const isShowData =
    transactionList?.data?.data && transactionList?.data?.data.length
      ? true
      : false;

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Riwayat" onDismiss={onDismiss} />

      <LoadingPage loading={transactionList?.loading}>
        {/* TITLE */}
        <div className="px-4 py-6">
          <p className="text-base font-medium">Riwayat Transaksi</p>
          <p className="text-xs text-black100/70">Transaksi terbaru anda</p>
        </div>

        {/* LIST */}
        <div className="overflow-auto scrollbar-none">
          {isShowData &&
            transactionList?.data?.data.map((item, index: number) => (
              <TransactionHistoryItem
                key={index}
                data={item}
                onClick={() => onDetails(item)}
              />
            ))}
        </div>
      </LoadingPage>
    </div>
  );
};

export default TransactionHistory;
