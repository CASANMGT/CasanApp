import { WiTime4 } from "react-icons/wi";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";

interface Props {
  status: number;
}

const Status: React.FC<Props> = ({ status }) => {
  const formatted = getFormatted(status);

  return (
    <div
      className="rounded-lg p-3 row gap-2"
      style={{
        background: `linear-gradient(270deg, ${formatted?.bgColorLeft}, ${formatted?.bgColorRight})`,
      }}
    >
      <formatted.icon size={20} className="text-white" />

      <span className="font-medium text-white">{formatted?.label}</span>
    </div>
  );
};

export default Status;

const getFormatted = (status: number) => {
  let label: string = "";
  let bgColorLeft: string = "";
  let bgColorRight: string = "";
  let icon: any = null;

  switch (status) {
    case 1:
    case 11:
      label = status === 11 ? "Booking Libur" : "Menunggu Verifikasi";
      bgColorLeft = "#F8C41F";
      bgColorRight = "#C39340";
      icon = WiTime4;
      break;

    case 2:
      label = "Booking Telah Dijadwalkan";
      bgColorLeft = "#031869";
      bgColorRight = "#0055CF";
      icon = FaCalendarCheck;
      break;

    case 3:
      label = "Booking Sedang Berlangsung";
      bgColorLeft = "#19ACB6";
      bgColorRight = "#2DBA9D";
      icon = GiSandsOfTime;
      break;

    case 5:
    case 8:
    case 9:
    case 10:
      label =
        status === 5
          ? "Booking Sedang Berlangsung"
          : status === 8
          ? "Selesai"
          : status === 9
          ? "Disetujui"
          : status === 10
          ? "Dikembalikan"
          : "Tidak Selesai";
      bgColorLeft = "#19ACB6";
      bgColorRight = "#2DBA9D";
      icon =
        status === 5
          ? GiSandsOfTime
          : status === 9
          ? IoIosCloseCircle
          : FaCheckCircle;
      break;

    case 6:
    case 7:
      label =
        status === 6
          ? "Tenggat Waktu"
          : status === 7
          ? "Dihentikan Sementara"
          : "Ditolak";
      bgColorLeft = "#DD2E44";
      bgColorRight = "#BA2D55";
      icon = status === 6 ? WiTime4 : PiWarningCircle;
      break;

    default:
      break;
  }

  return {
    label,
    bgColorLeft,
    bgColorRight,
    icon,
  };
};
