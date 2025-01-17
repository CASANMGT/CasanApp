import { useState } from "react";
import { Tabs } from "../../components";
import CompletedHistory from "./CompletedHistory";
import OngoingHistory from "./OngoingHistory";

const tabs = [
  { id: "ongoing", label: "Sedang Berlangsung", content: <OngoingHistory /> },
  {
    id: "completed",
    label: "Selesai",
    content: <CompletedHistory />,
  },
];

const History = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="container-screen flex flex-col justify-between">
      {/* HEADER */}
      <div className="bg-primary100 p-4">
        <h4 className="text-center  text-base text-white font-semibold">
          Riwayat
        </h4>
      </div>

      <Tabs type="secondary" tabs={tabs} />
    </div>
  );
};

export default History;
