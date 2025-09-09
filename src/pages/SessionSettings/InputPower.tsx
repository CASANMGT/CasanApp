import { useDispatch } from "react-redux";
import { POWER_SESSION } from "../../common";
import { NominalTopUpItem, Separator } from "../../components";
import { setFromGlobal } from "../../features";
import { rupiah } from "../../helpers";
import { AppDispatch } from "../../store";

const InputPower: React.FC<CreateSessionItemProps> = ({
  value,
  form,
  calculate,
  onChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <p className="text-xs text-black90 mb-[14px]">
        Silakan <span className="font-bold text-xs">masukkan daya</span>{" "}
        pengisian yang sesuai dengan kebutuhan anda
      </p>

      <div className="center-y rounded-lg bg-baseGray mb-3 px-5 pb-[14px]">
        <span
          onClick={() =>
            dispatch(setFromGlobal({ type: "openInputPower", value: true }))
          }
          className={`text-base font-medium cursor-pointer text-center w-full pt-4 pb-3 ${
            form.value ? "" : "text-black30"
          }`}
        >
          {form.value ? form.value : "Masukan Daya"}
        </span>

        <Separator className="bg-black10 mb-3" />

        <p className="text-xs text-black70">
          Biaya:{" "}
          <span className="font-semibold text-primary100">{`Rp${rupiah(
            calculate || 0
          )}`}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {POWER_SESSION.map((item, index: number) => (
          <NominalTopUpItem
            key={index}
            type="power"
            value={item}
            isActive={
              Number(item) ===
              Number(form?.value ? form?.value.replace(" kWh", "") : 0)
            }
            onClick={() => onChange(`${item} kWh`)}
          />
        ))}
      </div>
    </>
  );
};

export default InputPower;
