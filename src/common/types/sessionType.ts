import { FeeSettingsProps } from "./feeSettingsType";

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
  voltage: string | number;
  ampere: string | number;
  selectedSocket: number | undefined;
  selectedTab: string;
  nominal: string;
  time: string;
  paymentMethod?: FeeSettingsProps | undefined;
};

export type AddSessionBody = {
  amount: number;
  device_id: number;
  payment_method: string;
  session_method: number;
  socket_id: number;
  station_id: number;
  wallet_used_amount: number;
};
