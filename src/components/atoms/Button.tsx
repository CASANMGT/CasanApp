import { useCallback } from "react";

interface SizeButtonStyleProps {
  buttonStyle: string;
  labelStyle: string;
}

interface ButtonProps {
  className?: string;
  type?: ButtonType;
  buttonType?: "sm" | "md" | "lg";
  label: string;
  iconRight?: any;
  disabled?: boolean;
  loading?: boolean;
  sizeIconRight?: number;
  onClick: () => void;
}
const Button: React.FC<ButtonProps> = ({
  type,
  buttonType = "md",
  className,
  label,
  iconRight,
  disabled,
  loading,
  sizeIconRight,
  onClick,
}) => {
  const getTypeButton: () => string = useCallback(() => {
    let value: string = "";

    if (disabled) value = "btn-disable";
    else
      switch (type) {
        case "primary-line":
          value =
            "bg-primary10 text-primary100 border-primary100  cursor-pointer";
          break;

        case "secondary":
          value = "btn-secondary";
          break;

        case "danger":
          value = "btn-delete";
          break;

        case "light-green":
          value = "bg-lightGreen text-green border-strokeGreen  cursor-pointer";
          break;

        case "light-red":
          value = "bg-lightRed text-red border-strokeRed  cursor-pointer";
          break;

        default:
          value = "btn-primary100";
          break;
      }

    return value;
  }, [type, disabled]);

  const getSizeButton: () => SizeButtonStyleProps = useCallback(() => {
    let buttonStyle: string = "";
    let labelStyle: string = "text-sm";

    switch (buttonType) {
      case "sm":
        buttonStyle = "!h-6 !px-[14px]";
        labelStyle = "!text-xs";
        break;

      case "lg":
        buttonStyle = "!h-[48px]";
        break;

      default:
        buttonStyle = "!h-[38px]";
        break;
    }

    return { buttonStyle, labelStyle };
  }, [type, disabled]);

  const handleClick = () => {
    if (!disabled && !loading) onClick();
  };

  const IconRight: any | undefined = iconRight;
  const classNameTypeButton: string = getTypeButton();
  const classNameSizeButton: SizeButtonStyleProps = getSizeButton();

  return (
    <button
      className={`w-full border rounded-full text-sm font-medium justify-center items-center flex drop-shadow  ${classNameTypeButton} ${classNameSizeButton?.buttonStyle} ${className}`}
      onClick={handleClick}
    >
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`flex flex-row gap-2 items-center whitespace-nowrap  ${classNameSizeButton.labelStyle}`}
        >
          {label}
          {IconRight && <IconRight size={sizeIconRight || 20} />}
        </div>
      )}
    </button>
  );
};

export default Button;

const Loader = () => {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
      ></path>
    </svg>
  );
};
