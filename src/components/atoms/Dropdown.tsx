import { useCallback, useMemo, useState } from "react";
import { IcDownGray } from "../../assets";
import { OptionsProps } from "../../common";
import Separator from "./Separator";
import { SwitchLayoutGroupContext } from "framer-motion";

interface DropdownProps {
  className?: string;
  type?: "sm" | "md" | "xl";
  select: string | number | undefined;
  placeholder: string;
  disabled?: boolean;
  options: OptionsProps[];
  onSelect: (select: OptionsProps) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  className,
  type,
  select,
  placeholder,
  options,
  disabled,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getTypeButton = () => {
    let value: string = "";

    switch (type) {
      case "sm":
        value = "h-[28px] px-[14px]";
        break;

      case "md":
        break;

      case "xl":
        break;

      default:
        value = "h-[48px] px-6";
        break;
    }

    return value;
  };

  const getValue = useCallback(() => {
    let value: string | number | undefined;

    const i =
      select && options
        ? options.findIndex(
            (item) => item?.value.toString() === select.toString()
          )
        : -1;

    if (i > -1) value = options && options[i].name;
    else value = select;

    return value;
  }, [select, options]);

  const isShowOption = useMemo(
    () => (options && options.length ? true : false),
    [options]
  );

  const value = getValue();

  return (
    <div
      className={`relative w-full group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Dropdown Button */}
      <button
        className={`flex items-center justify-between w-full bg-white border border-baseGray rounded-full shadow-sm hover:bg-gray-100 focus:outline-none ${getTypeButton()}`}
        onClick={toggleDropdown}
      >
        {value ? (
          <span className="font-medium">{value}</span>
        ) : (
          <span className="text-black100/70">{placeholder}</span>
        )}
        <div
          className={`transform transition-transform duration-500 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <IcDownGray className={`${type === "sm" ? "w-5" : ""} h-auto`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {(isOpen || !isOpen) && isShowOption && (
        <div
          className={`dropdown-menu ${type === "sm" ? "p-1" : "p-3"} ${
            isOpen
              ? "opacity-100 translate-y-0 z-10"
              : "opacity-0 translate-y-2 invisible"
          }`}
        >
          <ul className="flex flex-col cursor-pointer">
            {options &&
              options.length &&
              options.map((item: OptionsProps, index: number) => {
                const isLast: boolean = index === options.length - 1;
                return (
                  <li
                    key={index + 1}
                    onClick={() => {
                      if (!item?.disabled && !disabled) {
                        onSelect(item);
                        setIsOpen(false);
                      }
                    }}
                    className={`font-medium p-2 text-sm ${
                      !isLast && "border-b border-b-baseLightGray"
                    } ${
                      item?.disabled
                        ? "text-black50 cursor-not-allowed"
                        : "text-black100 cursor-pointer hover:rounded-md hover:bg-gray-100"
                    }`}
                  >
                    {item?.name}
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
