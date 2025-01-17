import { useState } from "react";

interface TabItemProps {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabProps {
  type?: "secondary";
  tabs: TabItemProps[];
  onSelect?: (value: string) => void;
}

const Tabs: React.FC<TabProps> = ({ type, tabs, onSelect }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const onSelectTab = (selectTab: TabItemProps) => {
    setActiveTab(selectTab?.id);

    if (onSelect) onSelect(selectTab?.id);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs Header */}

      <div
        className={`flex flex-row border-b border-black10 mb-2 ${
          type === "secondary" ? "bg-primary100 px-4 pb-4" : ""
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab)}
            className={`flex-1 py-2 px-4 text-center font-medium border-b-2 transition-colors duration-300 ${
              activeTab === tab.id
                ? type === "secondary"
                  ? "text-white font-semibold border-white"
                  : "text-primary100 font-semibold border-primary100"
                : type === "secondary"
                ? "text-white/80 border-white/20 hover:text-white"
                : "text-black50 border-transparent hover:text-primary100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      {tabs.map(
        (tab) =>
          tab?.id === activeTab && (
            <div key={tab.id} className="overflow-auto scrollbar-none">
              {tab?.content}
            </div>
          )
      )}
    </div>
  );
};

export default Tabs;
