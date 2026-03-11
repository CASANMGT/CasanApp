import { WiTime4 } from "react-icons/wi";
import { FaCheckCircle } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { PiWarningCircle } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  status: number;
  data?: RTOProps;
}

const Status: React.FC<Props> = ({ status, data }) => {
  const formatted = getFormatted(status, data);

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

const getFormatted = (status: number, data?: RTOProps) => {
  let label: string = "";
  let bgColorLeft: string = "";
  let bgColorRight: string = "";
  let icon: any = null;

  switch (status) {
    case 1:
    case 5:
      label = status === 5 ? "Booking Libur" : "Menunggu Verifikasi";
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
      label =
        data?.CreditLeft === 0
          ? "Dalam Masa Tenggang"
          : "Booking Sedang Berlangsung";
      bgColorLeft = data?.CreditLeft === 0 ? "#F8C41F" : "#19ACB6";
      bgColorRight = data?.CreditLeft === 0 ? "#C39340" : "#2DBA9D";
      icon = data?.CreditLeft === 0 ? FiAlertTriangle : GiSandsOfTime;
      break;

    case 4:
      label = "Tenggat Waktu";
      bgColorLeft = "#DD2E44";
      bgColorRight = "#BA2D55";
      icon = WiTime4;
      break;

    case 6:
      label = "Selesai";
      bgColorLeft = "#19ACB6";
      bgColorRight = "#2DBA9D";
      icon = FaCheckCircle;
      break;

    case 7:
      label = "Dihentikan Sementara";
      bgColorLeft = "#DD2E44";
      bgColorRight = "#BA2D55";
      icon = PiWarningCircle;
      break;

    case 8:
      label = "Tidak Selesai";
      bgColorLeft = "#19ACB6";
      bgColorRight = "#2DBA9D";
      icon = IoIosCloseCircle;
      break;

    case 10:
      label = "Dikembalikan";
      bgColorLeft = "#19ACB6";
      bgColorRight = "#2DBA9D";
      icon = FaCheckCircle;
      break;

    default:
      label = "No Title";
      bgColorLeft = "#F8C41F";
      bgColorRight = "#C39340";
      icon = IoIosCloseCircle;
      break;
  }

  return {
    label,
    bgColorLeft,
    bgColorRight,
    icon,
  };
};
