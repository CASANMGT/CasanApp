export type FormSelectBank = {
  bankName: OptionsProps;
  accountNumber: string;
};

export type ValidateBankBody = {
  account_number: string;
  code: string;
  reference_id: string;
};

export type ValidateBankResponse = {
  is_verified: boolean;
  status: string;
  is_found: boolean;
  account_name: string;
};

export type AddBankAccountBody = {
  code: string;
  name?: string;
  number: string;
  otp_code: string;
  user_id?: number;
  channel: number;
};

export type BankAccountList = {
  ID: number;
  Code: string;
  Name: string;
  Number: string;
  UserID: number;
  DeletedAt: any;
  CreatedAt: string;
  UpdatedAt: string;
};
