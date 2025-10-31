export {};

declare global {
  type ProgramProps = {
    ID: number;
    Name: string;
    BannerURL: string;
    Dealers: DealerProps[];
    Vehicles: VehicleProgramProps[];
    OverdueLimit: number;
    CutOffTime: string;
    WeeklyPauseDay: string;
    MonthlyPause: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
  };

  type DealerProps = {
    ID: number;
    ProgramID: number;
    AdminID: number;
    Admin: AdminProps;
  };

  type VehicleProgramProps = {
    ID: number;
    ProgramID: number;
    VehicleModelID: number;
    VehicleModel: VehicleModelProps;
    PaymentPlans: PaymentPlanProps[];
  };

  type PaymentPlanProps = {
    ID: number;
    ProgramVehicleID: number;
    Type: number;
    Deposit: number;
    Payment: number;
    Credits: CreditProps[];
  };

  type CreditProps = {
    ID: number;
    PaymentPlanID: number;
    PaymentPlan: PaymentPlanProps;
    Duration: number;
    Price: number;
    Discount: number;
  };
}
