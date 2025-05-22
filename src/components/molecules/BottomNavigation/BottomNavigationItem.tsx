import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
  IcHistoryActive,
  IcHistoryInactive,
  IcHomeActive,
  IcHomeInactive,
  IcLocationActive,
  IcLocationInactive,
  IcProfileActive,
  IcProfileInactive,
  IcScanWhite,
} from "../../../assets";
import { MenuBottomNavigationProps } from "../../../common";
import { useAuth } from "../../../context/AuthContext";

interface BottomNavigationItemProps {
  data: MenuBottomNavigationProps;
  isActive: boolean;
  onClick: () => void;
}

const BottomNavigationItem: React.FC<BottomNavigationItemProps> = ({
  data,
  isActive,
  onClick,
}) => {
  const { isAuthenticated } = useAuth();

  const getIcon = useCallback(() => {
    let icon: any = IcHomeActive;

    switch (data?.page) {
      case "location":
        icon = isActive ? IcLocationActive : IcLocationInactive;
        break;

      case "order":
        icon = isActive ? IcHistoryActive : IcHistoryInactive;
        break;

      case "profile":
        icon = isActive ? IcProfileActive : IcProfileInactive;
        break;

      default:
        icon = isActive ? IcHomeActive : IcHomeInactive;
        break;
    }

    return icon;
  }, [isActive]);

  const checkTo = () => {
    let value: string = "";

    if (!isAuthenticated) {
      if (data?.page === "order" || data?.page === "profile") value = "";
    }

    if (value) {
      return "";
    } else {
      value = data?.page === "scan" ? `/${data?.page}` : `/home/${data?.page}`;
    }

    return value;
  };

  const Icon: any = getIcon();

  return (
    <div
      className="flex flex-col items-center gap-0.5 py-2 cursor-pointer w-full"
      // to={checkTo()}
      onClick={onClick}
    >
      {data?.isCenter ? (
        <div className="w-6 h-6 relative">
          <div className="h-[62px] w-[62px] rounded-full bg-primary100 items-center justify-center flex absolute top-[-38px] left-[-18px] ring-4 ring-white">
            <IcScanWhite />
          </div>
        </div>
      ) : (
        <Icon />
      )}
      <span
        className={`text-[10px] ${
          isActive ? "text-primary100 font-medium" : "text-black50"
        }`}
      >
        {data?.label}
      </span>
    </div>
  );
};

export default BottomNavigationItem;
