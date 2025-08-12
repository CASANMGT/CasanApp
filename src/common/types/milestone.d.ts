export {};

declare global {
  type Milestone = {
    ID: number;
    Name: string;
    MinCO2Saved: number;
    RewardType: number;
    DiscountPercent: number;
    VoucherID: number;
    Voucher: Voucher;
    CreatedAt: string;
    UpdatedAt: string;
  };
}
