import { useState } from "react";
import {
  IcBackBlack,
  IcBackWhite,
  IcClose,
  IcCustomerService,
  IcCustomerServiceBlack,
  IcFlashOff,
  IcFlashOn,
  IcMenuBlack,
} from "../../assets";
import { openWhatsApp } from "../../helpers";
import { CUSTOMER_SERVICES } from "../../common";
import { FiInfo } from "react-icons/fi";
import { FaHeadphonesAlt } from "react-icons/fa";
import { FaHeadphones } from "react-icons/fa6";

interface HeaderProps {
  type?:
    | "primary"
    | "secondary"
    | "scan"
    | "cancel"
    | "charging"
    | "info"
    | "booking";
  title: string;
  isActive?: boolean;
  className?: string;
  onDismiss: () => void;
  onPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  type = "primary",
  className,
  title,
  isActive,
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
        className={`flex-1 ${
          isPrimary ? "text-baseLightGray2" : "flex-1 text-center"
        }`}
      >
        <h4 className="font-semibold">{title}</h4>
      </div>

      {isShowRight ? (
        type === "info" ? (
          <div onClick={onPress} className="cursor-pointer">
            <FiInfo />
          </div>
        ) : type === "scan" ? (
          <div
            onClick={onPress}
            className={`w-10 h-10 rounded-full justify-center items-center flex cursor-pointer ${
              isActive ? "bg-primary100" : "bg-baseLightGray/70"
            }`}
          >
            {isActive ? <IcFlashOn /> : <IcFlashOff />}
          </div>
        ) : (
          <div
            onClick={() => {
              if (type === "charging" && onPress) onPress();
              else setIsOpen((prev) => !prev);
            }}
            className="relative w-10 h-10 rounded-full center cursor-pointer bg-baseLightGray/70"
          >
            {type === "booking" ? (
              <FaHeadphones />
            ) : type === "charging" ? (
              <IcCustomerService />
            ) : (
              <>
                <div className="rotate-90">
                  <IcMenuBlack />
                </div>

                {isOpen && (
                  <div
                    className={`absolute right-0 top-11 space-y-2 p-3 rounded-lg bg-white transform transition-all duration-200 cursor-pointer ${
                      isOpen
                        ? "opacity-100 translate-y-0 z-10"
                        : "opacity-0 translate-y-2 invisible"
                    }`}
                  >
                    <div onClick={onPress} className="row gap-2">
                      <IcClose className="text-red" />

                      <span className="text-red whitespace-nowrap">
                        Batalkan Sesi
                      </span>
                    </div>

                    <div
                      className="row gap-2"
                      onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
                    >
                      <IcCustomerServiceBlack />

                      <span className=" whitespace-nowrap">Hubungi Kami</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )
      ) : (
        <div className="w-10 h-10 invisible" />
      )}
    </div>
  );
};

export default Header;
