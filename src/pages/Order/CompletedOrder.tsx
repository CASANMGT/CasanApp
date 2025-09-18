import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmptyList, LoadingPage, OrderCard } from "../../components";
import { fetchCompleteSessionList } from "../../features";
import { AppDispatch, RootState } from "../../store";
import { ILOrderEmpty } from "../../assets";

const CompletedOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const completeSessionList = useSelector(
    (state: RootState) => state.completeSessionList
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const body = {
      page: 1,
      limit: 10,
      is_finish: 1,
    };
    dispatch(fetchCompleteSessionList(body));
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
      loading={completeSessionList?.loading && !completeSessionList?.data}
      color="primary100"
    >
      <div className="mb-[100px]">
        {completeSessionList?.data?.data &&
        completeSessionList?.data?.data.length ? (
          completeSessionList?.data.data.map((item: Session, index: number) => (
            <OrderCard
              key={index}
              data={item}
              position={index}
              onClick={() => onNext(item)}
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

export default CompletedOrder;
