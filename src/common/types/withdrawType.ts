export type AddWithdrawBody = {
  amount: number;
  bank_account_id: number;
  remark?: string;
  user_id?: number;
};
