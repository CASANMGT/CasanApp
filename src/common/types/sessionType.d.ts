import { FeeSettingsProps } from "./feeSettingsType";
import { Transaction } from "./transactionType";
import { VoucherUsage } from "./voucherType";

export { };

declare global {
  type FormSession = {
    selectedSocket: number | undefined;
    selectedTab: string | number;
    paymentMethod?: FeeSettingsProps | undefined;
    voucher: OptionsProps | undefined;
    balance: number;
    phoneNumber: string;
    value: string;
    voltage: OptionsProps | undefined;
    ampere: OptionsProps | undefined;
  };

  type AddSessionBody = {
    id?: number;
    amount: number;
    paid_kwh: number;
    device_id: number;
    payment_method: string;
    session_method: number;
    socket_id: number;
    station_id: number;
    voucher_id: number[];
    wallet_used_amount: number;
  };

  type Session = {
    ChargingFee: number | string;
    ChargingStation: ChargingStation;
    ChargingStationID: number;
    CreatedAt: string;
    DeletedAt: string | null;
    Device: Device;
    DeviceID: number;
    DeviceStopReason: string | null;
    Duration: number;
    EndDiagnosticAt: string | null;
    ExpiredAt: string;
    ExpectedDuration: number;
    ID: number;
    IsIncludeTransactionFee: boolean;
    LastRemainingMinutes: number;
    LastUpdatedTimeRemainingMinutes: number | null;
    LatestWatt: number;
    MaxWatt: number;
    Method: number;
    Name: string;
    PriceSetting: PriceSetting;
    RefundAmount: number;
    Socket: Socket;
    SocketID: number;
    StartChargingTime: string | null;
    StartDiagnosticAt: string | null;
    Status: number;
    StopChargingTime: string | null;
    StopReason: string | null;
    TotalKwhUsed: number;
    PaidKWH: number;
    Transaction: Transaction;
    TransactionID: number;
    UpdatedAt: string;
    UsedAmount: number;
    User: UserProps;
    UserID: number;
    PriceType: number;
    VehicleType: number;
    VoucherUsages: VoucherUsage[] | null;
  };

  type ExportSessionBody = {
    end_date: string;
    fields: string[];
    start_date: string;
    station_ids?: number[];
    admin_ids?: number[];
  };

  type FormErrorExportSession = {
    startDate?: string;
    filterBy?: string;
    checkAll?: string;
  };

  type CalculateDurationOrEnergyBody = {
    id?: number;
    price_setting_id?: number;
    vehicle_type: number;
    watt?: number;
    total_charge?: number;
    charge?: number;
  };

  type CalculateChargeBody = {
    vehicle_type: number;
    watt: number;
    energy?: number;
    price_setting_id?: number;
    id?: number;
    duration?: number;
  };

  type CreateSessionItemProps = {
    value: string;
    form: FormSession;
    calculate: number;
    priceType?: number;
    onChange: (value: string) => void;
  };
}
