import { IcFuel, IcMoneyReceive, IcMoneySend } from "../../../assets";
import { DataTransaction } from "../../../common";
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
  const dataBalance = data;
  const isTransaction = cloneData?.Transaction?.ID ? true : false;

  const getLabelStatus = () => {
    let value: string;
    switch (cloneData?.Transaction?.Status) {
      case 2:
        value = "Belum Bayar";
        break;

      case 3:
        value = "Expired";
        break;

      case 1:
        value = "Selesai";
        break;

      default:
        value = "";
        break;
    }

    return value;
  };

  const getColorStatus = () => {
    let value: string;
    switch (cloneData?.Transaction?.Status) {
      case 2:
        value = "red";
        break;

      case 3:
        value = "black50";
        break;

      case 1:
        value = "green";
        break;

      default:
        value = "";
        break;
    }

    return value;
  };

  return (
    <div className="mx-4">
      <div onClick={onClick} className="between-x cursor-pointer">
        <div className="row gap-2">
          <div className="w-9 h-9 center rounded-full bg-primary100/10">
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
              {"Pengisian Daya"}

              {isTransaction && (
                <span className={`text-[10px] ml-1 text-${getColorStatus()}`}>
                  {getLabelStatus()}
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
              {isTransaction && (
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
          isTransaction
            ? "-"
            : dataBalance?.Status === 1 || dataBalance?.Status === 2
            ? "+"
            : "-"
        }Rp${rupiah(
          cloneData?.Transaction?.DueAmount || Math.abs(dataBalance?.Amount)
        )}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default TransactionHistoryItem;
