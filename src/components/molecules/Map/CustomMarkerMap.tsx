import L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { useDispatch } from "react-redux";
import { IcFuel } from "../../../assets";
import {
  ChargingStation,
  Device,
  LatLng,
  PriceBaseRule,
  PriceBaseTime,
} from "../../../common";
import { setFromGlobal } from "../../../features";
import { moments, rupiah, timeToSeconds } from "../../../helpers";
import { AppDispatch } from "../../../store";

interface CustomMarkerProps {
  data: ChargingStation;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

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

  const onShow = () => {
    dispatch(
      setFromGlobal({
        type: "openChargingStation",
        value: true,
        data: dataChargingStation,
      })
    );
  };

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
  let totalSocket: number = 0;
  let totalAvailable: number = 0;

  const dataChargingStation: ChargingStation[] =
    data?.Location?.ChargingStations;

  // if (dataChargingStation?.length) {
  //   dataChargingStation.forEach((element) => {
  //     const dataPriceBaseRules: PriceBaseRule[] =
  //       element?.PriceSetting?.PriceBaseRules;

  //     if (
  //       dataPriceBaseRules?.length &&
  //       dataPriceBaseRules[0]?.PriceBaseTime?.length
  //     ) {
  //       const dataPriceBaseTime: PriceBaseTime[] =
  //         dataPriceBaseRules[0]?.PriceBaseTime;

  //       const filtered = dataPriceBaseTime.filter(
  //         (e) =>
  //           currentTime > timeToSeconds(e?.PriceTimeRule.From) &&
  //           currentTime < timeToSeconds(e?.PriceTimeRule.To)
  //       )[0];

  //       price = filtered?.Value || 0;

  //       if (price > 0 && price > filtered?.Value) price = filtered?.Value;
  //       else price = filtered?.Value || 0;
  //     }

  //     const dataDevices: Device[] | null = element?.Devices;

  //     if (dataDevices?.length) {
  //       totalSocket = dataDevices.reduce(
  //         (accumulator, currentValue) =>
  //           accumulator + (currentValue.Sockets.length || 0),
  //         0
  //       );

  //       for (const key in dataDevices) {
  //         const el = dataDevices[key];

  //         if (el?.Sockets && el?.Sockets?.length) {
  //           for (const i in el?.Sockets) {
  //             const e = el?.Sockets[i];

  //             if (e.IsCharging === 0) totalAvailable += 1;
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  return (
    <Marker position={coordinate} icon={customIcon} ref={markerRef}>
      {/* <Popup
        keepInView={true}
        autoPan={true}
        autoClose={false}
        closeOnClick={false}
        closeOnEscapeKey={false}
      >
        <div onClick={onShow} className="cursor-pointer">
          <p className="!m-0 font-semibold text-xs">
            Rp <span className="text-xl">{`${rupiah(price)}/jam`}</span>
          </p>
          <div className="row gap-1 mt-2 text-xs text-black70">
            <IcFuel className="text-primary100" />
            <span>Tersedia</span>
            <span className="text-primary100 font-semibold">
              {totalAvailable}
            </span>
          </div>
        </div>
      </Popup> */}
    </Marker>
  );
};

export default CustomMarker;
