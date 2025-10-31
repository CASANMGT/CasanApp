
export { };

declare global {
  type ChargingStationBody = {
    page: number;
    limit: number;
    longitude?: number;
    latitude?: number;
    is_admin: boolean;
  };

  type PriceTimeRule = {
    ID: number;
    Name: string;
    From: string;
    To: string;
    PriceTimeSlotID: number;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  };

  type OperationalHour = {
    ID: number;
    From: string;
    To: string;
    ChargingStationID: number;
    IsClosed: boolean;
    Day: number;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  };

  type Socket = {
    ID: number;
    Port: number;
    DeviceID: number;
    StartChargingTime: string | null;
    StopChargingTime: string | null;
    IsCharging: number;
    SessionStatus: number;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  };

  type PriceSetting = {
    ID: number;
    Name: string;
    AdminID: number;
    Admin: AdminProps;
    PriceTimeSlotID: number;
    PriceBaseRules: PriceBaseRule[];
    TimeSlot: TimeSlot;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    PJU: number;
    PPN: number;
    BikePriceType: number;
    CarBaseFare: number;
    BikeBaseFare: number;
    OtherFees: OtherFeesProps[];
  };

  interface PriceBaseRule {
    ID: number;
    VehicleType: number;
    From: number;
    To: number;
    PriceSettingID: number;
    PriceBaseTime: PriceBaseTime[];
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  }

  interface PriceBaseTime {
    PriceBaseRuleID: number;
    PriceTimeRuleID: number;
    Value: number;
    PriceTimeRule: PriceTimeRule;
    CreatedAt: string;
    UpdatedAt: string;
  }

  interface TimeSlot {
    ID: number;
    Name: string;
    PriceTimeRules: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
  }

  type ChargingStation = {
    ID: number;
    Name: string;
    Image: string;
    Phone: string;
    IsParkingFee: boolean;
    IsClosed: boolean;
    PriceSettingID: number;
    AdminID: number;
    LocationID: number;
    Location: LocationResponse;
    Admin: AdminProps;
    OperationalHours: OperationalHour[];
    Devices: Device[] | null;
    PriceSetting: PriceSetting;
    DeletedAt: string | null;
    CreatedAt: string;
    UpdatedAt: string;
  };

  type OtherFeesProps = {
    ID: number;
    Type: number;
    Name: string;
    Value: number;
    PriceSettingID: number;
    CreatedAt: string;
    UpdatedAt: string;
  };
}
