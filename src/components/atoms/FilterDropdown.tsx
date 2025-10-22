import { useEffect, useRef, useState } from "react";
import { HiOutlineFilter } from "react-icons/hi";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import Separator from "./Separator";

const options = ["Uwinfly", "United", "Maka Motors"];

interface Props {}

const FilterDropdown: React.FC<Props> = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(["United", "Maka Motors"]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full center bg-baseLightGray/70"
      >
        <HiOutlineFilter size={20} className="text-primary100" />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-200 origin-top-right
        ${
          open
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="py-1">
          {options.map((item, index) => (
            <li
              key={item}
              onClick={() => toggleSelect(item)}
              className="flex-cols items-center justify-between cursor-pointer hover:bg-gray-50"
            >
              {index > 0 && <Separator />}

              <div className="row gap-2 py-3 px-4">
                <span className="text-black100 font-medium flex-1">{item}</span>
                {selected.includes(item) ? (
                  <MdCheckBox size={20} className="text-primary100" />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} className="text-black50" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterDropdown;
