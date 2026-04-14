import { IoIosInformationCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { IcBackWhite } from "../../assets";
import { ProgressBar2, TabSwipe } from "../../components";
import History from "./History";
import Package from "./Package";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { resetDataAddTransactionRTO } from "../../features";

const BuyCredit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const addTransactionRTO = useSelector(
    (state: RootState) => state?.addTransactionRTO
  );

  const [data, setData] = useState<RTOProps | undefined>();

  useEffect(() => {
    if (state) setData(state);
    else navigate(-1);
  }, [state]);

  useEffect(() => {
    if (addTransactionRTO?.data) {
      navigate(
        `/transaction-rto-history/details/${addTransactionRTO?.data?.ID}`,
        {
          replace: true,
          state: { isGoOrder: true },
        }
      );

      dispatch(resetDataAddTransactionRTO());
    }
  }, [addTransactionRTO?.data]);

  const paidDays = data?.CreditPaid ?? 0;
  const leftDays = data?.CreditLeft ?? 0;
  const totalHariProgram = paidDays + leftDays > 0 ? paidDays + leftDays : data?.Payment || 1;
  /** Bar selaras dengan teks "X/Y hari terbayar" */
  const progressPercent =
    totalHariProgram > 0
      ? Math.min(100, Math.max(0, (paidDays / totalHariProgram) * 100))
      : 0;

  return (
    <div className="container-screen overflow-hidden justify-between flex flex-col">
      {/* HEADER */}
      <div
        className="p-4"
        style={{
          background: `linear-gradient(270deg, #21927B, #327478)`,
        }}
      >
        <div className="row gap-4 cursor-pointer mb-8 items-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="flex items-center"
          >
            <IcBackWhite />
          </div>

          <h4 className="font-semibold text-white flex-1 select-none">
            Beli Kredit
          </h4>

          <button
            type="button"
            title="Informasi paket kredit dan pembayaran"
            aria-label="Informasi paket kredit"
            className="cursor-pointer rounded-full p-1 transition-opacity hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: buka bottom sheet / halaman bantuan jika tersedia
            }}
          >
            <IoIosInformationCircleOutline size={22} className="text-white" />
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-white/90">Saldo kredit</span>
          <div className="row items-baseline gap-1.5 text-white">
            <span className="text-3xl font-bold tabular-nums">{data?.CreditLeft ?? 0}</span>
            <span className="text-sm font-medium">hari tersisa</span>
          </div>
          <p className="text-[11px] leading-snug text-white/75">
            Beli paket di bawah untuk menambah hari kredit sebelum jatuh tempo.
          </p>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[10px] text-white/80">
              <span>Progres program</span>
              <span className="tabular-nums font-medium text-white">
                {paidDays}/{totalHariProgram} hari terbayar
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={Math.round(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progres pembayaran program"
            >
              <ProgressBar2 percent={progressPercent} />
            </div>
          </div>

          {/* <div className="row gap-1.5 text-white">
            <span className="text-xs">Kredit Habis:</span>
            <span className="text-xs font-medium">
              {moments(data?.NextPaymentDate || undefined)
                .add(1, "days")
                .format("dddd, DD MMMM YYYY")}
            </span>
            <span className="text-xs font-medium">{data?.CutOffTime}</span>
          </div> */}
        </div>
      </div>

      {/* BODY */}
      <TabSwipe style="white" tabs={PROGRAM_TABS({ data: data })} />
    </div>
  );
};

export default BuyCredit;

export const PROGRAM_TABS = ({ data }: { data?: RTOProps | undefined }) => [
  {
    label: "Paket",
    content: <Package data={data} />,
  },
  {
    label: "Riwayat",
    content: <History data={data} />,
  },
];
