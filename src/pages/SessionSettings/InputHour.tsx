import { IcEditGreen } from "../../assets";
import { FormSession, NOMINAL } from "../../common";
import { Button, NominalTopUpItem, Separator } from "../../components";
import { convertToHours } from "../../helpers";
import DurationRange from "./DurationRange";

interface InputHourProps {
  value: string;
  loading:boolean
  form: FormSession;
  onChange: (value: string) => void;
  onOpen: () => void;
  onCalculate: () => void;
}

const InputHour: React.FC<InputHourProps> = ({
  value,
  loading,
  form,
  onChange,
  onOpen,
  onCalculate,
}) => {
  const validation = (select: string) => {
    let condition = false;
    const convert = convertToHours(value);

    if (String(convert) === select) condition = true;

    return condition;
  };

  const handleChange = (select: string) => {
    if (select !== "full") {
      const newValue: string = `${String(select).padStart(2, "0")}:00`;

      onChange(newValue);
    }
  };

  const splitValue: string[] = value.split(":");

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">
        Silakan masukkan waktu pengisian sesuai dengan daya kebutuhan anda
      </p>

      <div
        onClick={onOpen}
        className="h-[56px] center relative rounded-lg bg-baseGray mb-3 cursor-pointer"
      >
        <div className="absolute p-2 bottom-0 right-0 ">
          <IcEditGreen />
        </div>

        <div className="flex justify-end space-x-1 text-black70 text-lg font-semibold">
          <span className="text-base text-black100">{splitValue[0]}</span>
          <span className="text-[10px]">Jam</span>
          <span className="text-base text-black100">{splitValue[1]}</span>
          <span className="text-[10px]">Menit</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {NOMINAL.map((item, index: number) => (
          <NominalTopUpItem
            key={index}
            value={item}
            isActive={validation(item)}
            isHour
            onClick={() => {
              handleChange(item);
            }}
          />
        ))}
      </div>

      <Separator className="my-[14px]" />

      <DurationRange form={form} />

      <Button
        type="secondary"
        label="Hitung Biaya"
        loading={loading}
        disabled={value === "00:00"}
        onClick={onCalculate}
      />
    </>
  );
};

export default InputHour;
