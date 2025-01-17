import { IcFuelBlack, IcFuelRed, IcRightBlack } from "../../../assets";
import { Signal } from "../../atoms";

interface DeviceListItemProps {
  isLast: boolean;
  onClick: () => void;
}

const DeviceListItem: React.FC<DeviceListItemProps> = ({ isLast, onClick }) => {
  const isFull: boolean = true;

  return (
    <div
      onClick={onClick}
      className={`row gap-2 bg-white py-2.5 px-3.5 rounded-lg cursor-pointer border border-${
        isFull ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""}`}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary30 center">
        <p className="text-primary100 font-semibold">A</p>
      </div>

      <div className="flex flex-col flex-1">
        <p className="font-medium mb-1">Pintu Masuk Barat</p>

        <div className="row ">
          <Signal type="full" />

          <div className="ml-1">{isFull ? <IcFuelRed /> : <IcFuelBlack />}</div>

          <p
            className={`ml-1 font-medium  ${
              isFull ? "text-red" : "text-black100"
            }`}
          >
            0
            <a className="text-xs font-normal">{`/2 ${
              isFull && "(30 menit lagi)"
            }`}</a>
          </p>
        </div>
      </div>

      <IcRightBlack />
    </div>
  );
};

export default DeviceListItem;
