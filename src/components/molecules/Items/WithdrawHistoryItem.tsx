import { IcMoneySend } from "../../../assets";
import { WithdrawList } from "../../../common";
import { moments, rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface WithdrawHistoryItemProps {
  data: WithdrawList;
  onClick: () => void;
}

const WithdrawHistoryItem: React.FC<WithdrawHistoryItemProps> = ({
  data,
  onClick,
}) => {
  const formatted = getFormatStatus(data?.Status);

  return (
    <div className="mx-4">
      <div onClick={onClick} className="between-x cursor-pointer">
        <div className="row gap-2">
          <div className="w-9 h-9 center rounded-full bg-lightRed">
            <IcMoneySend />
          </div>

          <div>
            <p className="font-medium">
              Penarikan Saldo{" "}
              <span
                className={`font-medium text-[10px] text-${formatted.color}`}
              >
                {formatted?.label}
              </span>
            </p>

            <div className="row gap-1">
              <p className="text-xs text-black100/70">
                {moments(data?.CreatedAt).format("DD MMM YYYY • HH:mm")}
              </p>
            </div>
          </div>
        </div>

        <p className="text-blackBold font-semibold">{`-Rp${rupiah(
          data?.Amount || 0
        )}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default WithdrawHistoryItem;

const getFormatStatus = (status: number) => {
  let color: string = "";
  let label: string = "";

  switch (status) {
    case 1:
      label = "Diproses";
      color = "black100";
      break;

    case 2:
      label = "Disetujui";
      color = "green";
      break;

    case 3:
      label = "Ditolak";
      color = "red";
      break;

    default:
      break;
  }

  return { color, label };
};
