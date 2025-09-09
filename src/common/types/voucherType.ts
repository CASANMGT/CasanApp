import { ChargingStation } from "./chargingStationsType";

export type FormVoucher = {
  voucherName: string;
  providedBy: string | number;
  image: File | string | undefined;
  startPeriod: Date | null;
  endPeriod: Date | null;
  isNoEndPeriod: boolean;
  description: string;
  chargingStation: OptionsProps[];
  chargingStationTotal: string;
  isUnlimited: boolean;
  targetMarket: string;
  isAvailableQR: boolean;
  minimumCharging: string;
  voucherType: string;
  discountType: string;
  discountValue: string;
  productExpireAfter: string;
  productExpireAfterType: string | number;
};

export type FormErrorVoucher = {
  voucherName?: string;
  providedBy?: string;
  image?: string;
  startPeriod?: string;
  description?: string;
  chargingStation?: string;
  minimumCharging?: string;
  voucherType?: string;
  discountValue?: string;
  productExpireAfter?: string;
};

export type AddEditVoucher = {
  id?: number;
  available_to_qr_scan_only: boolean;
  charging_station_ids: number[];
  charging_station_total_usage: number;
  description: string;
  discount_type: number;
  discount_value: number;
  end_date: string | null;
  minimum_charging: number;
  no_end_period: boolean;
  product_expired_after_in_min: number;
  provided_by: number;
  start_date: string;
  target_market: number;
  unlimited_usage: boolean;
  voucher_name: string;
  voucher_thumbnail_url: string;
  voucher_type: number;
};

export type PublishVoucher = {
  id: number;
  is_publish: boolean;
};

export type Voucher = {
  ID: number;
  VoucherName: string;
  ProvidedBy: number;
  VoucherThumbnailURL: string;
  StartDate: string;
  EndDate: string | null;
  NoEndPeriod: boolean;
  Description: string;
  ChargingStations: ChargingStation[];
  ChargingStationTotalUsage: number | null;
  UnlimitedUsage: boolean;
  TargetMarket: number;
  AvailableToQRScanOnly: boolean;
  MinimumCharging: number;
  VoucherType: number;
  TotalUsed: number;
  DiscountType: number;
  DiscountValue: number;
  ProductExpiryAfterInMin: number;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  IsPublish: boolean;
};

export type VoucherUsage = {
  ID: number;
  VoucherID: number;
  Voucher: Voucher;
  UserID: number;
  SessionID: number;
  StationID: number;
  ChargingStation: ChargingStation;
  UsedAt: string;
  VoucherDetails: Voucher;
  Session: Session;
  IsClaimed: boolean;
  Status: number;
  VoucherType: number;
  ProductExpiredAt: string | null;
  RedeemedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};


export type BodyVoucherUsage = {
  page: number;
  limit: number;
  user_id: number;
};
