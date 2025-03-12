import { useSelector } from "react-redux";
import { LoadingPage, OrderCard } from "../../components";
import { AppDispatch, RootState } from "../../store";
import { SessionListBody } from "../../common";
import { fetchCompleteSessionList } from "../../features";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const CompletedOrder = () => {
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
      status: 1,
    };
    dispatch(fetchCompleteSessionList(body));
  };

  return (
    <LoadingPage loading={completeSessionList?.loading} color="primary100">
      <div className="mb-[100px]">
        {completeSessionList?.data?.data &&
          completeSessionList?.data.data.map((item, index) => (
            <OrderCard key={index} data={item} position={index} />
          ))}
      </div>
    </LoadingPage>
  );
};

export default CompletedOrder;
