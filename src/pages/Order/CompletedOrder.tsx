import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Session, SessionListBody } from "../../common";
import { EmptyList, LoadingPage, OrderCard } from "../../components";
import { fetchCompleteSessionList } from "../../features";
import { AppDispatch, RootState } from "../../store";

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
    const body: SessionListBody = {
      page: 1,
      limit: 10,
      is_finish: 1,
    };
    dispatch(fetchCompleteSessionList(body));
  };

  const onNext = (select: Session) => {
    let url: string;

    if (select?.Status === 1) url = "/transaction-history-details";
    else if (
      select?.Status === 2 ||
      select?.Status === 3 ||
      select?.Status === 4 ||
      select?.Status === 5
    )
      url = "/charging";
    else url = "/session-details";

    navigate(`${url}/${select?.ID}`);
  };

  return (
    <LoadingPage
      loading={completeSessionList?.loading && !completeSessionList?.data}
      color="primary100"
    >
      <div className="mb-[100px]">
        {completeSessionList?.data?.data &&
        completeSessionList?.data?.data.length ? (
          completeSessionList?.data.data.map((item, index) => (
            <OrderCard
              key={index}
              data={item}
              position={index}
              onClick={() => onNext(item)}
            />
          ))
        ) : (
          <EmptyList description="No Data" />
        )}
      </div>
    </LoadingPage>
  );
};

export default CompletedOrder;
