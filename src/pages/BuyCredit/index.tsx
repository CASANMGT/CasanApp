import { IoIosInformationCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { IcBackWhite } from "../../assets";
import { ProgressBar2, TabSwipe } from "../../components";
import { moments } from "../../helpers";
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
      navigate(`/transaction-rto-history/details/${addTransactionRTO?.data?.ID}`, {
        replace: true,
        state: { isGoOrder: true },
      });

      dispatch(resetDataAddTransactionRTO());
    }
  }, [addTransactionRTO?.data]);

  const dataDayCredit: RTOCreditProps | null =
    data?.DayCredits.filter((e) => e?.DayCount === 1)[0] ?? null;
  const current = data?.CreditPaid || 1;
  const total = data?.Payment || 1;

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

          <div
            onClick={(e) => {
              e.stopPropagation();
              alert("Info clicked");
            }}
            className="cursor-pointer"
          >
            <IoIosInformationCircleOutline size={20} className="text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-white text-xs font-semibold">Saldo Kredit</span>
          <div className="row gap-1.5 text-white">
            <span className="2xl font-bold">
              {(dataDayCredit?.DayCount || 0) * (data?.Payment || 0)}
            </span>
            <span className="font-medium">Kredit Hari</span>
          </div>

          <ProgressBar2 percent={(current / total) * 100} />

          <div className="row gap-1.5 text-white">
            <span className="text-xs">Kredit Habis:</span>
            <span className="text-xs font-medium">
              {moments(data?.NextPaymentDate || undefined)
                .add(1, "days")
                .format("DD MMMM YYYY")}
            </span>
          </div>
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
    content: <History data={data}/>,
  },
];
