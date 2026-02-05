import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ILOrderEmpty } from "../../assets";
import { ERROR_MESSAGE } from "../../common";
import { Button, EmptyList, LoadingPage } from "../../components";
import { useAuth } from "../../context/AuthContext";
import CardRental from "./CardRental";
import { Api } from "../../services";

interface MetaResponseRentalProps {
  Approved: number;
  Finished: number;
  Holiday: number;
  Ongoing: number;
  Overdue: number;
  Rejected: number;
  Returned: number;
  Scheduled: number;
  Suspended: number;
  Terminated: number;
  Verifying: number;
  limit: number;
  page: number;
  pages: number;
  total: number;
}

interface ResponseProps {
  status: string;
  message: string;
  data: RentalProps[];
  meta: MetaResponseRentalProps;
}

const ScheduleRTO = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [data, setData] = useState<ResponseProps>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [page, limit]);

  const getData = async (p?: number, l?: number, q?: string) => {
    try {
      const res = await Api.get({
        url: "rentals",
        params: {
          statuses: "2",
          page: p || page,
          limit: l || limit,
          q,
        },
      });

      setData(res);
    } catch (error: any) {
      if (error?.response?.data?.message === "invalid token") {
        logout();
        navigate("login", { replace: true });
      } else alert(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingPage loading={loading} color="primary100">
      <div className="mb-[100px]">
        {data?.data && data?.data.length ? (
          data?.data.map((item: RentalProps, index: number) => (
            <CardRental
              key={index}
              data={item}
              position={index}
              onClick={() => navigate(`/rental-details/${item?.ID}`)}
            />
          ))
        ) : (
          <div className="mx-10">
            <EmptyList
              image={ILOrderEmpty}
              title="Belum ada riwayat sewa"
              description="Ayo sewa kendaraan lewat Casan!"
            />

            <Button
              label="Mulai Sewa"
              iconRight={FaArrowRight}
              sizeIconRight={14}
              onClick={() => {}}
              className="mx-"
            />
          </div>
        )}
      </div>
    </LoadingPage>
  );
};

export default ScheduleRTO;

const dataSample = {
  ID: 145,
  UserID: 2,
  User: {
    ID: 2,
    Name: "Akun Tester",
    Phone: "+62812222222",
    IsVerified: true,
    Email: "superadmin@casan.id",
    Balance: 46965949,
    Status: 1,
    WithdrawPIN: "$2a$10$I3I5.sQ2rF9y0bRggFM/euI/CUXBW2EVLqm.oMbsJWvhx6EoKumZm",
    BankAccounts: null,
    WithdrawPINFailedAttempts: 0,
    WithdrawPINCooldownUntil: null,
    VoucherUsages: null,
    TotalCO2Saved: 47.8305,
    MilestoneID: 6,
    Milestone: null,
    NIK: "1234123412341234",
    SIMCNo: "1234123412341234",
    KTPImage:
      "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2FScreenshot_20.png?alt=media\u0026token=e37e6a1b-d1ee-4501-be01-2673b997347f",
    SIMCImage:
      "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2FScreenshot_21.png?alt=media\u0026token=1bac184d-f2e4-4c7a-9fb9-4f66312a2378",
    KKImage:
      "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2FScreenshot_22.png?alt=media\u0026token=487922a9-25b8-40e2-9d0c-820a80677935",
    PartnerID: null,
    CreatedAt: "2025-04-15T07:00:36.613241Z",
    UpdatedAt: "2026-02-04T07:52:01.30298Z",
    DeletedAt: null,
  },
  VehicleID: 122,
  Vehicle: {
    ID: 122,
    AdminID: 33,
    Admin: null,
    LocationID: 23,
    Location: null,
    ChargingStationID: 27,
    ChargingStation: {
      ID: 27,
      Name: "Zeho Testing",
      Image: "",
      Infrastructure: "",
      Phone: "+620000",
      IsParkingFee: false,
      IsClosed: false,
      PriceSettingID: 12,
      AdminID: 33,
      LocationID: 23,
      IsChargingStation: true,
      IsRental: false,
      IsVisibleToUser: true,
      IGLink: "",
      TikTokLink: "",
      Admin: null,
      Location: null,
      OperationalHours: null,
      Sessions: null,
      Devices: null,
      Vouchers: null,
      PriceSetting: null,
      DeletedAt: null,
      CreatedAt: "2026-01-08T04:01:42.95174Z",
      UpdatedAt: "2026-01-13T03:54:30.863129Z",
      Brand: 1,
    },
    VehicleModelID: 19,
    VehicleModel: {
      ID: 19,
      VehicleBrandID: 7,
      VehicleBrand: null,
      ModelName: "ZEEHO AE8",
      Category: 1,
      BatteryCapacity: 4,
      MotorPower: 4,
      Range: 120,
      Ampere: 100000,
      Volt: 15,
      BatteryType: 1,
      MaxSpeed: 120,
      Colors: null,
      Vehicles: null,
      TotalStock: 56,
      CreatedAt: "2026-01-08T04:05:50.046077Z",
      UpdatedAt: "2026-01-08T04:05:50.046077Z",
      DeletedAt: null,
    },
    LicensePlate: "",
    Colors: [
      {
        ID: 283,
        VehicleID: 122,
        ColorName: "Black",
        HexCode: "#000000",
        ImageURL:
          "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2Flogo%20zeho.png?alt=media\u0026token=5114a2b0-7467-4566-abf1-ce6c114cc7d6",
      },
    ],
    Condition: 1,
    IsRental: true,
    IsRTO: true,
    ProgramID: 21,
    Program: null,
    VehicleStatus: 4,
    BookingStatus: 4,
    FrameNumber: "",
    EngineNumber: "",
    BatteryNumber: "",
    STNK: "",
    BPKB: "",
    UploadSTNK: null,
    UploadBPKB: null,
    SIMCardID: null,
    SIMCard: null,
    IOTTracker: null,
    GPSVendor: 1,
    Connection: "Offline",
    MinimumPrice: "",
    PricePerDay: "",
    Longitude: null,
    Latitude: null,
    PositionAddr: "",
    PositionCity: "",
    IsMobilizer: true,
    LastUpdateLocationAt: null,
    CreatedAt: "2026-01-08T07:10:03.690064Z",
    UpdatedAt: "2026-02-02T09:16:57.79717Z",
    DeletedAt: null,
  },
  ProgramID: 21,
  Program: {
    ID: 21,
    Name: "Testing Endi",
    BannerURL:
      "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2Flogo%20zeho.png?alt=media\u0026token=6f08edc9-79e8-484f-ac60-4cf89ce3fe12",
    Dealers: null,
    Vehicles: null,
    OverdueLimit: 1,
    CutOffTime: "12:00",
    WeeklyPauseDay: "6",
    MonthlyPause: "1",
    IsActive: true,
    CreatedAt: "2026-01-08T04:07:45.250865Z",
    UpdatedAt: "2026-01-19T05:41:16.588166Z",
    DeletedAt: null,
  },
  Color: "Black",
  LicensePlate: "",
  Dealer: "Zeho Main Dealer",
  StartDate: "2026-02-01T17:00:00Z",
  CutOffTime: "12:00",
  OverdueLimit: 1,
  Deposit: 50000,
  PauseDay: "",
  Type: 1,
  Payment: 360,
  DayCredits: [
    {
      ID: 304,
      RTOSchemaID: 145,
      DayCount: 1,
      Price: 75000,
      DiscountRate: 0,
      CreatedAt: "2026-02-02T09:16:54.128582Z",
      UpdatedAt: "2026-02-02T09:16:54.128582Z",
    },
  ],
  RTOHolidays: [],
  RTOTransactions: null,
  PauseDayType: 2,
  IsCreatedByAdmin: true,
  TotalPaid: 0,
  AdminID: 33,
  Admin: {
    ID: 33,
    Name: "Zeho Main Dealer",
    Email: "zeho@gmail.com",
    Password: "$2a$10$69XoAMqw264TaZ5x66asNOnK5RbFCnCEFXZt3r24aNc3hFRB/2zWu",
    Logo: "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2Flogo%20zeho.png?alt=media\u0026token=10b92812-fc55-4b86-845b-030dae3c2e77",
    Role: 2,
    Type: 1,
    PriceSettings: null,
    ChargingStations: null,
    ManufactureAdminID: null,
    ManufactureAdmin: null,
    CreatedByAdminID: 1,
    TotalKwh: 0,
    CreatedAt: "2026-01-08T03:54:58.356413Z",
    UpdatedAt: "2026-01-23T03:29:28.216991Z",
    DeletedAt: null,
  },
  Status: 7,
  IsDeposited: false,
  DepositTransactionID: null,
  CreditPaid: 0,
  CreditLeft: 0,
  TargetFinishDate: "2027-01-27T17:00:00Z",
  NextPaymentDate: "2026-02-07T05:00:00Z",
  HasPaidInstallment: true,
  Notes: "",
  HasSelectRTOSchema: true,
  ReviewByAdminID: null,
  OverdueCount: 2,
  NotifOverdueCount: 0,
  CreatedAt: "2026-02-02T09:16:54.124502Z",
  UpdatedAt: "2026-02-04T05:01:00.025912Z",
  DeletedAt: null,
};
