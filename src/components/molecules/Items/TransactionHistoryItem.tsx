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
  const cloneData: DataTransaction & Balance = data;
  const isTransaction = cloneData?.Transaction?.ID ? true : false;

  const getLabelType = () => {
    let value: string;

    switch (cloneData?.Transaction?.Status || cloneData?.Status) {
      case 1:
        value =
          isTransaction && cloneData?.Transaction?.Type === 2
            ? "Pengisian Daya"
            : "Top-Up";
        break;

      case 2:
        value = "Refund Sesi";
        break;

      case 3:
        value = "Bayar Sesi";
        break;

      case 4:
        value = "Penarikan Saldo";
        break;

      default:
        value = "";
        break;
    }

    return value;
  };

  const getLabelStatus = () => {
    let value: string;
    switch (cloneData?.Session?.Status) {
      case 1:
        value = "Belum Bayar";
        break;

      case 7:
        value = "Expired";
        break;

      case 6:
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
    switch (cloneData?.Session?.Status) {
      case 1:
        value = "red";
        break;

      case 7:
        value = "black50";
        break;

      case 6:
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
            {cloneData?.Status === 1 || cloneData?.Status === 2 ? (
              <IcMoneyReceive />
            ) : cloneData?.Status === 3 || cloneData?.Status === 4 ? (
              <IcMoneySend />
            ) : (
              <IcFuel className="text-primary100" />
            )}
          </div>

          <div>
            <p className="font-medium">
              {getLabelType()}

              {isTransaction && (
                <span className={`text-[10px] ml-1 text-${getColorStatus()}`}>
                  {getLabelStatus()}
                </span>
              )}
            </p>

            <div className="row gap-1">
              <p className="text-xs text-black100/70">
                {moments(
                  cloneData?.Session?.StartChargingTime || cloneData?.CreatedAt
                ).format("DD MMM YYYY HH:mm")}
              </p>
              {isTransaction && (
                <>
                  {" "}
                  <p className="text-xs text-black100/40">at</p>
                  <p className="text-xs">
                    {cloneData?.Session?.ChargingStation?.Location?.Mark ||
                      cloneData?.Session?.ChargingStation?.Location?.Name ||
                      "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-blackBold font-semibold">{`${
          isTransaction
            ? "-"
            : cloneData?.Status === 1 || cloneData?.Status === 2
            ? "+"
            : "-"
        }Rp${rupiah(
          cloneData?.Transaction?.DueAmount || cloneData?.Amount
        )}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default TransactionHistoryItem;
