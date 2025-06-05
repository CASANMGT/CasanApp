export type FeeSettingsProps = {
  key: string;
  icon: any;
  label: string;
  priceType: string;
  value: string;
  disabled?: boolean;
};

export type FeeSettingsResponseProps = {
  Code: string;
  Name: string;
  IsPercentage: boolean;
  Value: number;
  IsActive: boolean;
  ExternalCode: string;
  IsWithdraw: boolean;
  IsEWallet: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};
