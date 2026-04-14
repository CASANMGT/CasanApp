import {
  IcBattery2,
  IcBatterySuper,
  IcBatteryUltra,
  IcFlash,
  IcFuel,
} from "../../../assets";
import { brandImages } from "../../../mocks/brandImages";
import { getFormattedBrand, moments } from "../../../helpers";
import { Separator, Signal } from "../../atoms";

interface DeviceListItemProps {
  isLast: boolean;
  data: Device;
  position: number;
  disabled?: boolean;
  closed?: boolean;
  onClick: () => void;
}

const DeviceListItem: React.FC<DeviceListItemProps> = ({
  isLast,
  data,
  position,
  disabled,
  closed,
  onClick,
}) => {
  const getTotalSocketAvailable = () => {
    let value: number = 0;

    if (data?.Sockets && data.Sockets.length) {
      data?.Sockets.forEach((element) => {
        if (
          data.IsActive &&
          data.SignalValue > 0 &&
          element.IsCharging === 0 &&
          element?.SessionStatus !== 1 &&
          element?.SessionStatus !== 2 &&
          element?.SessionStatus !== 3 &&
          element?.SessionStatus !== 4 &&
          element?.SessionStatus !== 5 &&
          element?.IsActive
        )
          value++;
      });
    }

    return value;
  };

  let timeFinished: number = 0;
  let total = getTotalSocketAvailable();
  const isSuperFast: boolean = data?.Type === 2;
  const isUltraFast: boolean = data?.Type === 3;
  let isFull: boolean =
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

  const logos: string[] = Array.from(
    new Map(
      (data?.Sockets ?? [])
        .filter(
          (
            s,
          ): s is typeof s & {
            VehicleBrand: { ID: number; Logo: string };
          } => Boolean(s?.VehicleBrand?.ID && s?.VehicleBrand?.Logo),
        )
        .map((s) => [s.VehicleBrand.ID, s.VehicleBrand.Logo]),
    ).values(),
  );

  return (
    <div
      onClick={() => {
        onClick();
        // if (total > 0 && !disabled && !closed) onClick();
      }}
      className={` bg-white py-2 px-3.5 rounded-lg shadow-lg border border-${
        !total || disabled || closed ? "black10" : "primary30"
      } ${!isLast ? "mb-2.5" : ""} ${
        !total || disabled || closed
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer"
      }`}
    >
      <div className="row gap-2">
        <Signal signalValue={data?.SignalValue} />

        <p className="font-medium flex-1">
          {`${data.Name}`}{" "}
          <span className="text-black50">({data?.TotalSocket})</span>
        </p>

        {logos?.length ? (
          <div className="flex items-center">
            {logos.map((img, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden -ml-3 first:ml-0 shadow-md bg-gray-200"
              >
                <img
                  src={img}
                  alt="Brand"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="row gap-1.5">
          {isUltraFast ? (
            <IcBatteryUltra />
          ) : isSuperFast ? (
            <IcBatterySuper />
          ) : (
            <IcBattery2 className="text-primary100" />
          )}
          <span
            className={`text-xs font-semibold italic ${
              isUltraFast
                ? "bg-gradient-to-r from-[#C0D749] to-[#DE0E11] bg-clip-text text-transparent"
                : isSuperFast
                  ? "bg-gradient-to-r from-[#0088FF] to-[#DE0E11] bg-clip-text text-transparent"
                  : "text-primary100"
            }`}
          >
            {isUltraFast ? "ULTRA" : isSuperFast ? "SUPER" : "FAST"}
          </span>
        </div>
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
              <p>Penuh</p>
            ) : (
              <p className="text-xs text-black70">
                {total > 0 && !closed ? total : "Tidak"} Tersedia
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceListItem;
