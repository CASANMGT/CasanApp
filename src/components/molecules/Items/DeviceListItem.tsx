import { IcFlash, IcFuel } from "../../../assets";
import { moments } from "../../../helpers";
import { Separator, Signal } from "../../atoms";

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

  let timeFinished: number = 0;
  const total = getTotalSocketAvailable();
  const isFull: boolean =
    data?.Sockets && data?.Sockets.length
      ? !data?.Sockets.some((e) => e.IsCharging !== 1)
      : false;

  if (isFull) {
    const now = new Date();
    const nextDate = data?.Sockets.map((dateStr) => new Date(dateStr.CreatedAt))
      .filter((date) => date > now)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    if (nextDate) {
      const result = nextDate?.toISOString() || null;
      const diff = moments(result).diff(moments(), "seconds");

      timeFinished = Math.floor((diff % 3600) / 60);
    }
  }

  return (
    <div
      onClick={() => {
        if (!isFull && total > 0) onClick();
      }}
      className={` bg-white py-2 px-3.5 rounded-lg shadow-lg border border-${
        isFull || !total ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""} ${
        isFull || !total ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="row gap-2">
        <Signal signalValue={data?.SignalValue} />

        <p className="font-medium">
          {`${data.Name}`}{" "}
          <span className="text-black50">({data?.TotalSocket})</span>
        </p>
      </div>

      <Separator className="my-1.5" />

      <div className="row gap-2">
        <div className="row gap-1">
          <IcFlash className="text-black100" />
          <p className="text-black90 text-xs">
            <span className="font-medium text-sm">
              Max {data?.MaxWatt / 1000}
            </span>
            kWh
          </p>
        </div>

        <div className="row gap-1">
          <IcFuel className={`${isFull ? "text-red" : "text-black100"}`} />

          <div
            className={`font-medium  ${isFull ? "text-red" : "text-black100"}`}
          >
            {isFull ? (
              <p>
                Penuh
                <a className="text-xs ml-1">{`(Tunggu ${timeFinished} mnt)`}</a>
              </p>
            ) : (
              <p className="font-medium">
                {total > 0 ? total : "Tidak"}{" "}
                <a className="text-xs text-black70 font-normal">Tersedia</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceListItem;
