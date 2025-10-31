
export { };

declare global {
  type VehicleModelProps = {
    ID: number;
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
}
