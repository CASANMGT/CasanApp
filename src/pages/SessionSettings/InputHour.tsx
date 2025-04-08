import { useDispatch, useSelector } from "react-redux";
import { IcEditGreen } from "../../assets";
import { FormSession, HOUR_SESSION } from "../../common";
import { NominalTopUpItem, Separator } from "../../components";
import { setFromGlobal } from "../../features";
import {
  convertToHours,
  formatDuration,
  formatMinutesToHHMM,
  rupiah,
  timeToSeconds,
} from "../../helpers";
import { AppDispatch, RootState } from "../../store";

interface InputHourProps {
  value: string;
  form: FormSession;
  onChange: (value: string) => void;
}

const InputHour: React.FC<InputHourProps> = ({ value, form, onChange }) => {
  const dispatch = useDispatch<AppDispatch>();

  const calculateCharge = useSelector(
    (state: RootState) => state.calculateCharge
  );

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
          Harga{" "}
          <span className="font-semibold text-primary100">{`Rp${rupiah(
            calculateCharge?.data || 0
          )}`}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {HOUR_SESSION.map((item, index: number) => (
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
      <Separator className="my-4" />

      <div className="between-x p-3 rounded-lg bg-primary10 ">
        <span className="text-xs text-black70">Spesifikasi:</span>
        <div className="row font-medium">
          <span className="text-xs">{form.voltage?.name}</span>
          <span className="text-xs ml-1.5 mr-3">{form.ampere?.name}</span>
          <span className="text-xs mr-2.5">{`${(
            Number(form?.voltage?.value || 0) * Number(form?.ampere?.value || 0)
          ).toFixed(0)}W`}</span>
          <div
            onClick={() =>
              dispatch(setFromGlobal({ type: "openVA", value: true }))
            }
            className="cursor-pointer"
          >
            <IcEditGreen />
          </div>
        </div>
      </div>

      <p className="mt-3 text-black90 text-xs">
        *Durasi masih{" "}
        <span className="text-black100 font-medium text-xs">perkiraan</span>,
        bukan angka yang sesungguhnya.
      </p>
    </>
  );
};

export default InputHour;
