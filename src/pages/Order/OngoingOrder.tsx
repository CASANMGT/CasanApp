import { useEffect } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcBike2, ILOrderEmpty } from "../../assets";
import { EmptyList, LoadingPage, OrderCard } from "../../components";
import { fetchOnGoingSessionList } from "../../features";
import { AppDispatch, RootState } from "../../store";

const OngoingOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const body = {
      page: 1,
      limit: 10,
      is_finish: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
  };

  const onNext = (select: Session) => {
    let url: string;
    let id: number = select?.ID;

    if (select?.Status === 1) {
      id = select?.TransactionID;
      url = "/transaction-history/details";
    } else if (
      select?.Status === 2 ||
      select?.Status === 3 ||
      select?.Status === 4 ||
      select?.Status === 5
    )
      url = "/charging";
    else url = "/session-details";

    navigate(`${url}/${id}`);
  };

  return (
    <LoadingPage
      loading={onGoingSessionList?.loading && !onGoingSessionList?.data}
      color="primary100"
    >
      <div className="mb-[100px]">
        {/* dummy */}
        {false && (
          <div
            onClick={() => navigate("/rental-history")}
            className="row gap-2 mx-4 mt-6 rounded-lg bg-gradient-to-b from-[#2DBA9D] to-[#327478] px-4 py-3 cursor-pointer"
          >
            <IcBike2 />

            <span className="flex-1 text-white text-base font-medium">
              Riwayat Sewa
            </span>

            <FaChevronRight className="text-white" />
          </div>
        )}

        {onGoingSessionList?.data?.data &&
        onGoingSessionList?.data?.data.length ? (
          onGoingSessionList?.data.data.map((item: any, index: number) => (
            <OrderCard
              key={index}
              data={item}
              position={index}
              onClick={() => onNext(item)}
              onClaim={(id) => navigate(`/voucher/details/${id}`)}
            />
          ))
        ) : (
          <EmptyList
            image={ILOrderEmpty}
            title="Belum ada riwayat"
            description="Ayo pakai Casan untuk mengisi daya."
          />
        )}
      </div>
    </LoadingPage>
  );
};

export default OngoingOrder;
