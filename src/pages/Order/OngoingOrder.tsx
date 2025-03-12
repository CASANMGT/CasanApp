import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SessionListBody } from "../../common";
import { LoadingPage, OrderCard } from "../../components";
import { fetchOnGoingSessionList } from "../../features";
import { AppDispatch, RootState } from "../../store";

const OngoingOrder = () => {
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

  return (
    <LoadingPage loading={onGoingSessionList?.loading} color="primary100">
      <div className="mb-[100px]">
        {onGoingSessionList?.data?.data &&
          onGoingSessionList?.data.data.map((item, index) => (
            <OrderCard key={index} data={item} position={index} />
          ))}
      </div>
    </LoadingPage>
  );
};

export default OngoingOrder;
