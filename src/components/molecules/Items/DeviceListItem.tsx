import { IcFuel, IcRightBlack } from "../../../assets";
import { Device } from "../../../common";
import { Signal } from "../../atoms";

type dataChargingLocation = {
  id: string;
  available: number;
  location: string;
  signalValue: number;
  disabled: boolean;
  isFull: boolean;
};

interface DeviceListItemProps {
  isLast: boolean;
  data: Device;
  onClick: () => void;
}

const DeviceListItem: React.FC<DeviceListItemProps> = ({
  isLast,
  data,
  onClick,
}) => {
  return (
    <div
      onClick={() => {
        if (!false) onClick();
      }}
      className={`row gap-2 bg-white py-2 px-3.5 rounded-lg border border-${
        false ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""} ${
        false ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary30 center">
        <p className="text-primary100 font-semibold">{data?.ID}</p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="between-x">
          <p className="font-medium mb-1">{data?.PileNumber}</p>

          <Signal signalValue={data?.SignalValue} />
        </div>

        <div className="row ">
          <IcFuel className={`ml-1 ${false ? "text-red" : "text-black100"}`} />

          <div
            className={`ml-1 font-medium  ${
              false ? "text-red" : "text-black100"
            }`}
          >
            {false ? (
              <p>
                Penuh
                <a className="text-xs ml-1">{"(Tunggu 30 mnt)"}</a>
              </p>
            ) : (
              <p>
                {data?.Sockets.length}{" "}
                <a className="text-xs text-black70">Tersedia</a>
              </p>
            )}
          </div>
        </div>
      </div>

      <IcRightBlack />
    </div>
  );
};

export default DeviceListItem;
