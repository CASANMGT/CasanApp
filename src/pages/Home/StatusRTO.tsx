import { FaAngleRight, FaLock } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
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
  const current = data?.CreditPaid || 1;
  const total = data?.Payment || 1;

  return (
    <div className="bg-white rounded-lg p-4 mt-4">
      <div className="between-x">
        <span className="text-base font-semibold">Status RTO {data?.ID}</span>
        {status === 5 && (
          <div className="row gap-1">
            <div className="rounded-full w-6 h-6 center bg-lightOrange">
              <IoTime size={16} className="text-orange" />
            </div>

            <p className="text-black90 font-medium">
              Libut Bayar:{" "}
              <span className="text-blackBold font-medium">
                {data?.OverdueCount || 0} Hari
              </span>
            </p>
          </div>
        )}
      </div>

      <div onClick={onClick} className="row gap-4 cursor-pointer mt-6">
        <div className="relative w-11 h-11">
          <img
            src={dataColor?.ImageURL || ILNoImage}
            alt="photo"
            className="w-full h-full rounded-lg bg-baseLightGray "
          />

          {status === 5 && (
            <div className="center absolute top-0 left-0 right-0 bottom-0 bg-black100/50 rounded-lg">
              <FaLock size={16} className="text-white z-10" />
            </div>
          )}
        </div>

        {status === 2 ||
        status === 3 ||
        status === 4 ||
        status === 5 ||
        status === 7 ? (
          <div className="flex-1">
            <div className="row gap-1.5 mb-1">
              <span
                className={`text-${
                  data?.CreditLeft ? "blackBold" : "red"
                } font-semibold`}
              >
                {data?.CreditLeft || 0}
              </span>
              <span className="text-xs text-black90">Kredit Hari</span>
            </div>

            <div className="flex-1 h-3 bg-black10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 bg-${
                  data?.CreditLeft ? "primary100" : "red"
                }`}
                style={{
                  width: `${(current / total) * 100}%`,
                }}
              />
            </div>

            <div className="row gap-1.5 mt-1">
              <span className="text-xs text-black70">Kredit Habis:</span>
              <span className="text-xs ">
                {moments(data?.NextPaymentDate || undefined)
                  .add(1, "days")
                  .format("DD MMMM YYYY")}
              </span>
            </div>
          </div>
        ) : (
          <div className="row gap-1 flex-1">
            <div
              className="rounded-full w-6 h-6 center"
              style={{
                backgroundColor: formatted?.bgColor,
              }}
            >
              {formatted?.icon && (
                <Icon size={16} style={{ color: formatted?.color }} />
              )}
            </div>

            <span className="text-blackBold font-semibold">
              {formatted?.label}
            </span>
          </div>
        )}

        <FaAngleRight className="text-black50" />
      </div>
    </div>
  );
};

export default StatusRTO;

const getFormatted = (status: number) => {
  let label: string = "";
  let icon: any = null;
  let bgColor: string = "";
  let color: string = "";

  switch (status) {
    case 1:
      icon = IoTime;
      label = "Menunggu Verifikasi";
      bgColor = "#FFFAF1";
      color = "#FFBE4D";
      break;

    case 9:
      icon = MdCancel;
      label = "Ditolak";
      bgColor = "#FCEEF0";
      color = "#DD2E44";
      break;

    default:
      break;
  }

  return { label, icon, color, bgColor };
};
