import { IoIosInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IcBackWhite } from "../../assets";
import { ProgressBar2, TabSwipe } from "../../components";
import { moments } from "../../helpers";
import History from "./History";
import Package from "./Package";

const BuyCredit = () => {
  const navigate = useNavigate();

  return (
    <div className="container-screen overflow-hidden justify-between flex flex-col">
      {/* HEADER */}
      <div
        className="p-4"
        style={{
          background: `linear-gradient(270deg, #21927B, #327478)`,
        }}
      >
        <div className="row gap-4 cursor-pointer mb-8 items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="flex items-center"
          >
            <IcBackWhite />
          </div>

          <h4 className="font-semibold text-white flex-1 select-none">
            Beli Kredit
          </h4>

          <div
            onClick={(e) => {
              e.stopPropagation();
              alert("Info clicked");
            }}
            className="cursor-pointer"
          >
            <IoIosInformationCircleOutline size={20} className="text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-white text-xs font-semibold">Saldo Kredit</span>
          <div className="row gap-1.5 text-white">
            <span className="2xl font-bold">12</span>
            <span className="font-medium">Kredit Hari</span>
          </div>

          <ProgressBar2 percent={15} />

          <div className="row gap-1.5 text-white">
            <span className="text-xs">Kredit Habis:</span>
            <span className="text-xs font-medium">
              {moments().format("dddd, DD MMM YYYY")}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <TabSwipe style="white" tabs={tabs} />
    </div>
  );
};

export default BuyCredit;

const tabs = [
  { label: "Paket", content: <Package /> },
  {
    label: "Riwayat",
    content: <History />,
  },
];
