import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { TabSwipe } from "../../components";
import CompleteRTO from "./CompleteRTO";
import OngoingRTO from "./OngoingRTO";
import ScheduleRTO from "./ScheduleRTO";

const tabs = [
  { label: "Berlangsung", content: <OngoingRTO /> },
  { label: "Jadwal", content: <ScheduleRTO /> },
  {
    label: "Selesai",
    content: <CompleteRTO />,
  },
];

const RTOHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="container-screen flex flex-col justify-between">
      {/* HEADER */}
      <div className="bg-primary100 p-4 row">
        <button onClick={() => navigate(-1)} className="w-6 h-6 center ">
          <FaArrowLeft className="text-white" />
        </button>
        
        <h4 className="flex-1 text-center text-base text-white font-semibold">
          Riwayat RTO
        </h4>

        <div className="w-6"></div>
      </div>

      <TabSwipe tabs={tabs} />
    </div>
  );
};

export default RTOHistory;
