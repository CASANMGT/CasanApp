import { BankAccountList } from "./bankType";

export type AddWithdrawBody = {
  amount: number;
  bank_account_id: number;
  remark?: string;
  user_id?: number;
};

export type WithdrawList = {
  ID: number;
  UserID: number;
  User: UserProps;
  BankAccountID: number;
  Amount: number;
  Fee: number;
  Total: number;
  Remark: string;
  Status: number;
  BankAccount: BankAccountList;
  DeletedAt: string | null;
  CreatedAt: string;
  UpdatedAt: string;
  isSelect?: boolean;
  isCheckboxDisabled?: boolean;
};
