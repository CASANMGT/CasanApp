import { IcFuelGreen } from "../../../assets";
import { rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface TransactionHistoryItemProps {
  onClick: () => void;
}

const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  onClick,
}) => {
  return (
    <div className="mx-4">
      <p className="text-xs font-medium mb-3">Hari ini</p>

      <div onClick={onClick} className="between cursor-pointer">
        <div className="row gap-2">
          <div className="w-9 h-9 center rounded-full bg-primary100/10">
            <IcFuelGreen />
          </div>

          <div>
            <p className="font-medium">Pengisian Daya</p>

            <div className="row gap-1">
              <p className="text-xs text-black100/70">09:10 AM</p>
              <p className="text-xs text-black100/40">at</p>
              <p className="text-xs">Aeon Mall</p>
            </div>
          </div>
        </div>

        <p className="text-blackBold font-semibold">{`-Rp${rupiah(10000)}`}</p>
      </div>

      <Separator className="my-4" />
    </div>
  );
};

export default TransactionHistoryItem;
