import {
  IcBike,
  IcFlash,
  IcFuel,
  IcLineDown,
  ILNoImage,
} from "../../../assets";
import { ChargingStation, LatLng } from "../../../common";
import {
  getDistanceFromLatLonInKm,
  moments,
  rupiah,
  timeToSeconds,
} from "../../../helpers";
import { Button } from "../../atoms";

interface ChargingLocationCardProps {
  type?: "location-list";
  data: ChargingStation;
  currentLocation: LatLng | undefined;
  isLast?: boolean | undefined;
  loading: boolean;
  onClick: () => void;
  onLoadMore?: () => void;
}

const ChargingLocationCard: React.FC<ChargingLocationCardProps> = ({
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
    currentLocation
  );
  const dataMaxWatt = data?.Devices?.map((device) => device?.MaxWatt);

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
        currentTime < timeToSeconds(e?.PriceTimeRule.To)
    )[0];

    price = filtered?.Value || 0;
    watt = `${data?.PriceSetting?.PriceBaseRules[0].From}-${data?.PriceSetting?.PriceBaseRules[0].To}W`;
  }

  if (data?.Devices && data?.Devices.length) {
    totalSocket = data?.Devices.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.Sockets.length || 0),
      0
    );

    for (const key in data?.Devices) {
      const element = data?.Devices[key];

      if (element?.Sockets && element?.Sockets?.length) {
        for (const i in element?.Sockets) {
          const e = element?.Sockets[i];

          if (e.IsCharging === 0) totalAvailable += 1;
          else if (e.IsCharging === 1) totalFull += 1;
          else if (e.IsCharging === 3) totalDisconnect += 1;
        }
      }
    }

    if (totalAvailable <= 0) {
      if (totalSocket === totalFull) isFull = true;
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

      const now = new Date("2025-04-15T12:00:00Z");
      const nextDate = dataCombine
        .map((dateStr) => new Date(dateStr.CreatedAt))
        .filter((date) => date > now)
        .sort((a, b) => a.getTime() - b.getTime())[0];

      const result = nextDate?.toISOString() || null;
      const diff = moments(result).diff(moments(), "seconds");
      timeFinished = Math.floor((diff % 3600) / 60);
    }
  }

  const labelWatt = getLabelWatt(minWatt, maxWatt);

  return (
    <>
      <div
        onClick={onClick}
        className="mb-3 shadow-md rounded-lg cursor-pointer"
      >
        <div className="p-3 bg-chargingLocation bg-center rounded-t-lg">
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
                className={`h-[30px] w-[30px] rounded p-2 ${
                  isFull
                    ? "bg-lightRed"
                    : isDisconnect
                    ? "bg-black10"
                    : "bg-primary10"
                }`}
              >
                <IcFuel
                  className={
                    isFull
                      ? "text-red"
                      : isDisconnect
                      ? "text-black50"
                      : "text-primary100"
                  }
                />
              </div>

              {isFull ? (
                <div>
                  <p className="font-semibold text-xs text-red">Sedang Penuh</p>
                  <p className="text-[10px] text-red">{`Tunggu ${timeFinished} mnt`}</p>
                </div>
              ) : isDisconnect ? (
                <div className="text-black70">
                  <p className="text-xs font-semibold text-black70">
                    Sedang Dalam Gangguan
                  </p>

                  <p className="text-[10px]">Mohon cek berkala</p>
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
              price
            )}/jam`}</p>
          </div>

          <div className="bg-primary100 rounded-md row">
            <div className="py-0.5 px-1 row gap-1">
              <IcFlash className="text-white" />
            </div>

            <div className="text-primary100 bg-primary10 px-1 rounded-md rounded-l-[40px] gap-1 flex items-center py-0.5">
              <span className="font-medium">{labelWatt}</span>
            </div>
          </div>
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
        />
      )}
    </>
  );
};

export default ChargingLocationCard;

const getLabelWatt = (min: number, max: number) => {
  let value: string = "";

  if (min === max) {
    if (min < 1) value = `${min * 1000}w`;
    else value = `${min}kW`;
  } else {
    value = `${min}-${max}kW`;
  }

  return value;
};
