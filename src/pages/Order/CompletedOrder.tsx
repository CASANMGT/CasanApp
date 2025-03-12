import { OrderCard } from "../../components";

const dataDummy = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const CompletedOrder = () => {
  return (
    <div className="mb-[100px]">
      {dataDummy.map((_, index: number) => (
        <OrderCard key={index} position={index} />
      ))}
    </div>
  );
};

export default CompletedOrder;
