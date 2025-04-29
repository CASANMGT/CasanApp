import { FeeSettingsProps } from "../common";

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

type Coordinates = { lat?: number; lon?: number } | [number, number];

export const getDistanceFromLatLonInKm = (
  start?: Coordinates,
  end?: Coordinates
): number => {
  if (!start || !end) return 0;

  let latStart: number | undefined;
  let lonStart: number | undefined;
  let latEnd: number | undefined;
  let lonEnd: number | undefined;

  if (Array.isArray(start)) {
    latStart = start[0];
    lonStart = start[1];
  } else {
    latStart = start.lat;
    lonStart = start.lon;
  }

  if (Array.isArray(end)) {
    latEnd = end[0];
    lonEnd = end[1];
  } else {
    latEnd = end.lat;
    lonEnd = end.lon;
  }

  if (
    latStart === undefined ||
    lonStart === undefined ||
    latEnd === undefined ||
    lonEnd === undefined
  )
    return 0;

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(latStart - latEnd);
  const dLon = deg2rad(lonStart - lonEnd);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latStart)) *
      Math.cos(deg2rad(latEnd)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return isNaN(d) ? 0 : parseFloat(d.toFixed(0));
};

export const checkCalculationPaymentMethod = (
  nominal: number,
  data?: FeeSettingsProps
) => {
  let value: number = 0;
  let fee: number = 0;

  if (data?.priceType === "percentage") 
    fee = (nominal * Number(data?.value || 0)) / 100;
   else 
    fee = Number(data?.value || 0);
  

  value = nominal + fee;

  return { total: value, fee };
};
