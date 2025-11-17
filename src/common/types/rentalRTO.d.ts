export {};

declare global {
  type RTOProps = {
    ID: number;
    Admin: AdminProps;
    UserID: number;
    VehicleID: number;
    Color: string;
    LicensePlate: string;
    LastUpdateLocationAt: string;
    Dealer: string;
    StartDate: string;
    CutOffTime: string;
    Notes: string;
    OverdueLimit: number;
    Deposit: number;
    OverdueCount: number;
    IsDeposited: boolean;
    PauseType: string;
    CreditPaid: number;
    CreditLeft: number;
    Payment: number;
    PauseDay: string;
    TargetFinishDate: string;
    Type: number;
    TotalPaid: number;
    Payment: number;
    DayCredits: RTOCreditProps[];
    PauseDayType: number;
    IsCreatedByAdmin: boolean;
    AdminID: number;
    CreatedAt: string;
    UpdatedAt: string;
    User: UserProps;
    Vehicle: VehicleProps;
    DeletedAt: string | null;
    NextPaymentDate: string | null;
    Status: number;
    isFromApprove?: boolean;
    Program: ProgramProps;
    ProgramID: number;
  };

  type RTOCreditProps = {
    ID: number;
    RTOSchemaID: number;
    DayCount: number;
    Price: number;
    DiscountRate: number;
    CreatedAt: string;
    UpdatedAt: string;
  };
}
