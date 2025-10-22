import { useNavigate } from "react-router-dom";
import { Header, Header2 } from "../components";
import { CiCircleInfo } from "react-icons/ci";
import { ILNoImage } from "../assets";
import { FaChevronRight } from "react-icons/fa6";

const SelectDealer = () => {
  const navigate = useNavigate();

  return (
    <div className="container-screen">
      <Header2
        title="Pilih Dealer"
        onDismiss={() => navigate(-1)}
        iconRight={CiCircleInfo}
        onPress={() => {}}
      />

      <div className="background-1 py-6 px-4">
        {[1, 2, 3].map((e, index) => (
          <DealerItem key={index} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default SelectDealer;

interface DealerItemProps {
  onClick: () => void;
}

export const DealerItem: React.FC<DealerItemProps> = ({ onClick }) => {
  return (
    <div className="row gap-3 px-[14px] py-2.5 rounded-lg bg-white mb-3 cursor-pointer">
      <img
        src={ILNoImage}
        alt="photo"
        className="w-12 h-12 rounded-sm bg-primary10 border border-primary100"
      />
      <span className="flex-1 text-blackBold font-medium">Dealer A</span>
      <FaChevronRight size={20} />
    </div>
  );
};
