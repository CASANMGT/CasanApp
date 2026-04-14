import { useEffect, useState } from "react";
import { getCurrentLocation } from "../services/ApiAddress";

export type RTOExplorePositionStatus = "idle" | "loading" | "ok" | "denied";

/**
 * Lokasi pengguna untuk jarak & urutan cabang/program RTO terdekat.
 */
export function useRTOExploreUserPosition() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [status, setStatus] = useState<RTOExplorePositionStatus>("idle");

  useEffect(() => {
    setStatus("loading");
    getCurrentLocation()
      .then(([latitude, longitude]) => {
        setLat(latitude);
        setLng(longitude);
        setStatus("ok");
      })
      .catch(() => {
        setStatus("denied");
      });
  }, []);

  const hasPosition = lat != null && lng != null;
  return { lat, lng, status, hasPosition };
}
