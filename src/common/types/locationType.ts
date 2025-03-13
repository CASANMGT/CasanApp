export type GeocodeResult = {
    place_id: string;
    district: string;
    city: string;
    province: string;
    name: string;
    mark?: string;
    coordinate: { lat: number; lon: number };
  };