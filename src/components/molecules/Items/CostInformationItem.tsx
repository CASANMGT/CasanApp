import { rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface CostInformationItemProps {
  data: any;
  isLast: boolean;
}

const CostInformationItem: React.FC<CostInformationItemProps> = ({
  isLast,
  data,
}) => {
  return (
    <>
      <div className="between">
        <p className="text-primary100 font-medium">{data?.watt}</p>

        <div className="row">
          <p className="text-primary100 font-semibold text-[10px]">Rp</p>

          <p className="text-base ml-0.5 text-primary100 font-semibold">
            {`${rupiah(data?.price || 0)}/jam`}
          </p>
        </div>
      </div>

      {!isLast && <Separator className="bg-primary30 my-2.5" />}
    </>
  );
};

export default CostInformationItem;
