import { IcFuelBlack, IcFuelRed, IcRightBlack } from "../../../assets";
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
  data: dataChargingLocation;
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
        if (!data?.disabled) onClick();
      }}
      className={`row gap-2 bg-white py-2.5 px-3.5 rounded-lg border border-${
        data?.isFull ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""} ${
        data?.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary30 center">
        <p className="text-primary100 font-semibold">{data?.id}</p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="between">
          <p className="font-medium mb-1">{data?.location}</p>

          <Signal signalValue={data?.signalValue} />
        </div>

        <div className="row ">
          <div className="ml-1">
            {data?.isFull ? <IcFuelRed /> : <IcFuelBlack />}
          </div>

          <div
            className={`ml-1 font-medium  ${
              data?.isFull ? "text-red" : "text-black100"
            }`}
          >
            {data?.isFull ? (
              <p>
                Penuh
                <a className="text-xs ml-1">{"(Tunggu 30 mnt)"}</a>
              </p>
            ) : (
              <p>
                {data?.available}{" "}
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
