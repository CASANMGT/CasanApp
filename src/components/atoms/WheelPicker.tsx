import React, { useCallback, useRef, useState } from "react";

const hours = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minutes = ["00", "15", "30", "45"];

const ITEM_HEIGHT = 28; // Adjust based on Tailwind styles

const WheelPicker: React.FC = () => {
  const [selectedHour, setSelectedHour] = useState(hours[0]);
  const [selectedMinute, setSelectedMinute] = useState(minutes[0]);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure perfect centering on scroll stop
  const handleScrollEnd = useCallback(
    (
      ref: React.RefObject<HTMLDivElement>,
      items: string[],
      setSelected: (val: string) => void
    ) => {
      if (!ref.current) return;

      const scrollTop = ref.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      setSelected(items[Math.min(items.length - 1, Math.max(0, index))]);

      // Snap to the closest item
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
    },
    []
  );

  // Debounce scrolling to avoid continuous updates
  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    items: string[],
    setSelected: (val: string) => void
  ) => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      handleScrollEnd(ref, items, setSelected);
    }, 200); // Adjust delay for better UX
  };

  // Render picker column
  const renderPicker = (
    items: string[],
    selected: string,
    setSelected: (val: string) => void,
    ref: React.RefObject<HTMLDivElement>
  ) => (
    <div className="w-16 h-[84px] overflow-hidden relative flex flex-col items-center">
      <div
        ref={ref}
        className="w-full h-full overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        onScroll={() => handleScroll(ref, items, setSelected)}
      >
        <div className="h-[28px]"></div> {/* Top Spacer for centering */}
        {items.map((item) => (
          <div
            key={item}
            className={`snap-center text-center py-0 text-lg transition ${
              selected === item ? "font-medium text-primary100" : "text-black50"
            }`}
          >
            {item}
          </div>
        ))}
        <div className="h-[28px]"></div> {/* Bottom Spacer for centering */}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center gap-4 p-4 bg-white rounded-xl shadow-lg">
      <div className="absolute top-1/2 left-0 w-full h-[28px] bg-primary10 transform -translate-y-1/2 pointer-events-none rounded-md"></div>

      {renderPicker(hours, selectedHour, setSelectedHour, hourRef)}
      {renderPicker(minutes, selectedMinute, setSelectedMinute, minuteRef)}
    </div>
  );
};

export default WheelPicker;
