import { CiCircleInfo } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ILNoImage } from "../assets";
import { Header2 } from "../components";

const SelectRentBuy = () => {
  const navigate = useNavigate();

  return (
    <div className="container-screen">
      <Header2
        title="Pilih Program Sewa Beli"
        onDismiss={() => navigate(-1)}
        iconRight={CiCircleInfo}
        onPress={() => {}}
      />

      <div className="background-1 py-6 px-4">
        {[1, 2, 3].map((e, index) => (
          <RentBuyItem key={index} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default SelectRentBuy;

interface RentBuyItemProps {
  onClick: () => void;
}

export const RentBuyItem: React.FC<RentBuyItemProps> = ({ onClick }) => {
  return (
    <div className="row gap-3 px-[14px] py-2.5 rounded-lg bg-white mb-3 cursor-pointer">
      <img
        src={ILNoImage}
        alt="photo"
        className="w-18 h-18 rounded-lg"
        style={{
          background: `linear-gradient(270deg, #19ACB6, #2DBA9D)`,
        }}
      />
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-base text-blackBold font-semibold">
          Gebyar Winfly
        </span>
        <span className="text-xs text-blackBold font-medium">
          Gebyar Winfly
        </span>
        <p className="text-xs text-black90">
          Tersedia: <span className="text-xs font-medium">Smoot, Winfly</span>
        </p>
      </div>
      <FaChevronRight size={20} />
    </div>
  );
};
