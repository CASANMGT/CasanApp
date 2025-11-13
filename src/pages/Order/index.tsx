import { TabSwipe } from "../../components";
import CompletedOrder from "./CompletedOrder";
import OngoingOrder from "./OngoingOrder";

const tabs = [
  { label: "Berlangsung", content: <OngoingOrder /> },
  {
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

      {/* <TabSwipe style="primary100" tabs={tabs} /> */}
    </div>
  );
};

export default Order;
