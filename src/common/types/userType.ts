export type DataUser = {
  ID: number;
  Name: string;
  Phone: string;
  IsVerified: boolean;
  Email: string;
  Balance: number;
  Status: number;
  WithdrawPIN: string;
  BankAccounts: any;
  WithdrawPINFailedAttempts: number;
  WithdrawPINCooldownUntil: any;
  VoucherUsages: any;
  TotalCO2Saved: number;
  MilestoneID: number;
  Milestone: Milestone;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: any;
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
