import { BankAccountList } from "./bankType";
import { VoucherUsage } from "./voucherType";

export {};

declare global {
  type UserProps = {
    ID: number;
    Name: string;
    Phone: string;
    IsVerified: boolean;
    Email: string;
    Balance: number;
    Status: number;
    WithdrawPIN: string | null;
    BankAccounts: BankAccountList[];
    WithdrawPINFailedAttempts: number;
    WithdrawPINCooldownUntil: string | null;
    CreatedAt: string;
    UpdatedAt: string;
    TotalCO2Saved: number;
    DeletedAt: string | null;
    MilestoneID: number;
    Milestone: Milestone;
    NIK: string;
    VoucherUsages: VoucherUsage;
    SIMCNo: string;
    KTPImage: string;
    SIMCImage: string;
    KKImage: string;
  };

  type AdminProps = {
    ID: number;
    Name: string;
    Email: string;
    Password: string;
    Role: number;
    PriceSettings: string | null;
    ChargingStations: ChargingStation[];
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Type: number;
    ManufactureAdminID: string | null;
    ManufactureAdmin: string | null;
    CreatedByAdminID?: number;
    TotalKwh: number;
    Logo: string;
  };
}
