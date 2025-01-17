interface SocketItemProps {
  onClick: () => void;
}

const SocketItem: React.FC<SocketItemProps> = ({ onClick }) => {
  const currentType: string = "default";

  const getSocketStyle = (type: string) => {
    switch (type) {
      case "select":
        return "border-primary100 bg-primary10 cursor-pointer";
      case "used":
        return "border-primary100 bg-primary100 text-white cursor-pointer";
      case "broken":
        return "border-baseGray bg-baseGray text-red cursor-not-allowed";
      default:
        return "border-black/1 bg-white cursor-pointer";
    }
  };

  const onSelect = () => {
    if (currentType !== "broken") onClick();
  };

  return (
    <div
      onClick={onSelect}
      className={`h-[44px] center rounded-xl border text-xs text-blackBold font-medium  ${getSocketStyle(
        currentType
      )}`}
    >
      1
    </div>
  );
};

export default SocketItem;
