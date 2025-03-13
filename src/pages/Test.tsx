import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLng } from "../common";
import { rupiah } from "../helpers";
import { IcFuel } from "../assets";

const coordinate: LatLng = [-6.289576984935274, 106.6842171544551];

const CustomMarker = () => {
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

  return (
    <Marker position={coordinate} icon={customIcon} ref={markerRef} >
      <Popup
        keepInView={true}
        autoPan={true}
        autoClose={false}
        closeOnClick={false}
        closeOnEscapeKey={false}
      >
        <div>
          <p className="!m-0 font-semibold text-xs">
            Rp <span className="text-xl">{`${rupiah(500)}/jam`}</span>
          </p>
          <div className="row gap-1 mt-2 text-xs text-black70">
            <IcFuel className="text-primary100" />
            <span>Tersedia</span>
            <span className="text-primary100 font-semibold">{4}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const Test = () => {
  return (
    <div className="container-screen relative">
      <MapContainer center={coordinate} zoom={13} className="h-screen w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CustomMarker />
      </MapContainer>
    </div>
  );
};

export default Test;
