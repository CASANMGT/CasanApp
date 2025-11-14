import { moments } from "../../helpers";

interface Props {}

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

const History: React.FC<Props> = () => {
  return (
    <div className=" px-4 py-6">
      <div className="space-y-3">
        {transactions.map((tx, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 between-x"
          >
            {/* Left section */}
            <div>
              <p className="text-[10px] text-black100 mb-1">
                ID Transaksi {tx.id}
              </p>
              <p className="font-semibold text-base">
                {tx.type}{" "}
                <span
                  className={`${
                    tx.amount > 0 ? "text-green" : "text-red"
                  } font-semibold`}
                >
                  {tx.amount > 0 ? `+${tx.amount} Days` : `${tx.amount} Day`}
                </span>
              </p>
              <p className="text-xs text-black90 mt-1">
                {moments().format("D MMM YYYY HH:mm")}
              </p>
            </div>

            {/* Right section */}
            <div className="text-right">
              <p className="text-xs text-black90">
                {tx.type === "Top-up" ? "Balance Akhir" : "Balance After"}
              </p>
              <span className="text-black90 font-semibold">
                {tx.balance} Hari
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
