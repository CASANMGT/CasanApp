export {};

declare global {
  type Device = {
    ID: number;
    Name: string;
    PileNumber: string;
    IMEI: string;
    HardwareID: string;
    SoftwareID: string;
    Brand: number | null;
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
}
