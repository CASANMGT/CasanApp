import { FaAngleRight } from "react-icons/fa6";
import { GiSandsOfTime } from "react-icons/gi";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { WiTime4 } from "react-icons/wi";
import { ILNoImage } from "../../assets";
import { moments } from "../../helpers";

interface Props {
  data: RTOProps;
  onClick: () => void;
}

const StatusRTO: React.FC<Props> = ({ data, onClick }) => {
  const dataColor: ColorVehicleModelProps | undefined =
    data?.Vehicle?.Colors?.[0] ?? undefined;
  const status = data?.Status;
  const formatted = getFormatted(status);
  const Icon = formatted.icon;
  const now = new Date();

  const holiday: RTOHolidaysProps =
    data?.RTOHolidays.filter((item) => {
      const start = new Date(item.StartDate);
      const end = new Date(item.EndDate);

      return now >= start && now <= end;
    })[0] ?? null;

  return (
    <div className="bg-white rounded-lg">
      <div className="between-x p-4 bg-baseLightGray2 rounded-t-lg">
        <div className="flex flex-col">
          <span className="text-blackBold font-semibold">Go Green</span>
          <p className="text-xs text-black70">
            Oleh{" "}
            <span className="text-xs text-black100">
              {data?.Admin?.Name || "-"}
            </span>
          </p>
        </div>

        <div
          className="rounded-md p-1.5 row gap-1"
          style={{
            backgroundColor: formatted?.bgColor,
          }}
        >
          <Icon
            size={14}
            style={{
              color: formatted?.color,
            }}
          />

          <div className="row gap-1.5">
            {status === 5 && (
              <p className="text-xs text-black90 font-medium">
                Libur Bayar:{" "}
                <span className="text-xs text-blackBold font-medium">
                  {holiday?.TotalDay} Hari
                </span>
              </p>
            )}
            <span
              className="text-xs font-medium"
              style={{
                color: formatted?.color,
              }}
            >
              {formatted?.label}
            </span>
          </div>
        </div>
      </div>

      <div onClick={onClick} className="row gap-2 p-4">
        <div className="relative w-[64px] h-[64px] border border-black10 rounded">
          <img
            src={dataColor?.ImageURL || ILNoImage}
            alt="photo"
            className="w-full h-full rounded-lg bg-baseLightGray "
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="row gap-1 mb-2">
            <span className="text-black100 text-xl font-semibold">
              {data?.CreditLeft || 0}
            </span>
            <span className="text-black90">Kredit Hari</span>

            <FaAngleRight size={20} className="text-black50 ml-3" />
          </div>

          <div className="row gap-1">
            {status !== 7 && (
              <span
                className="text-xs"
                style={{
                  color: formatted?.colorInfo,
                }}
              >
                {formatted?.labelInfo}
              </span>
            )}
            <span className="text-xs text-blackBold font-medium">
              {moments(data?.NextPaymentDate || undefined).format(
                "ddd, DD MMM",
              )}
            </span>
            <span className="ml-1 text-xs text-blackBold">
              {moments(data?.NextPaymentDate || undefined).format("HH:mm")} WIB
            </span>

            {status === 7 && (
              <span className="text-red text-xs ml-3">
                ({data?.OverdueCount} Hari di-suspend)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusRTO;

const getFormatted = (status: number) => {
  let label: string = "";
  let labelInfo: string = "";
  let icon: any = null;
  let bgColor: string = "";
  let color: string = "";
  let colorInfo: string = "";

  switch (status) {
    case 1:
    case 2:
    case 3:
      icon = GiSandsOfTime;
      label = "Berlangsung";
      labelInfo = "Bayar Selanjutnya:";
      bgColor = "#e5f3f1";
      color = "#2DBA9D";
      colorInfo = "#737480";
      break;

    case 4:
      icon = WiTime4;
      label = "Tenggat Waktu";
      labelInfo = "Akan di-suspend:";
      bgColor = "#FCEEF0";
      color = "#DD2E44";
      colorInfo = "#DD2E44";
      break;

    case 5:
      icon = MdOutlineAccessTimeFilled;
      labelInfo = "Libur sampai:";
      bgColor = "#FFFAF1";
      color = "#FFBE4D";
      colorInfo = "#DD2E44";
      break;

    case 7:
      icon = IoWarningOutline;
      label = "Di-suspend";
      labelInfo = "";
      bgColor = "#DD2E44";
      color = "#fff";
      break;

    default:
      break;
  }

  return { label, labelInfo, icon, color, colorInfo, bgColor };
};
