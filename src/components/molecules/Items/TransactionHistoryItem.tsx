import { IcFuel, IcMoneyReceive, IcMoneySend } from "../../../assets";
import { Balance, DataTransaction } from "../../../common";
import { moments, rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface TransactionHistoryItemProps {
  data: any;
  onClick: () => void;
}

const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  data,
  onClick,
}) => {
  const cloneData: DataTransaction = data;
  const dataBalance: Balance = data;
  const isTransaction = cloneData?.Transaction?.ID ? true : false;

  const details: { condition: string; color: string; label: string } =
    getDetailsByStatus(
      isTransaction ? cloneData?.Transaction?.Status : dataBalance?.Status,
      isTransaction ? cloneData?.Transaction?.Type : undefined
    );

  return (
    <div className="mx-4">
      <div onClick={onClick} className="between-x cursor-pointer">
        <div className="row gap-2">
          <div
            className={`w-9 h-9 center rounded-full bg-${
              dataBalance?.Status === 3 || dataBalance?.Status === 4
                ? "lightRed"
                : "primary10"
            }`}
          >
            {dataBalance?.Status === 1 || dataBalance?.Status === 2 ? (
              <IcMoneyReceive />
            ) : dataBalance?.Status === 3 || dataBalance?.Status === 4 ? (
              <IcMoneySend />
            ) : (
              <IcFuel className="text-primary100" />
            )}
          </div>

          <div>
            <p className="font-medium">
              {details.label}

              {isTransaction && (
                <span className={`text-[10px] ml-1 text-${details.color}`}>
                  {details.condition}
                </span>
              )}
            </p>

            <div className="row gap-1">
              <p className="text-xs text-black100/70">
                {moments(
                  cloneData?.Session?.StartChargingTime ||
                    cloneData?.Transaction?.CreatedAt ||
                    dataBalance?.CreatedAt
                ).format("DD MMM YYYY HH:mm")}
              </p>
              {isTransaction && cloneData?.Transaction?.Type !== 1 && (
                <>
                  {" "}
                  <p className="text-xs text-black100/40">at</p>
                  <p className="text-xs">
                    {cloneData?.Session?.ChargingStation?.Name || "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-blackBold font-semibold">{`${
          cloneData?.Transaction?.DueAmount > 0 ||
          Math.abs(dataBalance?.Amount) > 0
            ? isTransaction
              ? ""
              : dataBalance?.Status === 1 || dataBalance?.Status === 2
              ? "+"
              : "-"
            : ""
        }Rp${rupiah(
          cloneData?.Transaction?.DueAmount || Math.abs(dataBalance?.Amount)
        )}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default TransactionHistoryItem;

const getDetailsByStatus = (status: number, type?: number) => {
  let condition: string;
  let color: string;
  let label: string;

  switch (status) {
    case 1:
      condition = "Selesai";
      color = "green";
      label = "Top-Up";
      break;

    case 2:
      condition = "Belum Bayar";
      color = "red";
      label = "Refund Sesi";
      break;

    case 3:
      condition = "Expired";
      color = "black50";
      label = "Bayar Sesi";
      break;

    case 4:
      condition = "Expired";
      color = "red";
      label = "Penarikan Saldo";
      break;

    default:
      condition = "";
      color = "";
      label = "";
      break;
  }

  if (type) {
    if (type === 1) label = "Top-Up";
    else if (type === 2) label = "Session";
  }

  return { condition, color, label };
};
