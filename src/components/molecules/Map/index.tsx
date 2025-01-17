import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { memo, useCallback, useState } from "react";
import { CoordinateProps } from "../../../common";
import CustomMarkerMap from "./CustomMarkerMap";
import { div } from "framer-motion/client";

interface MapProps {}

const Map: React.FC<MapProps> = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const center: CoordinateProps = {
    lat: -6.301432551514826,
    lng: 106.68551902294831,
  };

  const onLoad = useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={10}
      options={{ disableDefaultUI: true }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* <CustomMarkerMap center={center} /> */}

      <Marker
        position={center}
        label={{
          text: "1", // Text inside the marker
          color: "#1A1A1A", // Text color
          fontSize: "18px",
          fontWeight: "500",
        }}
        icon={{
          path: google.maps.SymbolPath.CIRCLE, 
          scale: 17, 
          fillColor: "#EDD22D", 
          fillOpacity: 1, 
          strokeColor: "#FAF2C0", 
          strokeWeight: 2, 
        }}
      />
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
};

export default memo(Map);
