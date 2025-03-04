import { useEffect, useState } from "react";

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error?: string;
}

const GeocodeLocation: React.FC = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: null,
    error: undefined,
  });

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps API not loaded");
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation((prev) => ({ ...prev, latitude, longitude }));
          },
          (_) => {
            console.error("Can't get current location");
          }
        );
      } else {
        console.error("Geolocation not supported");
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <div>
      <h2>Geocoded Location</h2>
      {location.error ? (
        <p style={{ color: "red" }}>{location.error}</p>
      ) : (
        <p>
          Latitude: {location.latitude ?? "Loading..."} <br />
          Longitude: {location.longitude ?? "Loading..."} <br />
          Address: {location.address ?? "Fetching address..."}
        </p>
      )}
    </div>
  );
};

export default GeocodeLocation;
