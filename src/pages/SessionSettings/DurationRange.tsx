import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { IcEditGreen, IcInfoCircleGreen } from "../../assets";
import { setFromGlobal } from "../../features";
import { AppDispatch } from "../../store";

interface DurationRangeProps {
  form: FormSession;
}

const DurationRange: React.FC<DurationRangeProps> = ({ form }) => {
  const dispatch = useDispatch<AppDispatch>();

  const formateCalculate = useCallback(() => {
    let value: string = "-";

    return value;
  }, [form.selectedTab]);

  return (
    <div className="bg-white p-3 rounded-lg mb-3 drop-shadow">
      <div className="row gap-3 mb-2">
        <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
          <IcInfoCircleGreen />
        </div>

        <p className="text-blackBold font-medium">
          {form?.selectedTab === "1" ? "Kisaran Durasi:" : "Biaya Pengecasan:"}
        </p>
      </div>

      {form?.selectedTab === "1" ? (
        <p className="text-xs text-black100/70 mb-[14px]">
          Durasi masih{" "}
          <span className="text-bold text-xs text-black">perkiraan</span>, bukan
          angka yang sesungguhnya.
        </p>
      ) : (
        <p className="text-xs text-black100/70 mb-[14px]">
          Biaya pengecasan berdasarkan Waktu dan Spesifikasi
        </p>
      )}

      <div className="between-x py-4 px-3 bg-primary100/10 rounded-lg">
        <div>
          <p className="text-xs text-black70 mb-2">Spesifikasi:</p>
          <div
            onClick={() =>
              dispatch(
                setFromGlobal({
                  type: "openVA",
                  value: true,
                })
              )
            }
            className="row gap-2.5 cursor-pointer"
          >
            <p className="font-medium">{`${0}V ${0}A`}</p>

            <IcEditGreen />
          </div>
        </div>

        <div className="w-2/5">
          <p className="text-xs text-black70 mb-2">
            {form?.selectedTab === "1"
              ? "Kisaran Durasi:"
              : "Biaya Pengecasan:"}
          </p>
          <p className="text-lg font-semibold">{formateCalculate()}</p>
        </div>
      </div>
    </div>
  );
};

export default DurationRange;
