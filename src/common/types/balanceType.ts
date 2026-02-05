export type Balance = {
  ID: number;
  UserID: number;
  User: UserProps;
  Amount: number;
  Status: number;
  SeasonID: number | null;
  CreatedAt: string;
  UpdatedAt: string;
  Notes: string;
};
