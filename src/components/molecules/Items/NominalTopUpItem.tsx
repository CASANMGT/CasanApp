import { rupiah } from "../../../helpers";

interface NominalTopUpItemProps {
  isActive: boolean;
  isHour?: boolean;
  value: string;
  onClick: () => void;
}

const NominalTopUpItem: React.FC<NominalTopUpItemProps> = ({
  value,
  isActive,
  isHour,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`center h-9 bg-gray-8 border rounded-full cursor-pointer ${
        isActive
          ? " border-primary100 bg-primary10 text-primary100"
          : "border-black90 bg-white text-black90"
      }`}
    >
      {value === "full"
        ? "isi sampai penuh"
        : isHour
        ? `${value} menit`
        : `Rp${rupiah(value)}`}
    </div>
  );
};

export default NominalTopUpItem;
