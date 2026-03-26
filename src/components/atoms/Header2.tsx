import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

type StyleButtonProps = "info" | undefined;

interface Props {
  style?: StyleButtonProps;
  title: string;
  iconRight?: any;
  /** Jika tidak diisi, tombol kembali pakai navigate(-1) */
  onDismiss?: () => void;
  onPress?: () => void;
}

const Header2: React.FC<Props> = ({
  style,
  title,
  iconRight,
  onDismiss,
  onPress,
}) => {
  const navigate = useNavigate();
  const isShowRight = useMemo(
    () => (onPress && iconRight ? true : false),
    [onPress, iconRight],
  );
  const IconRight = iconRight;

  const handleBack = () => {
    if (onDismiss) onDismiss();
    else navigate(-1);
  };

  return (
    <div className="h-[52px] px-4 row gap-2 items-center bg-primary100">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleBack();
        }}
        className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl active:opacity-80 -ml-1"
        aria-label="Kembali"
      >
        <IoArrowBack size={22} className="text-white" />
      </button>

      <h4 className="font-semibold text-white flex-1 min-w-0 truncate">{title}</h4>

      {isShowRight && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPress?.();
          }}
          className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl active:opacity-80"
          aria-label="Aksi"
        >
          <IconRight size={20} className="text-white" />
        </button>
      )}
    </div>
  );
};

export default Header2;
