export {};

declare global {
  type Device = {
    ID: number;
    Name: string;
    PileNumber: string;
    IMEI: string;
    HardwareID: string;
    SoftwareID: string;
    Brand: string;
    Model: string;
    Notes: string;
    ChargingStationID: number;
    SignalValue: number;
    TotalSocket: number;
    MaxWatt: number;
    Rating: number;
    SocketRating: number;
    SIMCardID?: number;
    SIMCard: any;
    Protocol: number;
    Connection: number;
    VehicleType: number;
    CurrentType: number;
    PlugType: number;
    Integration: any;
    Type: number;
    Sockets: Socket[];
    ChargingStation: ChargingStation;
    EnergyDataID: number;
    EnergyData: any;
    IsActive: boolean;
    IsAvailable: boolean;
    DeletedAt: string | null;
    DeviceAvailable?: number[];
    DataSinkProvider: number;
    PartnerCode: string;
    CreatedAt: string;
    UpdatedAt: string;
    LastVisited: any;
    LastUpdatedHeartBeat: string;
  };
}
