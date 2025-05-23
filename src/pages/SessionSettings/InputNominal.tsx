import { useDispatch, useSelector } from "react-redux";
import { IcEditGreen } from "../../assets";
import { FormSession } from "../../common";
import { NominalTopUpItem, Separator } from "../../components";
import { setFromGlobal } from "../../features";
import { formatDuration, rupiah } from "../../helpers";
import { AppDispatch, RootState } from "../../store";

interface InputNominalProps {
  form: FormSession;
  description: string;
  balance?: number;
  dataNominal: string[];
  onChange: (value: string) => void;
}

const InputNominal: React.FC<InputNominalProps> = ({
  form,
  description,
  balance,
  dataNominal,
  onChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const calculateDuration = useSelector(
    (state: RootState) => state.calculateDuration
  );

  return (
    <>
      <p className="text-xs text-black100/70 mb-[14px]">{description}</p>

      <div className="center-y rounded-lg bg-baseGray mb-3 px-5 pb-[14px]">
        <span
          onClick={() =>
            dispatch(setFromGlobal({ type: "openInputNominal", value: true }))
          }
          className={`text-base font-medium cursor-pointer text-center w-full pt-4 pb-3 ${
            form.nominal ? "" : "text-black30"
          }`}
        >
          {form.nominal ? form.nominal : "Masukan Nominal"}
        </span>

        <Separator className="bg-black10 mb-3" />

        <p className="text-xs text-black70">
          Kisaran Durasi{" "}
          <span className="font-semibold text-primary100">
            {calculateDuration?.data
              ? formatDuration(calculateDuration?.data || 0)
              : "0"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dataNominal.map((item, index: number) => (
          <NominalTopUpItem
            key={index}
            value={item}
            isActive={
              Number(item === "full" ? balance : item) ===
              Number(form.nominal.replace("Rp", "").replace(/\./g, ""))
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

export default InputNominal;
