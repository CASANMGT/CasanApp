import { ChargingStation } from "./chargingStationsType";
import { Simcard } from "./simcardType";

export {};

declare global {
  type VehicleProps = {
    Admin: AdminProps;
    AdminID: number;
    BatteryNumber: string;
    BookingStatus: number;
    BPKB: string;
    ChargingStation: ChargingStation;
    ChargingStationID: number;
    Colors: ColorVehicleModelProps[];
    Condition: number;
    Connection: string;
    EngineNumber: string;
    FrameNumber: string;
    GPSVendor: number;
    ID: number;
    IOTTracker: string;
    IsMobilizer: boolean;
    IsRental: boolean;
    IsRTO: boolean;
    LastUpdateLocationAt: string;
    Latitude: number;
    License: string;
    LicensePlate: string;
    Location: any;
    LocationID: number;
    Longitude: number;
    MinimumPrice: string;
    PositionAddr: string;
    PositionCity: string;
    Program: ProgramProps;
    ProgramID: number;
    SIMCard: Simcard;
    SIMCardID: number;
    STNK: string;
    UploadBPKB: string;
    UploadSTNK: string;
    VehicleModel: VehicleModelProps;
    VehicleModelID: number;
    VehicleStatus: number;
  };
  
  type VehicleModelProps = {
    ID: number;
    Ampere: number;
    Volt: number;
    AdminID: number;
    ModelName: string;
    Category: number;
    BatteryCapacity: number;
    MotorPower: number;
    Range: number;
    MaxSpeed: number;
    Colors: ColorVehicleModelProps[];
    TotalStock: number;
    Admin: AdminProps;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    VehicleBrand: VehicleBrandProps;
    VehicleBrandID: number;
  };

   type ColorVehicleModelProps = {
    ID: number;
    VehicleModelID: number;
    ColorName: string;
    HexCode: string;
    ImageURL: string;
    CreatedAt: string;
    UpdatedAt: string;
  };

  type VehicleBrandProps = {
    ID: number;
    Name: string;
    Logo: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
  };
}
