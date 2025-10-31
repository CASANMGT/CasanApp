import { useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ILNoImage } from "../assets";
import { ERROR_MESSAGE } from "../common";
import { Header2, LoadingPage } from "../components";
import { Api } from "../services";

const SelectDealer = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminProps[]>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await Api.get({
          url: "admins/manufacturers",
        });

        setData(res?.data);
      } catch (error) {
        console.error("Get manufacture errors: ", error);
        alert(ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="container-screen">
      <Header2
        title="Pilih Dealer"
        onDismiss={() => navigate(-1)}
        iconRight={CiCircleInfo}
        onPress={() => {}}
      />

      <div className="background-1 py-6 px-4">
        <LoadingPage loading={loading}>
          {(data || []).map((e, index) => (
            <DealerItem
              key={index}
              data={e}
              onClick={() => navigate(`/select-rent-buy/${e?.ID}`)}
            />
          ))}
        </LoadingPage>
      </div>
    </div>
  );
};

export default SelectDealer;

interface DealerItemProps {
  data: AdminProps;
  onClick: () => void;
}

export const DealerItem: React.FC<DealerItemProps> = ({ data, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="row gap-3 px-[14px] py-2.5 rounded-lg bg-white mb-3 cursor-pointer"
    >
      <img
        src={data?.Logo || ILNoImage}
        alt="photo"
        className="w-12 h-12 rounded-md bg-primary10 border border-primary100"
      />
      <span className="flex-1 text-blackBold font-medium">{data?.Name}</span>
      <FaChevronRight size={20} />
    </div>
  );
};
