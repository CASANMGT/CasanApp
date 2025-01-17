import { IcFuelGreen } from "../../../assets";
import { rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface HistoryCardProps {
  position: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ position }) => {
  return (
    <div className={`mb-3 mx-4 ${position === 0 ? "mt-6" : ""}`}>
      <p className="text-xs font-medium mb-3 mt-6">{"Hari Ini"}</p>

      <div className="bg-white p-3 rounded-lg drop-shadow cursor-pointer">
        <div className="row gap-3">
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ddBLsjXELeexn4zWAEUxkClXVovj3Q_h2g&s"
            }
            alt="location 1"
            className="w-[50px] h-[50px] rounded-md"
          />

          <div className="flex flex-col justify-between">
            <p className="font-medium ">The Breeze</p>
            <p className="text-2-line text-xs text-black90">
              Jl. BSD Green Office Park Jl. BSD Grand Boulevard, Sampora, BSD,
              Kabupaten Tangerang - Banten
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="between">
          <div className="row gap-2">
            <div className="w-9 h-9 center rounded-full bg-primary100/10">
              <IcFuelGreen />
            </div>

            <div>
              <p className="font-medium">Menunggu Pembayaran</p>
              <div className="row gap-1">
                <div className="w-[14px] h-[14px] rounded-full bg-red-500" />

                <p className="text-xs font-medium">Dana</p>
              </div>
            </div>
          </div>

          <span className="font-semibold">Rp{rupiah(800)}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
