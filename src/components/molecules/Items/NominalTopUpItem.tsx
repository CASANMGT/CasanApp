import { rupiah } from "../../../helpers";

interface NominalTopUpItemProps {
  type: "nominal" | "hour" | "power";
  isActive: boolean;
  value: string;
  onClick: () => void;
}

const NominalTopUpItem: React.FC<NominalTopUpItemProps> = ({
  type,
  value,
  isActive,
  onClick,
}) => {
  const unit = type === "power" ? "kWh" : type === "hour" ? "Menit" : "";
  
  return (
    <div
      onClick={onClick}
      className={`center h-9 border rounded-full cursor-pointer ${
        isActive
          ? " border-primary100 bg-primary10 text-primary100"
          : "border-black90 bg-[#f5f5f5] text-black90"
      }`}
    >
      {value === "full"
        ? "isi sampai penuh"
        : type === "nominal"
        ? `Rp${rupiah(value)}`
        : `${value} ${unit}`}
    </div>
  );
};

export default NominalTopUpItem;
