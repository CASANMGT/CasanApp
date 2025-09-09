import React from "react";

interface AvailableTypeVehicleItemProps {
  isActive: boolean;
  data: OptionsProps;
  onClick: () => void;
}

const AvailableTypeVehicleItem: React.FC<AvailableTypeVehicleItemProps> = ({
  isActive,
  data,
  onClick,
}) => {
  const Icon = data?.icon;

  const isShowIcon = data?.icon ? true : false;

  return (
    <div
      onClick={onClick}
      className={`rounded-full px-[14px] h-6 items-center flex cursor-pointer ${
        isActive ? "bg-primary100" : "bg-white"
      } `}
    >
      {isShowIcon && <Icon className={`mr-1 w-4 h-auto ${isActive ? "text-white" : "text-primary100"}`}/>}

      <span
        className={`font-medium ${
          isActive ? "text-white" : "text-primary100"
        }`}
      >
        {data?.name}
      </span>
    </div>
  );
};

export default AvailableTypeVehicleItem;
