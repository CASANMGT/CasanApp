import { useCallback } from "react";

interface SizeButtonStyleProps {
  buttonStyle: string;
  labelStyle: string;
}

interface ButtonProps {
  className?: string;
  type?: "primary" | "secondary" | "danger";
  buttonType?: "sm" | "md" | "lg";
  label: string;
  iconRight?: any;
  disabled?: boolean;
  onClick: () => void;
}
const Button: React.FC<ButtonProps> = ({
  type,
  buttonType = "md",
  className,
  label,
  iconRight,
  disabled,
  onClick,
}) => {
  const getTypeButton: () => string = useCallback(() => {
    let value: string = "";

    if (disabled) value = "btn-disable";
    else
      switch (type) {
        case "secondary":
          value = "btn-secondary";
          break;

        case "danger":
          value = "btn-delete";
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
        buttonStyle = "h-6 px-[14px]";
        labelStyle = "text-xs";
        break;

      case "lg":
        buttonStyle = "h-[48px]";
        break;

      default:
        buttonStyle = "h-[38px]";
        break;
    }

    return { buttonStyle, labelStyle };
  }, [type, disabled]);

  const handleClick = () => {
    if (!disabled) onClick();
  };

  const IconRight: string | undefined = iconRight;
  const classNameTypeButton: string = getTypeButton();
  const classNameSizeButton: SizeButtonStyleProps = getSizeButton();

  return (
    <button
      className={`w-full border rounded-full text-sm font-medium justify-center items-center flex drop-shadow  ${classNameTypeButton} ${classNameSizeButton?.buttonStyle} ${className}`}
      onClick={handleClick}
    >
      <div
        className={`flex flex-row gap-2 items-center whitespace-nowrap  ${classNameSizeButton.labelStyle}`}
      >
        {label}
        {IconRight && <IconRight />}
      </div>
    </button>
  );
};

export default Button;
