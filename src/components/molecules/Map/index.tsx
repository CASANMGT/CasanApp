import { MapContainer, TileLayer } from "react-leaflet";

interface MapProps {}
export type LatLng = [number, number];

export const centerPosition: LatLng = [-6.301432551514826, 106.68551902294831];

const Map: React.FC<MapProps> = () => {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={centerPosition}
        zoom={13}
        className="h-full w-full !z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
};

export default Map;
