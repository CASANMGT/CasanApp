import { useMemo } from "react";
import { IoArrowBack } from "react-icons/io5";

type StyleButtonProps = "info" | undefined;

interface Props {
  style?: StyleButtonProps;
  title: string;
  iconRight?: any;
  onDismiss: () => void;
  onPress?: () => void;
}

const Header2: React.FC<Props> = ({
  style,
  title,
  iconRight,
  onDismiss,
  onPress,
}) => {
  const isShowRight = useMemo(
    () => (onPress && iconRight ? true : false),
    [onPress, iconRight]
  );
  const IconRight = iconRight;

  return (
    <div
      onClick={(e) => {
        e?.stopPropagation();
        onDismiss();
      }}
      className="h-[52px] px-4 row gap-4 bg-primary100 cursor-pointer"
    >
      <IoArrowBack size={20} className="text-white" />

      <h4 className="font-semibold text-white flex-1">{title}</h4>

      {isShowRight && (
        <div
          onClick={(e) => {
            e?.stopPropagation();
            if (onPress) onPress();
          }}
          className="cursor-pointer"
        >
          <IconRight size={20} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default Header2;
