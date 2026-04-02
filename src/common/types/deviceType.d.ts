export { };

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
    Type: number;
    Integration: number | null;
    VehicleType: number;
    MaxWatt: number;
    Rating: number;
    SocketRating: number;
    Sockets: Socket[];
    IsActive: boolean;
    ChargingStation: ChargingStation;
    DeletedAt: any;
    CreatedAt: string;
    UpdatedAt: string;
    LastUpdatedHeartBeat: string;
  };
}
