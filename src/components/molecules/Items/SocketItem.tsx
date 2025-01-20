import { useCallback } from "react";
import { socketProps } from "../../../common";

interface SocketItemProps {
  data: socketProps;
  isActive: boolean;
  onClick: () => void;
}

const SocketItem: React.FC<SocketItemProps> = ({ data, isActive, onClick }) => {
  const getSocketStyle = useCallback(() => {
    let value: string = "";

    if (isActive) value = "border-primary100 bg-primary10 cursor-pointer";
    else
      switch (data?.status) {
        // case "select":
        // return "border-primary100 bg-primary10 cursor-pointer";
        case "used":
          value = "border-primary100 bg-primary100 text-white cursor-not-allowed";
          break;
        case "broken":
          value = "border-baseGray bg-baseGray text-red cursor-not-allowed";
          break;
        default:
          value = "border-black/1 bg-white cursor-pointer";
      }

    return value;
  }, [data?.status, isActive]);

  const getLabelSocket = useCallback(() => {
    let value: string | number;
    switch (data?.status) {
      case "used":
        value = "Terpakai";
        break;

      case "broken":
        value = "Rusak";
        break;

      default:
        value = data?.socket;
        break;
    }

    return value;
  }, [data?.status]);

  const onSelect = () => {
    if (data?.status === "available") onClick();
  };

  return (
    <div
      onClick={onSelect}
      className={`h-[44px] center rounded-xl border text-xs text-blackBold font-medium  ${getSocketStyle()}`}
    >
      {getLabelSocket()}
    </div>
  );
};

export default SocketItem;
