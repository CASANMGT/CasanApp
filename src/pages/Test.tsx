import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { createRoot } from "react-dom/client";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [30, 41],
  iconAnchor: [15, 41],
});

interface CustomPopupProps {
  price: number;
  available: number;
}

interface CustomPopupProps {
  price: number;
  available: number;
}

const CustomPopup: React.FC<CustomPopupProps> = ({ price, available }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 min-w-[140px] text-gray-800 relative">
      {/* Price */}
      <div className="text-lg font-bold">
        <span className="text-gray-500 text-sm">Rp </span>
        <span className="text-2xl font-extrabold">{price}</span>/jam
      </div>

      {/* Availability */}
      <div className="flex items-center mt-1 text-sm">
        <span className="text-gray-600">Tersedia</span>
        <span className="ml-1 font-bold text-[#3DAFBC]">{available}</span>
      </div>

      {/* Arrow Indicator */}
      <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
    </div>
  );
};

const createPopupDivIcon = (price: number, available: number) => {
  const div = document.createElement("div");
  const root = createRoot(div);
  root.render(<CustomPopup price={price} available={available} />);

  return L.divIcon({
    html: div,
    className: "custom-popup", // Tailwind doesn't apply here, but we style inside the component
    iconSize: [120, 50], // Adjust to fit content
  });
};

const Map = () => {
  const position: [number, number] = [-6.301432551514826, 106.68551902294831]; // Example: London

  return (
    <div className="w-[300px] h-[600px]">
      <MapContainer center={position} zoom={13} className="h-full w-full !z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position} icon={createPopupDivIcon(600, 4)} />
      </MapContainer>
    </div>
  );
};

function App() {
  return (
    <div className="bg-red p-4 h-screen" style={{ padding: "20px" }}>
      <h1>React Leaflet Map</h1>
      <Map />
    </div>
  );
}

export default App;
