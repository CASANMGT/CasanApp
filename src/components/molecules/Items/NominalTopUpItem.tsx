import { rupiah } from "../../../helpers";

interface NominalTopUpItemProps {
  isActive: boolean;
}

const NominalTopUpItem: React.FC<NominalTopUpItemProps> = ({ isActive }) => {
  return (
    <div
      className={`center h-9 bg-gray-8 border rounded-full  ${
        isActive
          ? " border-primary100 bg-primary10 text-primary100"
          : "border-black90 bg-white text-black90"
      }`}
    >
      30 Menit
    </div>
  );
};

export default NominalTopUpItem;
