import { DataUser } from "./userType";

export type Balance = {
  ID: number;
  UserID: number;
  User: DataUser;
  Amount: number;
  Status: number;
  CreatedAt: string;
  UpdatedAt: string;
};
