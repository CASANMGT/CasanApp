import { useEffect, useRef, useState } from "react";

type WheelPickerProps = {
  values: string[];
  onChange: (value: string) => void;
};

const WheelPicker: React.FC<WheelPickerProps> = ({ values, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(values[0]);
  const listRef = useRef<HTMLUListElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to find and snap to the closest item
  const handleScroll = () => {
    if (!listRef.current) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const items = Array.from(listRef.current.children) as HTMLLIElement[];
      const containerCenter = listRef.current.getBoundingClientRect().top + listRef.current.clientHeight / 2;

      let closestItem = items[0];
      let closestDistance = Math.abs(items[0].getBoundingClientRect().top - containerCenter);

      items.forEach((item) => {
        const distance = Math.abs(item.getBoundingClientRect().top - containerCenter);
        if (distance < closestDistance) {
          closestItem = item;
          closestDistance = distance;
        }
      });

      if (closestItem) {
        const selected = closestItem.dataset.value || values[0];
        setSelectedValue(selected);
        onChange(selected);
        closestItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100); // Debounce for smooth snapping
  };

  // Scroll event listener
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative w-20 h-32 overflow-hidden">
      {/* Center Selection Line */}
      <div className="absolute top-1/2 left-0 w-full h-8 bg-green-100 opacity-50 transform -translate-y-1/2 pointer-events-none" />
      
      {/* Scrollable List */}
      <ul ref={listRef} className="overflow-y-auto h-full text-center scrollbar-hide snap-y snap-mandatory">
        {values.map((value) => (
          <li
            key={value}
            data-value={value}
            className={`py-2 cursor-pointer snap-center ${
              selectedValue === value ? "text-blue-500 font-bold bg-blue-100 rounded-lg" : ""
            }`}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

// **Example Usage**
const App = () => {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  return (
    <div className="flex justify-center items-center space-x-4 p-6">
      <WheelPicker values={hours} onChange={setSelectedHour} />
      <span className="text-lg font-semibold">:</span>
      <WheelPicker values={minutes} onChange={setSelectedMinute} />
    </div>
  );
};

export default App;
