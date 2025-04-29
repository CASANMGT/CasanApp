import { Session } from "./sessionType";
import { DataUser } from "./userType";

export type AddTransactionBody = {
  amount: number;
  payment_method: string;
  type: number;
  user_id?: number;
  wallet_used_amount: number;
};

export type DataTransaction = {
  Transaction: Transaction;
  Session: Session;
};

export type Transaction = {
  ID: number;
  UserID: number;
  User: DataUser;
  DueAmount: number;
  Amount: number;
  WalletUsedAmount: number;
  TotalFee: number;
  Type: number;
  Status: number;
  SessionID: number | null;
  Session: Session;
  RefTransactionID: string | null;
  PaymentMethod: string;
  DeepLinkRedirectURL: string;
  GeneratedQRCodeURL: string;
  CreatedAt: string;
  UpdatedAt: string;
};
