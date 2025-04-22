import { ChargingStation } from "./chargingStationsType";

export type GeocodeResult = {
  place_id: string;
  district: string;
  city: string;
  province: string;
  name: string;
  mark?: string;
  coordinate: { lat: number; lon: number };
};

export type Location = {
  ID: number;
  Name: string;
  Address: string;
  PlaceID: string;
  Mark: string;
  District: string;
  City: string;
  Province: string;
  Longitude: number;
  Latitude: number;
  ChargingStations: ChargingStation[];
  DeletedAt: any;
  CreatedAt: string;
  UpdatedAt: string;
};
