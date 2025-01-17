import { useMemo, useState } from "react";
import { IcDownGray } from "../../assets";
import { OptionDropdownProps } from "../../common";
import Separator from "./Separator";

interface DropdownProps {
  className?:string
  select: string | number | undefined;
  placeholder: string;
  options: OptionDropdownProps[];
  onSelect: (select: OptionDropdownProps) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  className,
  select,
  placeholder,
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const isShowOption = useMemo(
    () => (options && options.length ? true : false),
    [options]
  );

  return (
    <div
      className={`relative w-full group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Dropdown Button */}
      <button
        className="flex items-center justify-between w-full h-[48px] px-6 bg-white border border-baseGray rounded-full shadow-sm hover:bg-gray-100 focus:outline-none"
        onClick={toggleDropdown}
      >
        {select ? (
          <span className="font-medium">{select}</span>
        ) : (
          <span className="text-black100/70">{placeholder}</span>
        )}
        <div
          className={`transform transition-transform duration-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <IcDownGray />
        </div>
      </button>

      {/* Dropdown Menu */}
      {(isOpen || !isOpen) && isShowOption && (
        <div
          className={`absolute left-0 w-full py-3 px-6 mt-1 bg-white border border-baseGray rounded-xl shadow-lg transform transition-all duration-200 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <ul>
            {options.map((item: OptionDropdownProps, index: number) => {
              const isLast: boolean = index === options.length - 1;
              return (
                <li
                  onClick={() => onSelect(item)}
                  className="font-medium hover:bg-gray-100"
                >
                  {item?.name}

                  {!isLast && <Separator />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
