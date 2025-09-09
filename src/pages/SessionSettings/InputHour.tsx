import { useDispatch } from "react-redux";
import { IcEditGreen } from "../../assets";
import { HOUR_SESSION } from "../../common";
import { NominalTopUpItem, Separator } from "../../components";
import { setFromGlobal } from "../../features";
import {
  convertToHours,
  formatDuration,
  formatMinutesToHHMM,
  rupiah,
  timeToSeconds,
} from "../../helpers";
import { AppDispatch } from "../../store";

const InputHour: React.FC<CreateSessionItemProps> = ({
  value,
  form,
  calculate,
  onChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  //   const calculateCharge = useSelector(
  //     (state: RootState) => state.calculateCharge
  //   );

  const validation = (select: string) => {
    let condition = false;
    const convert: number = convertToHours(value);
    const current: number = Number(select || 1) / 60;

    if (convert === current) condition = true;

    return condition;
  };

  const handleChange = (select: string) => {
    if (select !== "full") {
      const newValue: string = formatMinutesToHHMM(Number(select));

      onChange(newValue);
    }
  };

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">
        Silakan masukkan waktu pengisian sesuai dengan daya kebutuhan anda
      </p>

      <div className="center-y rounded-lg bg-baseGray mb-3 px-5 pt-4 pb-[14px]">
        <span
          onClick={() =>
            dispatch(setFromGlobal({ type: "openInputHour", value: true }))
          }
          className={`text-base font-medium cursor-pointer ${
            value !== "00:00" ? "" : "text-black30"
          }`}
        >
          {value !== "00:00"
            ? formatDuration(timeToSeconds(value))
            : "Masukan Jam"}
        </span>

        <Separator className="bg-black10 my-3" />

        <p className="text-xs text-black70">
          Harga:{" "}
          <span className="font-semibold text-primary100">{`Rp${rupiah(
            calculate || 0
          )}`}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {HOUR_SESSION.map((item, index: number) => (
          <NominalTopUpItem
            type="hour"
            key={index}
            value={item}
            isActive={validation(item)}
            onClick={() => {
              handleChange(item);
            }}
          />
        ))}
      </div>
    </>
  );
};

export default InputHour;
