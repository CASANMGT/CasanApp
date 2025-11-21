import { useEffect, useState } from "react";
import { ERROR_MESSAGE } from "../../common";
import { LoadingPage } from "../../components";
import { moments } from "../../helpers";
import { Api } from "../../services";

interface TransactionProps {
  id: string;
  type: "Top-up" | "Cicilan";
  amount: number; // positive or negative (days)
  balance: number;
  date: string;
}

const transactions: TransactionProps[] = [
  {
    id: "12343",
    type: "Top-up",
    amount: 5,
    balance: 9,
    date: "4 Aug 2025 12:00",
  },
  {
    id: "12343",
    type: "Cicilan",
    amount: -1,
    balance: 4,
    date: "4 Aug 2025 12:00",
  },
];

interface Props {
  data: RTOProps | undefined;
}

interface ResponseProps {
  status: string;
  message: string;
  data: CreditHistoryProps[];
  meta: MetaResponseProps;
}

const History: React.FC<Props> = ({ data }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dataCredit, setDataCredit] = useState<ResponseProps>();

  useEffect(() => {
    getData();
  }, [page, limit]);

  const getData = async (p?: number, l?: number, q?: string) => {
    try {
      setLoading(true);

      const res = await Api.get({
        url: `rtos/${data?.ID}/credit-histories`,
        params: { page: p || page, limit: l || limit, q },
      });

      setDataCredit(res);
    } catch (error) {
      alert(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const isShow = dataCredit?.data?.length ? true : false;

  console.log("cek 1", dataCredit?.data);

  return (
    <LoadingPage loading={loading}>
      <div className=" px-4 py-6">
        <div className="space-y-3">
          {isShow ? (
            dataCredit?.data.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 between-x"
              >
                {/* Left section */}
                <div>
                  <p className="text-[10px] text-black100 mb-1">
                    {item?.Type === 1
                      ? `ID Transaksi ${item?.TransactionID}`
                      : `Cicilan ${item?.Reference}`}
                  </p>
                  <p className="font-semibold text-base">
                    {item?.Type === 1 ? "Top-up" : "Cicilan"}
                    <span
                      className={`font-semibold text-${
                        item?.Type === 1 ? "green" : "red"
                      }`}
                    >
                      {` ${item?.Type === 1 ? "+" : "-"}${
                        item?.Change || 0
                      } Hari`}
                    </span>
                  </p>
                  <p className="text-xs text-black90 mt-1">
                    {moments(item?.CreatedAt).format("D MMM YYYY")}{" "}
                    <span className="text-xs text-black70">
                      {moments(item?.CreatedAt).format("HH:mm")}
                    </span>
                  </p>
                </div>

                {/* Right section */}
                <div className="text-right">
                  <p className="text-xs text-black90">Balance Akhir</p>
                  <span className="text-black90 font-semibold">
                    {item?.BalanceAfter} Hari
                  </span>
                </div>
              </div>
            ))
          ) : (
            <span>No Data</span>
          )}
        </div>
      </div>
    </LoadingPage>
  );
};

export default History;
