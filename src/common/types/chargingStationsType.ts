import { Device } from "./deviceType";
import { LocationResponse } from "./globalType";

export type ChargingStationBody = {
  page: number;
  limit: number;
  longitude?: number;
  latitude?: number;
  is_admin:boolean
};

export type AddEditChargingStation = {
  image: string;
  is_closed: boolean;
  is_parking_fee: boolean;
  name: string;
  operational_hours: OperationalHourBody[];
  phone: string;
  price_setting_id: number;
  admin_id: number;
  location_id: number;
  id?: number;
};

export type PriceTimeRuleProps = {
  ID: number;
  Name: string;
  From: string;
  To: string;
  PriceTimeSlotID: number;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

export type OperationalHourBody = {
  day: number;
  from: string;
  to: string;
  is_closed: boolean;
};

export type OperationalHour = {
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

export type Admin = {
  ID: number;
  Name: string;
  Email: string;
  Password: string;
  Role: number;
  PriceSettings: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
};



export type Socket = {
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

export type ChargingStation = {
  ID: number;
  Name: string;
  Image: string;
  Phone: string;
  IsParkingFee: boolean;
  IsClosed: boolean;
  PriceSettingID: number;
  AdminID: number;
  LocationID: number;
  Admin: Admin;
  Location: LocationResponse;
  OperationalHours: string | null;
  Devices: string | null;
  PriceSetting: PriceSetting;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

type PriceSetting = {
  ID: number;
  Name: string;
  AdminID: number;
  Admin: Admin;
  PriceTimeSlotID: number;
  PriceBaseRules: PriceBaseRule[];
  TimeSlot: TimeSlot;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};

export interface PriceBaseRule {
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
  PriceTimeRule: PriceTimeRuleProps;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface TimeSlot {
  ID: number;
  Name: string;
  PriceTimeRules: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
}

export type DataChargingStation = {
  ID: number;
  Name: string;
  Image: string;
  Phone: string;
  IsParkingFee: boolean;
  IsClosed: boolean;
  PriceSettingID: number;
  AdminID: number;
  LocationID: number;
  Admin: Admin;
  Location: LocationResponse;
  OperationalHours: OperationalHour[];
  Devices: Device[];
  PriceSetting: PriceSetting;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
};
