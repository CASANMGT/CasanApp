import { ChargingStation, Socket } from "./chargingStationsType";

export type Device = {
  ID: number;
  Name: string;
  PileNumber: string;
  IMEI: string;
  HardwareID: string;
  SoftwareID: string;
  Brand: string;
  Model: string;
  ChargingStationID: number;
  SignalValue: number;
  TotalSocket: number;
  Protocol: number;
  VehicleType: number;
  MaxWatt: number;
  Rating: number;
  SocketRating: number;
  Sockets: Socket[];
  ChargingStation: ChargingStation;
  DeletedAt: any;
  CreatedAt: string;
  UpdatedAt: string;
  LastUpdatedHeartBeat: string;
};
