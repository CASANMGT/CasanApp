import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { DataChargingStation, LatLng } from "../../../common";
import { getCurrentLocation } from "../../../services/ApiAddress";
import CustomMarkerMap from "./CustomMarkerMap";

interface MapProps {
  data: DataChargingStation[] | undefined;
}

const Map: React.FC<MapProps> = ({ data }) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const check = await getCurrentLocation();
    setCurrentLocation(check);
  };

  if (!currentLocation) return;

  const isShowData = data && data.length ? true : false;

  return (
    <div className="w-full h-full">
      <MapContainer
        center={currentLocation}
        zoom={13}
        className="h-full w-full !z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {isShowData && data?.map((item, index) => <CustomMarkerMap key={index} data={item} />)}
      </MapContainer>
    </div>
  );
};

export default Map;
