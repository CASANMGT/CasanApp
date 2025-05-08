import { IcDelete } from "../../../assets";
import { BankAccountList } from "../../../common";
import { Separator } from "../../atoms";

interface Props {
  data: BankAccountList;
  onDelete: () => void;
}

const BankAccountCard: React.FC<Props> = ({ data, onDelete }) => {
  return (
    <div className="p-3 bg-white rounded-lg mb-4">
      <p className="text-blackBold text-xs font-medium">
        {`${data?.Code?.replace("ID_", "")}`}
        <span className="text-black100 text-xs">{` - ${data?.Number}`}</span>
      </p>

      <span className="uppercase text-xs">{data?.Name}</span>

      <Separator className="my-3" />

      <div onClick={onDelete} className="row cursor-pointer">
        <IcDelete />

        <span className="ml-1 text-red text-xs font-medium">
          Hapus Rekening Bank
        </span>
      </div>
    </div>
  );
};

export default BankAccountCard;
