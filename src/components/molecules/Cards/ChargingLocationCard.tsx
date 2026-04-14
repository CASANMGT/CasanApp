import { CiWifiOff } from "react-icons/ci";
import { FaMotorcycle } from "react-icons/fa6";
import { FiSlash } from "react-icons/fi";
import { IcBattery2, IcBike, IcLineDown, ILNoImage } from "../../../assets";
import {
  getDistanceFromLatLonInKm,
  getFormattedBrand,
  getLabelWatt,
  moments,
  rupiah,
  timeToSeconds,
} from "../../../helpers";
import { Button } from "../../atoms";

interface ChargingLocationCardProps {
  className?: string;
  type?: "location-list";
  data: ChargingStation;
  currentLocation: LatLng | undefined;
  isLast?: boolean | undefined;
  loading?: boolean;
  onClick: () => void;
  onLoadMore?: () => void;
}

const ChargingLocationCard: React.FC<ChargingLocationCardProps> = ({
  className,
  type,
  data,
  isLast,
  currentLocation,
  loading,
  onClick,
  onLoadMore,
}) => {
  const currentTime = timeToSeconds(moments().format("HH:mm"));

  const distance = getDistanceFromLatLonInKm(
    { lat: data?.Location?.Latitude, lon: data?.Location?.Longitude },
    currentLocation,
  );
  const dataMaxWatt = data?.Devices?.map((device) => device?.MaxWatt);

  const priceType: number = data?.PriceSetting?.BikePriceType;
  const brand = data?.Brand;
  let isFull: boolean = false;
  let isDisconnect: boolean = false;
  let price: number = 0;
  let watt: string = "";
  let totalSocket: number = 0;
  let totalAvailable: number = 0;
  let totalFull: number = 0;
  let totalDisconnect: number = 0;
  let timeFinished: number = 0;
  let minWatt: number = 0;
  let maxWatt: number = 0;

  if (dataMaxWatt?.length) {
    minWatt = Math.min(...dataMaxWatt) / 1000;
    maxWatt = Math.max(...dataMaxWatt) / 1000;
  }

  if (
    data?.PriceSetting?.PriceBaseRules &&
    data?.PriceSetting?.PriceBaseRules.length &&
    data?.PriceSetting?.PriceBaseRules[0]?.PriceBaseTime &&
    data?.PriceSetting?.PriceBaseRules[0]?.PriceBaseTime.length
  ) {
    const filtered = data?.PriceSetting?.PriceBaseRules[0].PriceBaseTime.filter(
      (e) =>
        currentTime > timeToSeconds(e?.PriceTimeRule.From) &&
        currentTime < timeToSeconds(e?.PriceTimeRule.To),
    )[0];

    price =
      priceType === 2 ? data.PriceSetting?.BikeBaseFare : filtered?.Value || 0;
    watt = `${data?.PriceSetting?.PriceBaseRules[0].From}-${data?.PriceSetting?.PriceBaseRules[0].To}W`;
  }

  if (data?.Devices && data?.Devices.length) {
    totalSocket = data?.Devices.reduce(
      (accumulator, currentValue) =>
        accumulator +
        (currentValue?.Sockets?.filter((e) => e?.IsActive)?.length ?? 0),
      0,
    );

    for (const key in data?.Devices) {
      const element = data?.Devices[key];

      if (element?.Sockets && element?.Sockets?.length) {
        for (const i in element?.Sockets) {
          const e = element?.Sockets[i];

          if (e.IsCharging === 0 && e?.IsActive) totalAvailable += 1;
          else if (e.IsCharging === 1) totalFull += 1;
          else if (e.IsCharging === 3 || !e?.IsActive) totalDisconnect += 1;
        }
      }
    }

    if (totalAvailable <= 0) {
      if (totalSocket > 0 && totalSocket === totalFull) isFull = true;
      else if (totalDisconnect > 0) isDisconnect = true;
    }

    if (isFull) {
      const dataCombine = [];

      for (const key in data?.Devices) {
        const element = data?.Devices[key];

        for (const item of element?.Sockets) {
          dataCombine.push(item);
        }
      }

      const now = new Date();
      const nextDate = dataCombine
        .map((dateStr) => new Date(dateStr.CreatedAt))
        .filter((date) => date > now)
        .sort((a, b) => a.getTime() - b.getTime())[0];

      if (nextDate) {
        const result = nextDate?.toISOString() || null;
        const diff = moments(result).diff(moments(), "seconds");

        timeFinished = Math.floor((diff % 3600) / 60);
      }
    }
  }

  const labelWatt = getLabelWatt(minWatt, maxWatt);
  const isSuperFast = !!data?.Devices?.some((e) => e?.Type === 2);
  const isUltraFast = !!data?.Devices?.some((e) => e?.Type === 3);
  const formattedBrand = getFormattedBrand(brand || 0);
  const IconBrand = formattedBrand.icon;

  if (!data?.IsVisibleToUser || !data?.Devices?.length)
    return isLast ? (
      <Button
        type="secondary"
        label="Muat Lainnya"
        loading={loading}
        iconRight={IcLineDown}
        onClick={() => {
          if (onLoadMore) onLoadMore();
        }}
        className="py-4 mb-10"
      />
    ) : null;

  const uniqueVehicleBrandImages: string[] = Array.from(
    new Map(
      (data?.Devices ?? [])
        .reduce((acc: any[], device) => {
          return acc.concat(device?.Sockets ?? []);
        }, [])
        .filter(
          (socket) => socket?.VehicleBrand?.ID && socket?.VehicleBrand?.Logo,
        )
        .map((socket) => [socket.VehicleBrand.ID, socket.VehicleBrand.Logo]),
    ).values(),
  );

  const images = uniqueVehicleBrandImages ?? [];
  const visibleImages = images.slice(0, 2);
  const remaining = images.length - 2;

  return (
    <>
      <div
        onClick={onClick}
        className={`mb-3 shadow-md rounded-lg cursor-pointer bg-white ${className}`}
      >
        <div className="p-3 pt-6 bg-chargingLocation bg-center rounded-t-lg relative ">
          <div
            className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg row px-3 py-1"
            style={{
              background: `linear-gradient(225deg, #${
                isUltraFast ? "DE0E11" : isSuperFast ? "DE0E11" : "2dba9d"
              } 0%, #${
                isUltraFast ? "C0D749" : isSuperFast ? "0088FF" : "327478"
              } 100%)`,
            }}
          >
            <IcBattery2 className="text-white" />

            <span className="text-white ml-1.5 font-medium text-xs">
              {isUltraFast
                ? "Ultra Fast Charging"
                : isSuperFast
                  ? "Super Fast Charging"
                  : "Fast Charging"}
            </span>
          </div>

          <div className="row gap-3">
            <img
              src={data?.Image ? data?.Image : ILNoImage}
              alt="location 1"
              className="w-[50px] h-[50px] rounded-md"
            />

            <div className="flex flex-col justify-between">
              <p className="font-medium ">{data?.Name || "-"}</p>
              <p className="text-2-line text-xs text-black90">
                {data?.Location?.Address || "-"}
              </p>
            </div>
          </div>

          <div
            className={`between-x ${
              type === "location-list"
                ? "mt-4"
                : "mt-[18px] bg-white/50 px-3 py-1 rounded"
            }`}
          >
            <div className="row gap-2.5">
              <div
                className={`h-[30px] w-[30px] rounded center ${
                  isFull || data?.IsClosed
                    ? "bg-lightRed"
                    : isDisconnect
                      ? "bg-black10"
                      : "bg-primary10"
                }`}
              >
                {data?.IsClosed ? (
                  <FiSlash size={16} className="text-red" />
                ) : isDisconnect ? (
                  <CiWifiOff size={18} />
                ) : (
                  <FaMotorcycle
                    size={18}
                    className={`text-${isFull ? "red" : "green"}`}
                  />
                )}
              </div>

              {isFull || isDisconnect || data?.IsClosed ? (
                <div className="text-black70">
                  <p
                    className={`text-xs font-semibold text-${
                      data?.IsClosed ? "red" : "black100"
                    }`}
                  >
                    {data?.IsClosed
                      ? "Tutup Sementara"
                      : isFull
                        ? "Sedang Penuh"
                        : "Sedang tidak tersedia"}
                  </p>

                  {isDisconnect && (
                    <p className="text-[10px]">Mohon cek berkala</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-row gap-1 relative">
                  <p className="text-lg font-semibold">{`${totalAvailable}/${totalSocket}`}</p>
                  <p className="text-xs self-end mb-1 text-black50 font-medium">
                    tersedia
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-primary100 font-medium">{`${distance}km dari anda`}</p>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-b-lg between-x">
          <div className=" row gap-1">
            <IcBike className="text-primary100 mr-3" />

            <p className="text-xs text-primary100 font-semibold">Rp</p>
            <p className="text-lg text-primary100 font-semibold mr-1">{`${rupiah(
              price,
            )}/${priceType === 2 ? "kWh" : "jam"}`}</p>
          </div>

          {/* Brand Logos - Dummy Images */}
          <div className="flex items-center gap-1">
            {/* Overlapping Brand Logos */}
            {images.length ? (
              <div className="flex items-center">
                {visibleImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 rounded-full flex items-center justify-center overflow-hidden -ml-3 first:ml-0 shadow-md bg-gray-200"
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

                {images.length > 2 && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] text-gray-500 font-medium -ml-3 shadow-md">
                    +{remaining}
                  </div>
                )}
              </div>
            ) : null}

            {/* Watt Label */}
            <div className="text-primary100 bg-primary10 px-2 rounded-md rounded-l-[40px] gap-1 flex items-center py-0.5 ml-1">
              <span className="font-medium text-sm">{labelWatt}</span>
            </div>
          </div>

          {/* 
          // Fallback: Single Brand Style (from station brand)
          <div
            className="rounded-md row"
            style={{ backgroundColor: formattedBrand.bgColor }}
          >
            <div className="center px-2">
              <IconBrand className="text-white" />
            </div>
            <div className="text-primary100 bg-primary10 px-1 rounded-md rounded-l-[40px] gap-1 flex items-center py-0.5">
              <span className="font-medium">{labelWatt}</span>
            </div>
          </div>
          */}
        </div>
      </div>

      {isLast && (
        <Button
          type="secondary"
          label="Muat Lainnya"
          loading={loading}
          iconRight={IcLineDown}
          onClick={() => {
            if (onLoadMore) onLoadMore();
          }}
          className="py-4 mb-10"
        />
      )}
    </>
  );
};

export default ChargingLocationCard;
