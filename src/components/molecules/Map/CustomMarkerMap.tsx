import L from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import { useDispatch } from "react-redux";
import {
  IcCasanMarker,
  IcMakaMarker,
  IcTangkasMarker,
  IcUnitedMarker,
} from "../../../assets";
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
      }),
    );
  };

  const getIconMarker = () => {
    let icon = null;

    switch (data?.Brand) {
      case 2:
        icon = IcUnitedMarker;
        break;

      case 3:
        icon = IcMakaMarker;
        break;

      case 4:
        icon = IcTangkasMarker;
        break;

      default:
        icon = IcCasanMarker;
        break;
    }

    return icon;
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
    data?.Location?.ChargingStations ?? [];
  const iconMarker = getIconMarker();

  const customMyLocationIcon = L.icon({
    iconUrl: IcCasanMarker,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  return (
    <div className="cursor-pointer">
      <Marker
        position={coordinate}
        icon={customMyLocationIcon}
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
