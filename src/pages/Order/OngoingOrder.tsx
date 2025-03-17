import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Session, SessionListBody } from "../../common";
import { LoadingPage, OrderCard } from "../../components";
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
    const body: SessionListBody = {
      page: 1,
      limit: 10,
      status: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
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
    <LoadingPage loading={onGoingSessionList?.loading} color="primary100">
      <div className="mb-[100px]">
        {onGoingSessionList?.data?.data &&
          onGoingSessionList?.data.data.map((item, index) => (
            <OrderCard
              key={index}
              data={item}
              position={index}
              onClick={() => onNext(item)}
            />
          ))}
      </div>
    </LoadingPage>
  );
};

export default OngoingOrder;
