import { IcRightBlack } from "../../../assets";

interface MenuItemProps {
  icon: any;
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick }) => {
  const Icon: any = icon;

  const isShowIcon: boolean = icon ? true : false;

  return (
    <div className="between-x gap-2 cursor-pointer" onClick={onClick}>
      {isShowIcon && <Icon />}
      <p className="flex-1 font-medium">{label}</p>
      <IcRightBlack />
    </div>
  );
};

export default MenuItem;
