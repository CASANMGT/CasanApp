import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { IcMyLocation } from "../../../assets";
import { ChargingStation, ERROR_MESSAGE, LatLng } from "../../../common";
import CustomMarkerMap from "./CustomMarkerMap";

interface MapProps {
  data: ChargingStation[] | undefined;
  myLocation?: LatLng;
  center?: LatLng;
}

const customMyLocationIcon = L.icon({
  iconUrl: IcMyLocation,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map: React.FC<MapProps> = ({ data, myLocation, center }) => {
  if (!center) return <div>{ERROR_MESSAGE}</div>;

  const isShowData = data && data.length ? true : false;

  

  return (
    <div className="w-full h-full">
      <MapContainer center={center} zoom={13} className="h-full w-full !z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {isShowData &&
          data &&
          data?.map((item, index) => (
            <CustomMarkerMap key={index} data={item} />
          ))}
        {/* {data && <CustomMarkerMap  data={data[3]} />} */}

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
