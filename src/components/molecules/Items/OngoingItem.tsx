import { IcRightBlack } from "../../../assets";

interface OngoingItemProps {}

const OngoingItem: React.FC<OngoingItemProps> = () => {
  return (
    <div className="between min-w-[210px] border border-black10 rounded-lg py-2 px-3 cursor-pointer">
      <div className="row gap-2">
        <img
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ddBLsjXELeexn4zWAEUxkClXVovj3Q_h2g&s"
          }
          alt="location 1"
          className="w-9 h-9 rounded-md"
        />

        <div>
          <p className="text-xs text-black70">Pasar Modern</p>
          <p className="font-medium">Pintu Barat</p>
        </div>
      </div>

      <IcRightBlack />
    </div>
  );
};

export default OngoingItem;
