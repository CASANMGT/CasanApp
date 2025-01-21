import { useCallback } from "react";

interface SocketItemProps {
  data: number;
  position: number;
  isActive: boolean;
  onClick: () => void;
}

const SocketItem: React.FC<SocketItemProps> = ({
  data,
  position,
  isActive,
  onClick,
}) => {
  const getSocketStyle = useCallback(() => {
    let value: string = "";

    if (isActive) value = "border-primary100 bg-primary10 cursor-pointer";
    else if (data === 1)
      value = "border-primary100 bg-primary100 text-white cursor-not-allowed";
    else value = "border-black/1 bg-white cursor-pointer";

    // "border-baseGray bg-baseGray text-red cursor-not-allowed"; broken

    return value;
  }, [data, isActive]);

  const getLabelSocket = useCallback(() => {
    let value: string | number;

    if (data === 1) value = "Terpakai";
    else value = position;

    return value;
  }, [data]);

  const onSelect = () => {
    if (data === 0) onClick();
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
