import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ILOrderEmpty } from "../../assets";
import { ERROR_MESSAGE } from "../../common";
import { Button, EmptyList, LoadingPage } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { Api } from "../../services";
import CardRental from "./CardRental";

interface MetaResponseRTOProps {
  Approved: number;
  Finished: number;
  Holiday: number;
  Ongoing: number;
  Overdue: number;
  Rejected: number;
  Returned: number;
  Scheduled: number;
  Suspended: number;
  Terminated: number;
  Verifying: number;
  limit: number;
  page: number;
  pages: number;
  total: number;
}

interface ResponseProps {
  status: string;
  message: string;
  data: RTOProps[];
  meta: MetaResponseRTOProps;
}

const OngoingRental = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [data, setData] = useState<ResponseProps>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [page, limit]);

  const getData = async (p?: number, l?: number, q?: string) => {
    try {
      const res = await Api.get({
        url: "rtos",
        params: {
          statuses: "3,4,5,7,8",
          page: p || page,
          limit: l || limit,
          q,
        },
      });

      setData(res);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data?.message === "invalid token") {
        logout();
        navigate("login", { replace: true });
      } else alert(ERROR_MESSAGE);
    }
  };

  return (
    <LoadingPage loading={loading} color="primary100">
      <div className="mb-[100px]">
        {data?.data && data?.data.length ? (
          data?.data.map((item: RTOProps, index: number) => (
            <CardRental
              key={index}
              data={item}
              position={index}
              onClick={() => navigate(`/booking-details/${item?.ID}`)}
            />
          ))
        ) : (
          <div className="mx-10">
            <EmptyList
              image={ILOrderEmpty}
              title="Belum ada riwayat sewa"
              description="Ayo sewa kendaraan lewat Casan!"
            />

            <Button
              label="Mulai Sewa"
              iconRight={FaArrowRight}
              sizeIconRight={14}
              onClick={() => {}}
              className="mx-"
            />
          </div>
        )}
      </div>
    </LoadingPage>
  );
};

export default OngoingRental;
