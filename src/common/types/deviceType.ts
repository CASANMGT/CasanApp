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
    ChargingStationID: string | null;
    SignalValue: number;
    TotalSocket: number;
    Protocol: number;
    VehicleType: number;
    Sockets: Socket[];
    ChargingStation: ChargingStation;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  };