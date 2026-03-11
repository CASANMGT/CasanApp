export { };

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
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
  };

  type FormEditAccountProps = {
    name: string;
    phone: string;
    email: string;
    nik: string;
    simc: string;
    ktpImage: File | string | undefined;
    simcImage: File | string | undefined;
    kkImage: File | string | undefined;
  };

  type FormErrorEditAccountProps = {
    name?: string;
    phone?: string;
    email?: string;
    nik?: string;
    simc?: string;
  };

  type EditUserBodyProps = {
    email: string;
    kkimage: string;
    ktpimage: string;
    name: string;
    nik: string;
    phone: string;
    simcimage: string;
    simcno: string;
  };
}
