import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { TbFilter } from "react-icons/tb";
import Button from "./Button";
import Checkbox from "./Checkbox";

interface Props {
  label?: string;
  selected: number[];
  className?: string;
  options: OptionsProps[];
  isIconOnly?: boolean;
  onApply: (s: number[]) => void;
}

const DropdownCheckbox: React.FC<Props> = ({
  className,
  selected,
  options,
  isIconOnly,
  onApply,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [select, setSelect] = useState<number[]>([]);

  useEffect(() => {
    setSelect(selected);
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (value: number) => {
    setSelect((prev) => {
      if (prev.includes(value)) {
        // remove value
        return prev.filter((v) => v !== value);
      } else {
        // add value
        return [...prev, value];
      }
    });
  };

  const isSelected = useMemo(
    () => (selected?.length ? true : false),
    [selected]
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`dropdown-button ${isIconOnly && "!aspect-square !p-2"}`}
      >
        {!isIconOnly && (
          <>
            <span className="text-primary100 font-medium">Filter</span>

            {isSelected && (
              <FaCircleCheck size={10} className="text-primary100" />
            )}
          </>
        )}

        <TbFilter size={16} className="text-primary100" />
      </div>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 z-10 w-max whitespace-nowrap bg-white p-1 border rounded-lg shadow mt-1 transition-all duration-200 overflow-hidden ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0 hidden"
        }`}
      >
        <div className="max-h-40 overflow-y-auto scrollbar-none rounded pb-3">
          {options.map((item, index) => {
            const isShowIcon = item?.icon ? true : false;
            const Icon = item?.icon;

            return (
              <div
                key={index}
                className="row gap-2 p-3 rounded hover:bg-black10 "
              >
                {isShowIcon && <Icon size={20} />}

                <Checkbox
                  label={item?.name.toString()}
                  isActive={select.some((e) => e === item?.value)}
                  size={20}
                  isSwitch
                  onChange={() => toggleSelection(Number(item?.value))}
                  className="flex-1"
                />
              </div>
            );
          })}
        </div>

        <Button
          label="Terapkan"
          onClick={() => {
            onApply(select);
            setIsOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default DropdownCheckbox;
