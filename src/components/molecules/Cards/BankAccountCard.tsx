import { IcDelete } from "../../../assets";
import { Separator } from "../../atoms";

interface Props {}

const BankAccountCard: React.FC<Props> = () => {
  return (
    <div className="p-3 bg-white rounded-lg mb-4">
      <p className="text-blackBold text-xs font-medium">
        Bank Mandiri{" "}
        <span className="text-black100 text-xs"> - 1440024861665</span>
      </p>

      <span className="uppercase text-xs">Tedi Iman Priyono Tanto</span>

      <Separator className="my-3" />

      <div onClick={() => {}} className="row cursor-pointer">
        <IcDelete />

        <span className="ml-1 text-red text-xs font-medium">
          Hapus Rekening Bank
        </span>
      </div>
    </div>
  );
};

export default BankAccountCard;
