import {
  IcBike,
  IcDownGreen,
  IcFuel,
  IcShareGreen,
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
  isLast: boolean | undefined;
  loading: boolean;
  onClick: () => void;
  onLoadMore: () => void;
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

  const isFull: boolean = false;
  const distance = getDistanceFromLatLonInKm(
    { lat: data?.Location?.Latitude, lon: data?.Location?.Longitude },
    currentLocation
  );
  let price: number = 0;
  let watt: string = "";
  let available: number = 0;

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
    available = data?.Devices.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.Sockets.length || 0),
      0
    );
  }

  return (
    <>
      <div onClick={onClick} className="mb-3 cursor-pointer">
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
                  isFull ? "bg-lightRed" : "bg-primary100/10"
                }`}
              >
                <IcFuel className={isFull ? "text-red" : "text-primary100"} />
              </div>

              {isFull ? (
                <div>
                  <p className="font-semibold text-xs text-red">Sedang Penuh</p>
                  <p className="text-[10px] text-red">30 menit lagi</p>
                </div>
              ) : (
                <div className="flex flex-row gap-1 relative">
                  <p className="text-lg font-semibold">{available}</p>
                  <p className="text-xs self-end mb-1 text-black50 font-medium">
                    tersedia
                  </p>
                </div>
              )}
            </div>

            <div className="row gap-2">
              <p className="text-xs text-primary100 font-medium">{`${distance}km dari anda`}</p>

              <div className="p-[5px] rounded-full bg-primary10">
                <IcShareGreen />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-2.5 rounded-b-lg between-x">
          <div className=" row gap-1">
            <p className="text-xs text-primary100 font-semibold">Rp</p>
            <p className="text-lg text-primary100 font-semibold mr-1">{`${rupiah(price)}/jam`}</p>
            <p className="text-xs text-black50">{watt}</p>
          </div>

          <IcBike />
        </div>
      </div>

      {isLast && (
        <Button
          type="secondary"
          label="Muat Lainnya"
          loading={loading}
          iconRight={IcDownGreen}
          onClick={onLoadMore}
        />
      )}
    </>
  );
};

export default ChargingLocationCard;
