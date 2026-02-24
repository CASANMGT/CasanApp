export { };

declare global {
  type RentalProps = {
    ID: number;
    UserID: number;
    User: UserProps;
    VehicleID: number;
    Vehicle: VehicleProps;
    AdminID: number;
    Admin: AdminProps;
    TransactionID: number;
    Transaction: Transaction;
    DurationDays: number;
    BookTime: string;
    StartDate: string;
    ReturnDate: string;
    OverdueCount: number;
    Status: number;
    Notes: string;
    ReviewByAdminID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
  };

  type RentalTransactionProps = {
    ID: number;
    UserID: number;
    User: UserProps;
    RentalID: number;
    Rental: RentalProps;
    PricePerDay: number;
    Amount: number;
    DueAmount: number;
    WalletUsedAmount: number;
    PaymentMethodFee: number;
    VoucherDiscount: number;
    PaymentMethod: string;
    PaymentProof: string;
    Status: number;
    DeepLinkRedirectURL: string;
    GeneratedQRCodeURL: string;
    CreatedAt: string;
    UpdatedAt: string;
    ExpiredAt: string | null;
    DeletedAt: string | null;
  };
}
