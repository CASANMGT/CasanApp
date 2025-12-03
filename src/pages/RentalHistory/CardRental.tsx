import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCalendarCheck, FaRegCalendarMinus } from "react-icons/fa6";
import { PiWarningCircle } from "react-icons/pi";
import { IcBike, IcBike2 } from "../../assets";
import { Separator } from "../../components";
import { moments } from "../../helpers";

interface Props {
  data: RTOProps;
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
    daysLeft = moments(data?.TargetFinishDate).diff(moments(), "days");
  }

  const formatted = getFormatted(status);
  const isShowRTO =
    status !== 2 &&
    status !== 4 &&
    status !== 6 &&
    status !== 7 &&
    status !== 9 &&
    status !== 10
      ? true
      : false;

  let dataHoliday: RTOHolidaysProps | undefined = undefined;

  if (data?.RTOHolidays && data?.RTOHolidays.length) {
    const today = new Date();

    dataHoliday =
      data?.RTOHolidays.filter((item) => {
        const start = new Date(item.StartDate);
        const end = new Date(item.EndDate);

        return today >= start && today <= end;
      })[0] ?? undefined;
  }

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
          <span className="font-medium">{data?.Admin?.Name || "-"}</span>
          <span className="text-xs text-black90">
            {`${vehicleModel.BatteryCapacity || 0}W ${
              vehicleModel?.Volt || 0
            }V ${vehicleModel?.Ampere || 0}Ah (jarak ${
              vehicleModel?.Range || 0
            }km)`}
          </span>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="row">
        {status === 1 ||
        status === 2 ||
        status === 6 ||
        status === 8 ||
        status === 9 ||
        status === 10 ||
        status === 11 ? (
          <div
            className={`rounded-full w-9 h-9 center bg-${
              status === 1 || status === 2 || status === 11
                ? "lightGreen"
                : "black10"
            }`}
          >
            {status === 1 || status === 2 || status === 11 ? (
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
              backgroundColor:
                status === 3 ? "#E8F7F8" : status === 5 ? "#FDFBEA" : "#FCEEF0",
            }}
          >
            <span
              className={`text-[10px] font-medium text-${
                status === 3 || status === 5 ? "black100" : "red"
              }`}
            >
              {status === 3 || status === 5 ? "Tesisa" : "Tenggat"}
            </span>
            <span
              className={`font-semibold `}
              style={{
                color:
                  status === 3
                    ? "#2dba9d"
                    : status === 5
                    ? "#EDD22D"
                    : "#DD2E44",
              }}
            >
              {status === 5
                ? dataHoliday?.TotalDay || 0
                : daysLeft > 0
                ? daysLeft
                : 0}
              H
            </span>
          </div>
        )}

        <div className="ml-3">
          <div className="row gap-1">
            {isShowRTO && (
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-b from-[#2DBA9D] to-[#327478]">
                RTO
              </span>
            )}
            <span className={`font-medium text-${formatted.color}`}>
              {formatted?.label}
            </span>

            {status === 2 && (
              <FaRegCalendarMinus size={14} className="text-primary100" />
            )}
            {status === 4 && <PiWarningCircle size={14} className="text-red" />}
            {(status === 1 || status === 6 || status === 11) && (
              <FaRegCheckCircle size={14} className="text-primary100" />
            )}
          </div>

          {status != 1 && status != 8 && status != 9 && status !== 11 && (
            <div className="row gap-1 font-medium">
              {status !== 2 && status !== 5 && status !== 10 && (
                <>
                  <span className="text-xs">
                    {moments(data?.StartDate).format("DD MMMM YYYY")}
                  </span>
                  <span>-</span>
                </>
              )}
              <span
                className={`text-xs text-${status === 4 ? "red" : "black100"}`}
              >
                {`${status === 5 ? `Libur Sampai ` : ""}${moments(
                  status === 5 ? dataHoliday?.EndDate : data?.TargetFinishDate
                ).format("DD MMMM YYYY")}`}
              </span>
              <span
                className={`text-xs font-normal text-${
                  status === 4 ? "red" : "black70"
                }`}
              >{`${
                status === 5
                  ? moments(dataHoliday?.EndDate).format("HH:mm")
                  : data?.CutOffTime
              } WIB`}</span>
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg px-3 py-1 text-xs font-medium text-white bg-gradient-to-b from-[#2DBA9D] to-[#327478]">
        RTO
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
    case 1:
      label = "Terverifikasi";
      break;

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

    case 5:
      label = "Sedang Libur";
      break;

    case 6:
      label = "Selesai";
      break;

    case 7:
      label = "Dihentikan Sementara";
      color = "red";
      break;

    case 8:
      label = "Tidak Selesai";
      break;

    case 9:
      label = "Ditolak";
      color = "red";
      break;

    case 10:
      label = "Dikembalikan";
      break;

    case 11:
      label = "Disetujui";
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
