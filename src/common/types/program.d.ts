export {};

/** Minimal stubs for nested program structures (extend when API shapes are finalized). */
declare global {
  type DealerProps = {
    ID?: number;
    Name?: string;
    Address?: string;
    Phone?: string;
    [key: string]: unknown;
  };

  type VehicleProgramProps = {
    ID?: number;
    Name?: string;
    ModelName?: string;
    [key: string]: unknown;
  };

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
