export type DataUser = {
  ID: number;
  Name: string;
  Phone: string;
  IsVerified: boolean;
  Email: string;
  Balance: number;
  Status: number;
  WithdrawPIN: string;
  WithdrawPINCooldownUntil: string
  WithdrawPINFailedAttempts: number
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};
