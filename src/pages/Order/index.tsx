import { Tabs } from "../../components";
import CompletedOrder from "./CompletedOrder";
import OngoingOrder from "./OngoingOrder";

const tabs = [
  { id: "ongoing", label: "Berlangsung", content: <OngoingOrder /> },
  {
    id: "completed",
    label: "Selesai",
    content: <CompletedOrder />,
  },
];

const Order = () => {
  return (
    <div className="container-screen flex flex-col justify-between">
      {/* HEADER */}
      <div className="bg-primary100 p-4">
        <h4 className="text-center  text-base text-white font-semibold">
          Daftar Order
        </h4>
      </div>

      <Tabs type="secondary" tabs={tabs} />
    </div>
  );
};

export default Order;
