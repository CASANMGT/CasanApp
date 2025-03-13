import { IcFuel } from "../../../assets";
import { DataTransaction } from "../../../common";
import { moments, rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface TransactionHistoryItemProps {
  data: DataTransaction;
  onClick: () => void;
}

const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  data,
  onClick,
}) => {
  const getLabelStatus = () => {
    let value: string;
    switch (data?.Session.Status) {
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
    switch (data?.Session.Status) {
      case 1:
        value = 'red';
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
            <IcFuel className="text-primary100" />
          </div>

          <div>
            <p className="font-medium">
              {data?.Transaction?.Type === 2 ? "Pengisian Daya" : "Top-Up"}

              <span className={`text-[10px] ml-1 text-${getColorStatus()}`}>
                {getLabelStatus()}
              </span>
            </p>

            <div className="row gap-1">
              <p className="text-xs text-black100/70">
                {moments(data?.Session?.StartChargingTime).format("DD MMM YYYY HH:mm")}
              </p>
              <p className="text-xs text-black100/40">at</p>
              <p className="text-xs">
                {data?.Session?.ChargingStation?.Location?.Mark ||
                  data?.Session?.ChargingStation?.Location?.Name ||
                  "-"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-blackBold font-semibold">{`-Rp${rupiah(
          data?.Transaction?.DueAmount
        )}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default TransactionHistoryItem;
