import { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineFilter } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { ILNoImage } from "../assets";
import { Button, FilterDropdown, Header2, InputSearch, Separator } from "../components";
import { rupiah } from "../helpers";

const RentToBuy = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>();

  return (
    <div className="container-screen relative overflow-hidden">
      <Header2
        title="Sewa Untuk Beli"
        onDismiss={() => navigate(-1)}
        iconRight={CiCircleInfo}
        onPress={() => {}}
      />

      <div className="px-4 py-6 background-1 relative  overflow-hidden flex-1 flex flex-col">
        <div className="row gap-3 mb-5">
          <InputSearch
            value={search}
            placeholder="Cari Motor Listrik"
            onChange={(e) => setSearch(e)}
          />

          <FilterDropdown />
        </div>

        <div className="overflow-auto scrollbar-none flex-1">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3].map((e, index) => (
              <RentToBuyItem key={index} onClick={() => navigate('/rent-to-buy-details')} />
            ))}
          </div>

          <div className="h-20"/>
        </div>
      </div>
    </div>
  );
};

export default RentToBuy;

interface RentToBuyItemProps {
  onClick: () => void;
}

export const RentToBuyItem: React.FC<RentToBuyItemProps> = ({ onClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full">
      {/* Image Section */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center">
        <img
          src={ILNoImage}
          alt={"photo"}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1">
        <h3 className="text-xs font-medium text-blackBold">Uwinfly Seri C70</h3>

        <span className="inline-block text-[8px] bg-primary10 text-primary100 font-medium px-1.5 py-1 rounded">
          {"Sepedah Listrik"}
        </span>

        <p className="text-[10px] text-black100">500W 48V 12Ah (jarak 35km)</p>

        <Separator />

        <p className="font-medium text-blackBold">
          {`Rp${rupiah(0)}`}{" "}
          <span className="text-black70 font-normal">/hari</span>
        </p>

        <Button label="Sewa Beli" onClick={onClick} />
      </div>
    </div>
  );
};
