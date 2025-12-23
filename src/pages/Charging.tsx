import { useEffect, useState } from "react";
import { FaAngleRight, FaChevronRight } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { HiOutlineTicket } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IcBattery,
  IcClockGreen,
  IcFlash,
  IcInfoCircleGreen,
  IcInfoCircleRed,
  IcMarkerSmall,
  IcStandBy,
  IcSuccessGreen,
  IcWalletGreen,
  ILCharging,
} from "../assets";
import {
  CalculateDurationBody,
  CUSTOMER_SERVICES,
  VoucherUsage,
} from "../common";
import {
  AlertModal,
  BetweenText,
  Button,
  DiagnosisModal,
  Header,
  LoadingPage,
  ModalInstructions,
  Signal,
  StatusIndicator,
} from "../components";
import {
  fetchCancelSession,
  fetchStartSession,
  fetchStopSession,
  hideLoading,
  resetDataAddSession,
  resetDataCancelSession,
  resetDataStartSession,
  resetDataStopSession,
  showLoading,
} from "../features";
import { formatDuration, moments, openWhatsApp, rupiah } from "../helpers";
import { Api } from "../services";
import { AppDispatch, RootState } from "../store";
import NotFound from "./NotFound";

const Charging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const startSession = useSelector((state: RootState) => state.startSession);
  const stopSession = useSelector((state: RootState) => state.stopSession);
  const cancelSession = useSelector((state: RootState) => state.cancelSession);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Session>();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [openDiagnosis, setOpenDiagnosis] = useState<boolean>(false);
  const [openFinished, setOpenFinished] = useState<boolean>(false);
  const [openStop, setOpenStop] = useState<boolean>(false);
  const [openCantProcess, setOpenCantProcess] = useState<boolean>(false);
  const [openInstruction, setOpenInstruction] = useState<boolean>(false);

  useEffect(() => {
    dispatch(resetDataAddSession());
    getData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      ((data?.MaxWatt || 0) <= 1 ||
        data?.Status === 3 ||
        data?.Status === 4 ||
        data?.Status === 5)
    ) {
      timeoutProgress();
    }
  }, [data]);

  useEffect(() => {
    if (startSession?.data) {
      setOpenDiagnosis(true);
      getData();
      dispatch(resetDataStartSession());
    } else if (startSession?.error) {
      setOpenCantProcess(true);
      dispatch(resetDataStartSession());
    }
  }, [startSession?.data]);

  useEffect(() => {
    if (stopSession?.data) {
      dispatch(resetDataStopSession());
      onNext();
    }
  }, [stopSession?.data]);

  useEffect(() => {
    if (cancelSession?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (cancelSession?.data) {
      dispatch(resetDataCancelSession());
      onNext();
    }
  }, [cancelSession]);

  const getData = async () => {
    try {
      if (id) {
        const res = await Api.get({
          url: `sessions/${id}`,
        });

        setData(res?.data);

        const resSession: Session = res?.data;
        const currentStatus = resSession?.Status;

        if (currentStatus === 6) {
          setOpenFinished(true);
        } else if (
          currentStatus === 1 ||
          currentStatus === 7 ||
          currentStatus === 8
        ) {
          navigate(
            `/transaction-history/details/${
              data?.Transaction?.ID || resSession?.Transaction?.ID
            }`,
            {
              replace: true,
              state: { isGoOrder: true },
            }
          );
        } else if (
          currentStatus === 2 &&
          resSession?.ChargingStationID &&
          resSession?.MaxWatt
        ) {
          const body: CalculateDurationBody = {
            id: resSession?.ChargingStationID,
            total_charge: Number(resSession?.Transaction?.Amount),
            vehicle_type: 1,
            watt: Number(resSession?.MaxWatt),
          };

          // dispatch(fetchCalculateDuration(body));
        }
      }
    } catch (error: any) {
      if (error?.message) setIsNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // over loop if status is charging
  const timeoutProgress = () => {
    const timer = setTimeout(() => {
      getData();
    }, 15000); // 15 second

    return () => clearTimeout(timer);
  };

  const onDismiss = () => {
    if (location?.state?.isGoOrder) navigate("/home/order");
    else navigate(-1);
  };

  const onStartStop = () => {
    if (status === 6) navigate("/home", { replace: true });
    else if (data?.ID) {
      if (status === 5) {
        setOpenStop(true);
      } else {
        if (status === 2 && data?.Device?.Protocol === 3)
          setOpenInstruction(true);
        dispatch(fetchStartSession(data?.ID));
      }
    }
  };

  const onNext = () => {
    navigate(`/session-details/${id}`, {
      replace: true,
      state: { isGoHome: true },
    });
  };

  let dataVoucher: VoucherUsage | undefined = undefined;
  const status: number | undefined = data?.Status;
  const duration: number = moments(data?.StartChargingTime)
    .add(data?.ExpectedDuration || 0, "seconds")
    .diff(moments(), "seconds");

  const isCharging: boolean = status === 5 || status === 6 ? true : false;

  if (data?.VoucherUsages && data?.VoucherUsages.length)
    dataVoucher = data?.VoucherUsages[0];

  if (!id || isNotFound) return <NotFound onDismiss={onDismiss} />;

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type={data?.Status !== 5 ? "cancel" : "charging"}
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
        onPress={() => {
          if (data?.Status !== 5) setOpenCancel(true);
          else openWhatsApp(CUSTOMER_SERVICES);
        }}
      />

      <LoadingPage loading={!data && loading} color="primary100">
        <div className="flex-1 overflow-auto scrollbar-none">
          {/* INFORMATION */}
          <div className="mx-4 bg-baseLightGray/60 rounded-lg flex justify-around py-3 px-8">
            <InformationItem
              icon={IcWalletGreen}
              label="Terpakai"
              content={`Rp${rupiah(data?.UsedAmount)}`}
            />

            <InformationItem
              icon={IcClockGreen}
              label="Durasi Pesanan"
              content={
                status === 2
                  ? "-"
                  : (data?.MaxWatt || 0) > 1
                  ? formatDuration(
                      data?.PriceType === 2
                        ? data?.Duration
                        : data?.ExpectedDuration
                    ) ?? "-"
                  : "Persiapan..."
              }
            />

            <InformationItem
              icon={IcFlash}
              label="Daya"
              content={
                status === 5
                  ? `${(data?.MaxWatt || 0) > 1 ? data?.MaxWatt : 0} Watt`
                  : "-"
              }
            />
          </div>

          {/* LOCATION */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-white rounded-full px-2.5 py-1.5">
              <IcMarkerSmall />

              <span className="font-medium text-xs">
                {data?.ChargingStation?.Name || "-"}
              </span>

              <Signal signalValue={data?.Device?.SignalValue} />
            </div>
          </div>

          {/* STATUS */}
          <StatusIndicator
            data={data}
            type={status || 2}
            duration={duration > 0 ? duration : 0}
            onFinish={getData}
            className="my-5"
          />

          <div className="flex justify-center mb-5 ">
            <div
              className={`rounded-full h-6 px-2.5 space-x-2 flex items-center shadow bg-white ${
                isCharging ? "border border-primary10" : ""
              }`}
            >
              {isCharging ? <IcBattery /> : <IcStandBy />}
              <span
                className={`text-xs font-medium ${
                  isCharging ? "text-primary100" : "text-[#E8A126]"
                }`}
              >
                {isCharging ? "Charging" : "Stand By"}
              </span>
            </div>
          </div>

          {(data?.MaxWatt || 0) > 1 &&
            dataVoucher?.Status === 2 &&
            dataVoucher?.VoucherDetails?.VoucherType === 2 && (
              <div className="bg-white shadow px-2.5 py-3 rounded-md mb-5 mx-4">
                <span className="font-medium text-xs">Klaim Voucher Kamu</span>

                <div
                  onClick={() =>
                    navigate(`/voucher/details/${dataVoucher?.ID}`)
                  }
                  className="between-x gap-2 py-3 px-4 bg-primary100 rounded-lg mt-2.5 cursor-pointer"
                >
                  <HiOutlineTicket size={20} className="text-white" />

                  <span className="flex-1 text-white font-medium">
                    Voucher {dataVoucher?.VoucherDetails?.Description}
                  </span>

                  <FaChevronRight size={16} className="text-white" />
                </div>
              </div>
            )}

          {/* DETAILS */}
          <div className="rounded-lg p-3 mb-4 bg-white drop-shadow">
            <div className="row gap-2 mb-3">
              <div className="w-[30px] h-[30px] center bg-primary10 rounded-full">
                <IcInfoCircleGreen />
              </div>

              <p>Rincian Informasi</p>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="Sesi ID"
              labelRight={`${id || "-"}, ${data?.Socket?.Port || "-"}`}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Alat"
              labelRight={data?.Device?.PileNumber || ""}
              className="bg-baseLightGray rounded-t p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(data?.Transaction?.NetCharge)}`}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Tarif Pengecasan"
              labelRight={`Rp${rupiah(data?.Transaction?.BaseFare)}/kWh`}
              className="bg-baseLightGray p-3"
            />

            {status === 6 && (
              <BetweenText
                type="medium-content"
                labelLeft="Daya Maksimum"
                labelRight={`${
                  (data?.MaxWatt || 0) > 1 ? data?.MaxWatt : 0
                }Watt`}
                className="bg-baseLightGray p-3"
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
          {status === 2 && data?.Device?.Protocol === -999 ? ( // hide
            <button
              type="button"
              className="h-[48px] w-full border rounded-full text-sm font-medium justify-center items-center flex drop-shadow btn-primary100 px-5"
              onClick={() => setOpenInstruction(true)}
            >
              <div className="row gap-2 flex-1">
                <FiInfo size={20} />
                <span className="text-white font-medium">Lihat Instruksi</span>
              </div>
              <FaAngleRight size={20} />
            </button>
          ) : (
            <Button
              type={status === 2 || status === 6 ? "primary" : "danger"}
              buttonType="lg"
              label={
                status === 2
                  ? "Mulai Pengisian"
                  : status === 6
                  ? "Kembali"
                  : "Selesaikan Pengisian"
              }
              loading={startSession?.loading || stopSession?.loading}
              onClick={onStartStop}
            />
          )}
        </div>
      </LoadingPage>

      {/* MODAL */}
      {visibleAlert && (
        <AlertModal
          visible={visibleAlert}
          image={ILCharging}
          title="Chargermu belum terdeteksi"
          description="Ups, chargermu belum terdeteksi nih. Coba ulangi lagi ya"
          onDismiss={() => setVisibleAlert(false)}
        />
      )}

      <AlertModal
        visible={openCancel}
        icon={IcInfoCircleRed}
        title="Apakah kamu ingin membatalkan sesi"
        description="Sesi Pengisian daya akan dibatalkan"
        onDismiss={() => setOpenCancel(false)}
        labelButtonLeft="Ya"
        labelButtonRight="Tidak"
        onClick={() => dispatch(fetchCancelSession(Number(id)))}
      />

      <AlertModal
        visible={openStop}
        icon={IcInfoCircleRed}
        title="Apakah kamu ingin menyelesaikan sesi"
        description="Sesi Pengisian daya akan dihentikan maksimal 1 menit dari sekarang"
        onDismiss={() => setOpenStop(false)}
        labelButtonLeft="Ya"
        labelButtonRight="Tidak"
        onClick={() => {
          setOpenStop(false);
          dispatch(fetchStopSession(data?.ID || 0));
        }}
      />

      <AlertModal
        visible={openFinished}
        icon={IcSuccessGreen}
        title="Sesi Selesai"
        description="Sesi Pengisian daya anda telah selesai berdasarkan durasi yang anda pesan"
        labelButtonLeft="Balik ke Beranda"
        labelButtonRight="Lihat detail sesi"
        onDismiss={onNext}
        onClick={() => navigate("/home", { replace: true })}
      />

      <DiagnosisModal
        isOpen={openDiagnosis}
        maxWatt={data?.Device?.MaxWatt || 0}
        onDismiss={() => setOpenDiagnosis(false)}
      />

      <AlertModal
        visible={openCantProcess}
        icon={IcInfoCircleRed}
        title="Permintaan Anda tidak dapat diproses"
        description="Silakan coba beberapa saat lagi"
        labelButtonRight="Tutup"
        typeButtonRight="primary"
        onDismiss={() => setOpenCantProcess(false)}
      />
      {openInstruction && (
        <ModalInstructions
          isOpen={openInstruction}
          onClose={() => setOpenInstruction(false)}
        />
      )}

      {/* END */}
    </div>
  );
};

interface InformationItemProps {
  icon: any;
  label: string;
  content: any;
}

const InformationItem: React.FC<InformationItemProps> = ({
  icon,
  label,
  content,
}) => {
  const Icon: any = icon;

  const isShowIcon: boolean = icon ? true : false;

  return (
    <div className="">
      <div className="row gap-0.5">
        {isShowIcon && <Icon className="text-primary100" />}
        <p className="text-xs text-black100/80">{label}</p>
      </div>

      <p className="text-blackBold text-center font-medium mt-1.5">{content}</p>
    </div>
  );
};

export default Charging;
