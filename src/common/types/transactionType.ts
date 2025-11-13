
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
  User: UserProps;
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
  ExpiredAt: string;
  CreatedAt: string;
  UpdatedAt: string;
  MilestoneDiscount: number;
  TotalFare: number;
  PaymentMethodFee: number;
  BaseFare: number;
  NetCharge: number;
};
