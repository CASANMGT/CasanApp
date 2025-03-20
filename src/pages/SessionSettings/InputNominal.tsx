import { IcEditGreen } from "../../assets";
import { FormSession, REGEX_NUMBERS } from "../../common";
import { Button, NominalTopUpItem, Separator } from "../../components";
import { FormAction, rupiah } from "../../helpers";
import DurationRange from "./DurationRange";

interface InputNominalProps {
  value: string;
  description: string;
  balance?: number;
  loading?: boolean;
  form?: FormSession;
  dataNominal: string[];
  onChange: (value: string) => void;
  onCalculate?: () => void;
}

const InputNominal: React.FC<InputNominalProps> = ({
  value,
  description,
  loading,
  balance,
  dataNominal,
  form,
  onChange,
  onCalculate,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    onChange(formatted);
  };

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">{description}</p>

      <div className="h-[56px] center relative  rounded-lg bg-baseGray mb-3">
        <div className="absolute p-2 bottom-0 right-0 ">
          <IcEditGreen />
        </div>

        <input
          type={"number"}
          placeholder={"0"}
          value={value}
          onChange={handleChange}
          className="z-10 w-auto text-center p-5 w-full text-base font-semibold bg-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dataNominal.map((item, index: number) => (
          <NominalTopUpItem
            key={index}
            value={item}
            isActive={
              Number(item === "full" ? balance : item) ===
              Number(value.replace("Rp", "").replace(/\./g, ""))
            }
            onClick={() => {
              let value = "";
              if (item === "full" && balance && balance > 0)
                value = balance.toString();
              else value = item;

              onChange(`Rp${rupiah(value)}`);
            }}
          />
        ))}
      </div>

      {onCalculate && (
        <>
          <Separator className="my-[14px]" />

          {form && <DurationRange form={form} />}

          <Button
            type="secondary"
            label="Hitung Durasi"
            loading={loading}
            disabled={!Number(value.replace("Rp", "").replace(/\./g, ""))}
            onClick={onCalculate}
          />
        </>
      )}
    </>
  );
};

export default InputNominal;
