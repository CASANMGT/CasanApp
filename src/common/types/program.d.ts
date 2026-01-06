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
    IsActive: boolean;
    MonthlyPause: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
  };
}
