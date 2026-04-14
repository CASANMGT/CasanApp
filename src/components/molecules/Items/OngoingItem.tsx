import { IcRight, ILNoImage } from "../../../assets";

interface OngoingItemProps {
  data: Session;
  onClick: () => void;
}

const OngoingItem: React.FC<OngoingItemProps> = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 border border-black10 rounded-lg py-2 px-3 cursor-pointer bg-white"
    >
      <img
        src={data?.ChargingStation?.Image || ILNoImage}
        alt="location"
        className="w-12 h-12 rounded-md object-cover"
      />

      <div className="flex-1 min-w-0">
        <p className="text-xs text-black70 truncate">{data?.ChargingStation?.Name}</p>
        <p className="font-medium text-sm truncate">{`${
          data?.Device.Name
        } - ${data?.Device?.PileNumber.slice(-4)}`}</p>
      </div>

      <IcRight className="text-black100 shrink-0" />
    </div>
  );
};

export default OngoingItem;
