import { useState } from "react";
import { IcBackBlack, IcBackWhite, IcClose, IcMenuBlack } from "../../assets";

interface HeaderProps {
  type?: "primary" | "secondary";
  title: string;
  className?: string;
  onDismiss: () => void;
  onPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  type = "primary",
  className,
  title,
  onDismiss,
  onPress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isPrimary = type === "primary";
  const isShowRight = onPress ? true : false;

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

      {isShowRight ? (
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative w-10 h-10 rounded-full center cursor-pointer bg-baseLightGray/70"
        >
          <div className="rotate-90">
            <IcMenuBlack />
          </div>

          {isOpen && (
            <div
              onClick={onPress}
              className={`absolute right-0 top-11 flex gap-2 p-3 rounded-lg bg-white transform transition-all duration-200 cursor-pointer ${
                isOpen
                  ? "opacity-100 translate-y-0 z-10"
                  : "opacity-0 translate-y-2 invisible"
              }`}
            >
              <IcClose className="text-red" />

              <span className="text-red whitespace-nowrap">Batalkan Sesi</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-10 h-10 invisible" />
      )}
    </div>
  );
};

export default Header;
