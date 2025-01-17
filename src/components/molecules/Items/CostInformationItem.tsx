import { Separator } from "../../atoms";

interface CostInformationItemProps {
  isLast: boolean;
}

const CostInformationItem: React.FC<CostInformationItemProps> = ({
  isLast,
}) => {
  return (
    <>
      <div className="between">
        <p className="text-xs text-primary100 font-medium">07:00 - 12:00 WIB</p>

        <div className="row">
          <p className="text-primary100 font-semibold text-[10px]">Rp</p>

          <p className="text-base ml-0.5 text-primary100 font-semibold">600/jam</p>

          <p className="ml-2 text-xs">0-200W</p>
        </div>
      </div>

      {!isLast && <Separator className="bg-primary30 my-2.5" />}
    </>
  );
};

export default CostInformationItem;
