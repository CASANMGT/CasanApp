import { IcEditGreen } from "../../assets";
import { REGEX_NUMBERS } from "../../common";
import { Button, NominalTopUpItem, Separator } from "../../components";
import { rupiah } from "../../helpers";

interface InputNominalProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onCalculate: () => void;
}

const nominalDataDummy: string[] = ["400", "800", "1200", "full"];

const InputNominal: React.FC<InputNominalProps> = ({
  value,
  loading,
  onChange,
  onCalculate,
}) => {
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

      <div className="h-[56px] center relative  rounded-lg bg-baseGray mb-3">
        <div className="absolute p-2 bottom-0 right-0 ">
          <IcEditGreen />
        </div>

        <input
          type={"text"}
          placeholder={"0"}
          value={value}
          onChange={handleChange}
          className="z-10 w-auto text-center p-5 w-full text-base font-semibold bg-transparent"
        />
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
            onClick={() => {
              if (item !== "full") onChange(`Rp${rupiah(item)}`);
            }}
          />
        ))}
      </div>

      <Separator className="my-[14px]" />

      <Button
        type="secondary"
        label="Hitung Durasi"
        loading={loading}
        disabled={!Number(value.replace("Rp", "").replace(/\./g, ""))}
        onClick={onCalculate}
      />
    </>
  );
};

export default InputNominal;
