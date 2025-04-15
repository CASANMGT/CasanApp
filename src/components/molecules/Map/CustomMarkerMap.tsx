import L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { IcFuel } from "../../../assets";
import { ChargingStation, LatLng } from "../../../common";
import { moments, rupiah, timeToSeconds } from "../../../helpers";

interface CustomMarkerProps {
  data: ChargingStation;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ data }) => {
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  const iconHtml = `
    <div class="w-[18px] h-[18px] bg-primary70 border-2 border-primary100 rounded-full">
    </div>`;

  const customIcon = L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [18, 18],
    popupAnchor: [0, 0],
  });

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [map]);

  if (
    !data?.Location?.Latitude ||
    !data?.Location?.Longitude ||
    data?.Location?.Latitude > 0
  )
    return;

  const coordinate: LatLng = [
    data?.Location?.Latitude,
    data?.Location?.Longitude,
  ];

  const currentTime = timeToSeconds(moments().format("HH:mm"));
  let price: number = 0;
  let available: number = 0;

  if (
    data?.PriceSetting?.PriceBaseRules &&
    data?.PriceSetting?.PriceBaseRules.length &&
    data?.PriceSetting?.PriceBaseRules[0]?.PriceBaseTime &&
    data?.PriceSetting?.PriceBaseRules[0]?.PriceBaseTime.length
  ) {
    const filtered = data?.PriceSetting?.PriceBaseRules[0].PriceBaseTime.filter(
      (e) =>
        timeToSeconds(e?.PriceTimeRule.From) >= currentTime &&
        currentTime <= timeToSeconds(e?.PriceTimeRule.To)
    )[0];

    price = filtered?.Value || 0;
  }

  if (data?.Devices && data?.Devices.length) {
    available = data?.Devices.reduce(
      (accumulator, currentValue) =>
        accumulator + (currentValue.Sockets.length || 0),
      0
    );
  }

  return (
    <Marker position={coordinate} icon={customIcon} ref={markerRef}>
      <Popup
        keepInView={true}
        autoPan={true}
        autoClose={false}
        closeOnClick={false}
        closeOnEscapeKey={false}
      >
        <div onClick={() => alert()} className="cursor-pointer">
          <p className="!m-0 font-semibold text-xs">
            Rp <span className="text-xl">{`${rupiah(price)}/jam`}</span>
          </p>
          <div className="row gap-1 mt-2 text-xs text-black70">
            <IcFuel className="text-primary100" />
            <span>Tersedia</span>
            <span className="text-primary100 font-semibold">{available}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default CustomMarker;
