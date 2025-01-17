import { IcEditGreen } from "../../assets";
import { NominalTopUpItem, Separator } from "../../components";
import { rupiah } from "../../helpers";

const hourDataDummy = [1, 2, 3];

const InputHour = () => {
  const onEditChargingFee = () => {
    alert("coming soon");
  };

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">
        Silakan masukan waktu pengisian sesuai dengan daya kebutuhan anda
      </p>

      <div className="grid grid-cols-2 gap-3">
        {hourDataDummy.map((_, index: number) => (
          <NominalTopUpItem key={index} isActive={true} />
        ))}
      </div>

      <Separator className="my-4 bg-black10" />

      <div>
        <p className="text-blackBold mb-2.5 font-medium">Biaya Pengecasan</p>

        <div className="between py-4 px-3 bg-primary100/10 rounded-lg">
          <div
            onClick={onEditChargingFee}
            className="row gap-2.5 cursor-pointer"
          >
            <p className="text-primary100 font-medium">48V 2A</p>

            <IcEditGreen />
          </div>

          <p className="text-lg font-semibold">Rp{rupiah(9000)}</p>
        </div>
      </div>
    </>
  );
};

export default InputHour;
