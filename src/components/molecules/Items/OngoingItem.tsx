import { IcRightBlack, ILNoImage } from "../../../assets";
import { Session } from "../../../common";

interface OngoingItemProps {
  data: Session;
  onClick: () => void;
}

const OngoingItem: React.FC<OngoingItemProps> = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="between min-w-[210px] border border-black10 rounded-lg py-2 px-3 cursor-pointer"
    >
      <div className="row gap-2">
        <img
          src={data?.ChargingStation?.Image || ILNoImage}
          alt="location 1"
          className="w-9 h-9 rounded-md"
        />

        <div>
          <p className="text-xs text-black70">{data?.Device?.Name}</p>
          <p className="font-medium">{data?.Device?.PileNumber.slice(-4)}</p>
        </div>
      </div>

      <IcRightBlack />
    </div>
  );
};

export default OngoingItem;
