import { HistoryCard } from "../../components";

const dataDummy = [1,2,3,4,5 ];

const OngoingHistory = () => {
  return (
    <div className="mb-[100px]">
        {dataDummy.map((_, index: number) => (
          <HistoryCard key={index} position={index} />
        ))}
    </div>
  );
};

export default OngoingHistory;
