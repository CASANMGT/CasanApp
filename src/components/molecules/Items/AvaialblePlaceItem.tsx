import React from "react";

interface AvailablePlaceItemProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

const AvailablePlaceItem: React.FC<AvailablePlaceItemProps> = ({
  isActive,
  label,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-full px-[14px] h-6 items-center flex cursor-pointer ${
        isActive ? "bg-primary100" : "bg-white"
      } `}
    >
      <span
        className={`text-xs font-medium ${
          isActive ? "text-white" : "text-primary100"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default AvailablePlaceItem;
