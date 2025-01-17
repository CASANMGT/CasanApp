import { useMemo } from "react";
import { IcBackBlack, IcBackWhite } from "../../assets";

interface HeaderProps {
  type?: "primary" | "secondary";
  title: string;
  className?: string;
  onDismiss: () => void;
}

const Header: React.FC<HeaderProps> = ({
  type = "primary",
  className,
  title,
  onDismiss,
}) => {
  const isPrimary = useMemo(() => type === "primary", [type]);

  return (
    <div
      className={`relative flex flex-row items-center px-4 ${
        isPrimary ? "h-[52px] bg-primary100 px-4 gap-2" : "pt-[14px]"
      } ${className}`}
    >
      <div
        className={`w-10 h-10 rounded-full center cursor-pointer ${
          isPrimary ? "-ml-2" : "bg-baseLightGray/70"
        }`}
        onClick={onDismiss}
      >
        {isPrimary ? <IcBackWhite /> : <IcBackBlack />}
      </div>

      <div
        className={`${
          isPrimary ? "text-baseLightGray2" : "flex-1 text-center"
        }`}
      >
        <h4 className="font-semibold">{title}</h4>
      </div>

      <div className="w-10 h-10 invisible" />
    </div>
  );
};

export default Header;
