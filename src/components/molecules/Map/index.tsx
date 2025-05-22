import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { IcMyLocation } from "../../../assets";
import { ChargingStation, LatLng } from "../../../common";
import { getCurrentLocation } from "../../../services/ApiAddress";
import CustomMarkerMap from "./CustomMarkerMap";

interface MapProps {
  data: ChargingStation[] | undefined;
  myLocation?: LatLng;
}

const customMyLocationIcon = L.icon({
  iconUrl: IcMyLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map: React.FC<MapProps> = ({ data, myLocation }) => {
  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const check = await getCurrentLocation();

      setCurrentLocation(check);
    } catch (error) {}
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
        {isShowData &&
          data &&
          data?.map((item, index) => (
            <CustomMarkerMap key={index} data={item} />
          ))}

        {myLocation && (
          <>
            <SetViewToUserLocation position={myLocation} />
            <Marker position={myLocation} icon={customMyLocationIcon} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;

const SetViewToUserLocation = ({
  position,
}: {
  position: [number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13);
  }, [map, position]);
  return null;
};
