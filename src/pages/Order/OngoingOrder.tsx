import { useDispatch } from "react-redux";
import { HistoryCard } from "../../components";
import { AppDispatch, RootState } from "../../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const dataDummy = [1,2,3,4,5 ];

const OngoingOrder = () => {
  const dispatch = useDispatch<AppDispatch>();

  const sessionList = useSelector((state: RootState) => state.sessionList);

  useEffect(() => {
    getData()
  }, [])

  const getData=() => {

  }
  

  return (
    <div className="mb-[100px]">
        {dataDummy.map((_, index: number) => (
          <HistoryCard key={index} position={index} />
        ))}
    </div>
  );
};

export default OngoingOrder;
