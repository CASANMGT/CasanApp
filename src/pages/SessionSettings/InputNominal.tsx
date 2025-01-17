import { IcEditGreen } from "../../assets";
import { Button, NominalTopUpItem, Separator } from "../../components";
import { rupiah } from "../../helpers";

const nominalDataDummy = [1, 2, 3];

const InputNominal = () => {
  const onEditPrice = () => {
    alert("coming soon");
  };

  const onTopUp = () => {
    alert("coming soon");
  };

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">
        Silakan masukan nominal pengisian sesuai dengan daya kebutuhan anda
      </p>

      <div className="center relative p-5 rounded-lg bg-baseGray mb-3">
        <p className="text-base font-semibold">{`Rp${rupiah(8000)}`}</p>
        <div
          onClick={onEditPrice}
          className="absolute p-2 bottom-0 right-0 cursor-pointer"
        >
          <IcEditGreen />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {nominalDataDummy.map((_, index: number) => (
          <NominalTopUpItem key={index} isActive={true} />
        ))}
      </div>

      <Separator className="my-4 bg-black10" />

      <div className="p-5 bg-baseGray rounded-lg mt-3">
        <p className="w-9/12 text-xs">
          Isi sampai full menggunakan saldo tersimpan
        </p>

        <div className="between">
          <p className="text-blackBold text-xs font-semibold row gap-0.5">
            Rp <p className="text-lg">{rupiah(50000)}</p>
          </p>

          <Button
            className="!w-[70px]"
            buttonType="sm"
            label="Top Up"
            onClick={onTopUp}
          />
        </div>
      </div>
    </>
  );
};

export default InputNominal;
