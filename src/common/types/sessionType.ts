import { ChargingStation, Socket } from "./chargingStationsType";
import { Device } from "./deviceType";
import { FeeSettingsProps } from "./feeSettingsType";
import { MetaResponseProps, OptionsProps } from "./globalType";
import { Transaction } from "./transactionType";
import { DataUser } from "./userType";

export type SessionListResponse = {
  status: string;
  message: string;
  data: Session[];
  meta: MetaResponseProps;
};

export type SessionListBody = {
  page: number;
  limit: number;
  is_finish?: number;
};

export interface SessionSettingProps {
  data: SessionProps | null;
  loading: boolean;
  error: string | null;
}

export interface SessionProps {
  header: SessionHeaderProps;
  signalValue: number;
  temperature: number;
  totalPortCount: number;
  portStatus: number[];
}

export interface SessionHeaderProps {
  length: number;
  seq: number;
  encrypted: boolean;
  frameId: string;
}

export type FormSession = {
  voltage: OptionsProps | undefined;
  ampere: OptionsProps | undefined;
  selectedSocket: number | undefined;
  selectedTab: string;
  nominal: string;
  time: string;
  paymentMethod?: FeeSettingsProps | undefined;
  phoneNumber: string;
  balance: number;
  voucher: OptionsProps | undefined;
};

export type AddSessionBody = {
  amount: number;
  device_id: number;
  payment_method: string;
  session_method: number;
  socket_id: number;
  station_id: number;
  voucher_id: number[];
  wallet_used_amount: number;
};

export type Session = {
  ID: number;
  Name: string;
  UserID: number;
  User: DataUser;
  ChargingStationID: number;
  ChargingStation: ChargingStation;
  DeviceID: number;
  Device: Device;
  TransactionID: number;
  Transaction: Transaction;
  SocketID: number;
  Socket: Socket;
  Method: number;
  Status: number;
  MaxWatt: number;
  IsIncludeTransactionFee: boolean;
  PriceSetting: string | null;
  Duration: number;
  ExpectedDuration: number;
  RefundAmount: number;
  UsedAmount: number;
  StartChargingTime: string | null;
  StopChargingTime: string | null;
  TotalKwhUsed: number;
  ChargingFee: string | null;
  DeletedAt: string | null;
  ExpiredAt: string;
  CreatedAt: string;
  UpdatedAt: string;
};
