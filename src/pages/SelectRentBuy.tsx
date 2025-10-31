import { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { ILNoImage } from "../assets";
import { ERROR_MESSAGE } from "../common";
import { Header2, LoadingPage } from "../components";
import { Api } from "../services";

const SelectRentBuy = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProgramProps[]>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await Api.get({
          url: `programs/admins/${id}`,
          params: { page: 1, limit: 30 },
        });

        setData(res?.data);
      } catch (error) {
        console.error("Get program errors: ", error);
        alert(ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    if (id) getData();
    else {
      alert("Can't find ID");
      navigate(-1);
    }
  }, []);

  return (
    <div className="container-screen">
      <Header2
        title="Pilih Program Sewa Beli"
        onDismiss={() => navigate(-1)}
        iconRight={CiCircleInfo}
        onPress={() => {}}
      />

      <div className="background-1 py-6 px-4">
        <LoadingPage loading={loading}>
          {(data || []).map((e, index) => (
            <RentBuyItem key={index} data={e} onClick={() => {}} />
          ))}
        </LoadingPage>
      </div>
    </div>
  );
};

export default SelectRentBuy;

interface RentBuyItemProps {
  data: ProgramProps;
  onClick: () => void;
}

export const RentBuyItem: React.FC<RentBuyItemProps> = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="row gap-3 px-[14px] py-2.5 rounded-lg bg-white mb-3 cursor-pointer"
    >
      <div className="w-full max-w-16 aspect-square rounded-lg overflow-hidden bg-gradient-to-r from-[#19ACB6] to-[#2DBA9D]">
        <img
          src={data?.BannerURL || ILNoImage}
          alt="photo"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-base text-blackBold font-semibold">
          {data?.Name || "-"}
        </span>
        <span className="text-xs text-blackBold font-medium">
          {data?.Dealers?.map((e) => e?.Admin?.Name).join(", ") ?? "-"}
        </span>
        <p className="text-xs text-black90">
          Tersedia:{" "}
          <span className="text-xs font-medium">
            {data?.Vehicles?.map((e) => e?.VehicleModel?.ModelName).join(
              ", "
            ) ?? "-"}
          </span>
        </p>
      </div>
      <FaChevronRight size={20} />
    </div>
  );
};
