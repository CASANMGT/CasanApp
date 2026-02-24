import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ILOrderEmpty } from "../../assets";
import { ERROR_MESSAGE } from "../../common";
import { Button, EmptyList, LoadingPage } from "../../components";
import { useAuth } from "../../context/AuthContext";
import { Api } from "../../services";
import CardRental from "./CardRental";

interface MetaResponseRentalProps {
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
  data: RentalProps[];
  meta: MetaResponseRentalProps;
}

const CompleteRTO = () => {
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
        url: "rentals",
        params: {
          statuses: "10",
          page: p || page,
          limit: l || limit,
          q,
        },
      });

      setData(res);
    } catch (error: any) {
      if (error?.response?.data?.message === "invalid token") {
        logout();
        navigate("login", { replace: true });
      } else alert(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingPage loading={loading} color="primary100">
      <div className="mb-[100px]">
        {data?.data && data?.data.length ? (
          data?.data.map((item: RentalProps, index: number) => (
            <CardRental
              key={index}
              data={item}
              position={index}
              onClick={() => navigate(`/rental-details/${item?.ID}`)}
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

export default CompleteRTO;
