import { MenuBottomNavigationProps } from "../../../common";
import BottomNavigationItem from "./BottomNavigationItem";

interface BottomNavigationProps {
  page: string;
  onClick: (select: MenuBottomNavigationProps) => void;
}

const MENU: MenuBottomNavigationProps[] = [
  { id: "home", page: "index", label: "Home" },
  { id: "location", page: "location", label: "Location" },
  { id: "scan", page: "scan", label: "Scan Barcode", isCenter: true },
  { id: "order", page: "order", label: "Order" },
  { id: "profile", page: "profile", label: "Profile" },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  page,
  onClick,
}) => {
  return (
    <div className="flex flex-row justify-around bg-white drop-shadow">
      {MENU.map((item: MenuBottomNavigationProps) => (
        <BottomNavigationItem
          key={item?.id}
          data={item}
          isActive={page === item?.page}
          onClick={() => onClick(item)}
        />
      ))}
    </div>
  );
};

export default BottomNavigation;
