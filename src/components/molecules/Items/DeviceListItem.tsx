import { IcFuel, IcRightBlack } from "../../../assets";
import { Device, StringNumber } from "../../../common";
import { formatSpaceNumber } from "../../../helpers";
import { Signal } from "../../atoms";

interface DeviceListItemProps {
  isLast: boolean;
  data: Device;
  position: number;
  onClick: () => void;
}

const DeviceListItem: React.FC<DeviceListItemProps> = ({
  isLast,
  data,
  position,
  onClick,
}) => {
  const getTotalSocketAvailable = () => {
    let value: number = 0;

    if (data?.Sockets && data.Sockets.length) {
      data?.Sockets.forEach((element) => {
        if (
          data.SignalValue > 0 &&
          element.IsCharging === 0 &&
          element?.SessionStatus !== 1 &&
          element?.SessionStatus !== 2 &&
          element?.SessionStatus !== 3 &&
          element?.SessionStatus !== 4 &&
          element?.SessionStatus !== 5
        )
          value++;
      });
    }

    return value;
  };

  const total = getTotalSocketAvailable();
  const isFull: boolean =
    data?.Sockets && data?.Sockets.length
      ? !data?.Sockets.some((e) => e.IsCharging !== 1)
      : false;

  return (
    <div
      onClick={() => {
        // onClick();
        if (!isFull && total > 0) onClick();
      }}
      className={`row gap-2 bg-white py-2 px-3.5 rounded-lg border border-${
        isFull || !total ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""} ${
        isFull || !total ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="w-[30px] h-[30px] rounded-full bg-primary30 center">
        <p className="text-primary100 font-semibold">
          {StringNumber[position]}
        </p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="between-x">
          <p className="font-medium mb-1">{`${data.Name} - ${formatSpaceNumber(
            data?.PileNumber
          )}`}</p>

          <Signal signalValue={data?.SignalValue} />
        </div>

        <div className="row ">
          <IcFuel className={`ml-1 ${isFull ? "text-red" : "text-black100"}`} />

          <div
            className={`ml-1 font-medium  ${
              isFull ? "text-red" : "text-black100"
            }`}
          >
            {isFull ? (
              <p>
                Penuh
                <a className="text-xs ml-1">{"(Tunggu 30 mnt)"}</a>
              </p>
            ) : (
              <p>
                {total > 0 ? total : "Tidak"}{" "}
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
