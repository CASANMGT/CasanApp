import { FaRegCalendarCheck } from "react-icons/fa6";
import { IcBike, IcBike2 } from "../../assets";
import { Separator } from "../../components";
import { moments } from "../../helpers";

interface Props {
  data: RentalProps;
  position: number;
  onClick: () => void;
}

const CardRental: React.FC<Props> = ({ data, position, onClick }) => {
  const status = data?.Status;
  const vehicle: VehicleProps = data?.Vehicle;
  const color: ColorVehicleModelProps | null = vehicle.Colors?.[0] ?? null;
  const vehicleModel: VehicleModelProps = vehicle?.VehicleModel;
  let daysLeft: number = 0;

  if (status === 3 || status === 4) {
    daysLeft = moments(data?.StartDate)
      .add(data?.DurationDays, "days")
      .diff(moments(), "days");
  }

  const formatted = getFormatted(status);
  const isShowRTO: boolean = status === 3;

  return (
    <div
      onClick={onClick}
      className="relative rounded-lg bg-white shadow p-3 mx-4 mb-3 cursor-pointer"
      style={{ marginTop: position === 0 ? 24 : 0 }}
    >
      <div className="row gap-3">
        <img src="" alt="" />
        {color?.ImageURL ? (
          <img
            src={color?.ImageURL}
            alt="Vehicle"
            className="w-[50px] h-[50px] rounded-md"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-black10 rounded-md center">
            <IcBike2 />
          </div>
        )}

        <div className="flex flex-col">
          <span className="font-medium">{`${data?.Admin?.Name || "-"} Seri ${vehicleModel?.ModelName || "-"}`}</span>
          <span className="text-xs text-black90">
            {`${vehicleModel.BatteryCapacity || 0}W ${
              vehicleModel?.Volt || 0
            }V ${vehicleModel?.Ampere || 0}Ah (estimasi ${
              vehicleModel?.Range || 0
            }km)`}
          </span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="row">
        {status === 2 || status === 10 ? (
          <div className="rounded-full w-9 h-9 center bg-black10">
            {status === 2 ? (
              <FaRegCalendarCheck className="text-primary100" />
            ) : (
              <IcBike className="text-black50" />
            )}
          </div>
        ) : (
          <div
            className={`center flex-col px-2.5 py-1 rounded-sm bg-${
              status == 3 ? "primary10" : "lightRed"
            }`}
            style={{
              backgroundColor: status === 3 ? "#E8F7F8" : "#FCEEF0",
            }}
          >
            <span
              className={`text-[10px] font-medium text-${
                status === 3 ? "black100" : "red"
              }`}
            >
              {status === 3 ? "Tesisa" : "Tenggat"}
            </span>
            <span
              className={`font-semibold `}
              style={{
                color: status === 3 ? "#2dba9d" : "#DD2E44",
              }}
            >
              {daysLeft}H
            </span>
          </div>
        )}

        <div className="ml-3">
          <div className="row gap-1">
            {isShowRTO && (
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#2DBA9D] to-[#327478]">
                SEWA
              </span>
            )}
            <span className={`font-medium text-${formatted.color}`}>
              {formatted?.label}
            </span>
          </div>

          {(status == 2 || status == 10) && (
            <div className="row gap-1 font-medium">
              <span className="text-xs text-black100">
                {moments(
                  status === 10 ? data?.ReturnDate : data?.StartDate,
                ).format("DD MMMM YYYY")}
              </span>
              <span className="text-xs font-normal text-black70">{`${status === 10 ? moments(data?.ReturnDate).format("HH:mm") : data?.BookTime} WIB`}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg px-3 py-1 text-xs font-medium text-white bg-gradient-to-b from-[#2DBA9D] to-[#327478]">
        SEWA
      </div>
    </div>
  );
};

export default CardRental;

const getFormatted = (status: number) => {
  let label: string = "";
  let labelLeft: string = "Tenggat";
  let color: string = "blackBold";
  let bgColor: string = "lightRed";

  switch (status) {
    case 2:
      label = "Booking Telah Dijadwalkan";
      break;

    case 3:
      label = "Berlangsung";
      labelLeft = "Tersisa";
      bgColor = "primary10";
      break;

    case 4:
      label = "Tenggat Waktu";
      break;

    case 10:
      label = "Dikembalikan";
      break;

    default:
      labelLeft = "";
      color = "";
      bgColor = "";
      break;
  }

  return {
    label,
    labelLeft,
    color,
    bgColor,
  };
};
