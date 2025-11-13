import { useState } from "react";
import { useSwipeable } from "react-swipeable";

type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  style?: "white" | "primary100";
  tabs: Tab[];
};

const TabSwipe: React.FC<TabsProps> = ({ style, tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev < tabs.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-baseLightGray">
      {/* Tab Headers */}
      <div className={`flex p-4 bg-${style || "primary100"}`}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-2 px-1 text-center text-sm font-medium transition-colors
              ${
                activeIndex === index
                  ? `border-b-2 border-${
                      style === "white" ? "primary100" : "white"
                    } text-${
                      style === "white" ? "primary100" : "white"
                    } font-semibold`
                  : `text-${
                      style === "white" ? "primary100" : "white"
                    }/80 hover:text-${
                      style === "white" ? "primary100" : "white"
                    }`
              }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Swipe Support */}
      <div {...swipeHandlers} className="overflow-auto scrollbar-none">
        {tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default TabSwipe;
