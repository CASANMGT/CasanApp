import L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import { useDispatch } from "react-redux";
import {
  ChargingStation,
  LatLng
} from "../../../common";
import { setFromGlobal } from "../../../features";
import { AppDispatch } from "../../../store";

interface CustomMarkerProps {
  data: ChargingStation;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

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

  const dataChargingStation: ChargingStation[] =
    data?.Location?.ChargingStations;

  const iconHtml = `
    <div class="w-[34px] h-[34px] text-lg font-medium items-center justify-center flex bg-secondary100 border-2 border-secondary30 rounded-full">
    ${dataChargingStation.length || 1}
    </div>`;

  const customIcon = L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [18, 18],
    popupAnchor: [0, 0],
  });

  return (
    <div className="cursor-pointer">
      <Marker
        position={coordinate}
        icon={customIcon}
        ref={markerRef}
        eventHandlers={{
          click: onShow,
        }}
      >
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
    </div>
  );
};

export default CustomMarker;
