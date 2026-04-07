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
    if (disabled || !data?.IsActive)
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
    if (data?.IsCharging === 0 && !disabled && data?.IsActive) onClick();
  };

  return (
    <div
      onClick={onSelect}
      className={`relative h-[44px] center rounded-xl border text-xs text-blackBold font-medium whitespace-pre-line text-center  ${getSocketStyle()}`}
    >
      {/* Brand Logo Placeholder */}
      <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-xl rounded-bl-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2FScreenshot_14.png?alt=media&token=4a2b96b2-fadf-4d10-997d-d4190ef63dd2"
          alt="Brand"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      {getLabelSocket()}
    </div>
  );
};

export default SocketItem;
