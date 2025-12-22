import { useCallback } from "react";

interface SocketItemProps {
  data: Socket;
  position: number;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const SocketItem: React.FC<SocketItemProps> = ({
  data,
  isActive,
  disabled,
  onClick,
}) => {
  const getSocketStyle = useCallback(() => {
    if (disabled)
      return "border-baseGray bg-baseGray !text-black50 cursor-not-allowed";

    if (isActive) return "border-primary100 bg-primary10 cursor-pointer";

    if (data?.IsCharging === 0) return "border-black/1 bg-white cursor-pointer";

    if (data?.IsCharging === 1)
      return "border-primary100 bg-primary100 text-white cursor-not-allowed";

    return "border-baseGray bg-baseGray !text-black50 cursor-not-allowed";
  }, [disabled, isActive, data]);

  const getLabelSocket = useCallback(() => {
    let value: string | number;

    switch (data?.IsCharging) {
      case 0:
        value = data?.Port;
        break;

      case 1:
        value = "Terpakai";
        break;

      default:
        value = "Tidak\nTersedia";
        break;
    }

    return value;
  }, [data]);

  const onSelect = () => {
    if (data?.IsCharging === 0 && !disabled) onClick();
  };

  return (
    <div
      onClick={onSelect}
      className={`h-[44px] center rounded-xl border text-xs text-blackBold font-medium whitespace-pre-line text-center  ${getSocketStyle()}`}
    >
      {getLabelSocket()}
    </div>
  );
};

export default SocketItem;
