import { IcFuelGreen, IcFuelRed, IcShareGreen } from "../../../assets";

interface ChargingLocationCardProps {
  type?: "location-list";
  onClick: () => void;
}

const ChargingLocationCard: React.FC<ChargingLocationCardProps> = ({
  type,
  onClick,
}) => {
  const isFull: boolean = true;

  return (
    <div onClick={onClick} className="mb-3 cursor-pointer">
      <div className="p-3 bg-chargingLocation bg-center rounded-t-lg">
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

        <div
          className={`between ${
            type === "location-list"
              ? "mt-4"
              : "mt-[18px] bg-white/50 px-3 py-1 rounded"
          }`}
        >
          <div className="row gap-2.5">
            <div
              className={`h-[30px] w-[30px] rounded p-2 ${
                isFull ? "bg-lightRed" : "bg-primary100/10"
              }`}
            >
              {isFull ? <IcFuelRed /> : <IcFuelGreen />}
            </div>

            {isFull ? (
              <div>
                <p className="font-semibold text-xs text-red">Sedang Penuh</p>
                <p className="text-[10px] text-red">30 menit lagi</p>
              </div>
            ) : (
              <div className="flex flex-row gap-1 relative">
                <p className="text-lg font-semibold">{5}</p>
                <p className="text-xs self-end mb-1 text-black50 font-medium">
                  tersedia
                </p>
              </div>
            )}
          </div>

          <div className="row gap-2">
            <p className="text-xs text-primary100 font-medium">2km dari anda</p>

            <div className="p-[5px] rounded-full bg-primary10">
              <IcShareGreen />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-3 py-4 rounded-b-lg row gap-1">
        <p className="text-xs text-primary100 font-semibold">Rp</p>
        <p className="text-lg text-primary100 font-semibold mr-1">600/jam</p>
        <p className="text-xs text-black50">48V, 2A</p>
      </div>
    </div>
  );
};

export default ChargingLocationCard;
