import { IcEditGreen } from "../../assets";
import { REGEX_NUMBERS } from "../../common";
import { Button, NominalTopUpItem, Separator } from "../../components";
import { rupiah } from "../../helpers";

interface InputNominalProps {
  value: string;
  onChange: (value: string) => void;
}

const nominalDataDummy: string[] = ["400", "800", "1200", "full"];

const InputNominal: React.FC<InputNominalProps> = ({ value, onChange }) => {
  const onEditPrice = () => {
    alert("coming soon");
  };

  const onTopUp = () => {
    alert("coming soon");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    onChange(formatted);
  };

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">
        Silakan masukan nominal pengisian yang sesuai dengan daya pengisian tram
      </p>

      <div className="center relative  rounded-lg bg-baseGray mb-3">
        <input
          type={"text"}
          placeholder={"0"}
          value={value}
          onChange={handleChange}
          className="w-auto text-center p-5 w-full text-base font-semibold bg-transparent"
        />
        <div className="absolute p-2 bottom-0 right-0 ">
          <IcEditGreen />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {nominalDataDummy.map((item, index: number) => (
          <NominalTopUpItem
            key={index}
            value={item}
            isActive={
              Number(item) ===
              Number(value.replace("Rp", "").replace(/\./g, ""))
            }
            onClick={() =>
              onChange(`Rp${rupiah(item === "full" ? 50000 : item)}`)
            }
          />
        ))}
      </div>

      {false && (
        <>
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
      )}
    </>
  );
};

export default InputNominal;
