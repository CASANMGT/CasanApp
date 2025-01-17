interface OperatingHoursItemProps {
  isLast: boolean;
}

const OperatingHoursItem: React.FC<OperatingHoursItemProps> = ({ isLast }) => {
  return (
    <div className={`row font-semibold text-xs ${!isLast ? "mb-[6px]" : ""}`}>
      <p className="w-[30%]">Senin - Jumat</p>
      <p>07:00 22:00 WIB</p>
    </div>
  );
};

export default OperatingHoursItem;
