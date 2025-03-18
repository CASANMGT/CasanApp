import { DataUser } from "./userType";

export type Balance = {
  ID: number;
  UserID: number;
  User: DataUser;
  Amount: number;
  Status: number;
  SeasonID: number | null;
  CreatedAt: string;
  UpdatedAt: string;
};
