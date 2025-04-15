import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IcClockGreen,
  IcFlashGreen,
  IcInfoCircleGreen,
  IcInfoCircleRed,
  IcMarkerSmall,
  IcSuccessGreen,
  IcWalletGreen,
  ILCharging,
} from "../assets";
import { CalculateDurationBody, Session } from "../common";
import {
  AlertModal,
  BetweenText,
  Button,
  DiagnosisModal,
  Header,
  LoadingPage,
  Signal,
  StatusIndicator,
} from "../components";
import {
  fetchCalculateDuration,
  fetchCancelSession,
  fetchDetailSession,
  fetchStartSession,
  fetchStopSession,
  hideLoading,
  resetDataCancelSession,
  resetDataStartSession,
  resetDataStopSession,
  showLoading,
} from "../features";
import { formatDuration, moments, rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const Charging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);
  const startSession = useSelector((state: RootState) => state.startSession);
  const stopSession = useSelector((state: RootState) => state.stopSession);
  const cancelSession = useSelector((state: RootState) => state.cancelSession);

  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);
  const [openDiagnosis, setOpenDiagnosis] = useState<boolean>(false);
  const [openDiagnosisFailed, setOpenDiagnosisFailed] =
    useState<boolean>(false);
  const [openFinished, setOpenFinished] = useState<boolean>(false);
  const [openStop, setOpenStop] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (detailSession?.data?.Status === 5) timeoutProgress();
  }, [detailSession?.data]);

  useEffect(() => {
    if (startSession?.data) {
      if (detailSession?.data?.Status === 2) {
        setOpenDiagnosis(true);
      }
      dispatch(resetDataStartSession());
      getData();
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

  const getData = () => {
    dispatch(fetchDetailSession(Number(id))).then((res) => {
      const resSession: Session = res?.payload as Session;
      const currentStatus = resSession?.Status;

      if (currentStatus === 6) {
        setOpenFinished(true);
      } else if (
        currentStatus === 1 ||
        currentStatus === 7 ||
        currentStatus === 8
      ) {
        navigate(`/transaction-history-details/${detailSession?.data?.ID}`, {
          replace: true,
          state: { isGoOrder: true },
        });
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

        dispatch(fetchCalculateDuration(body));
      }
    });
  };

  // over loop if status is charging
  const timeoutProgress = () => {
    const timer = setTimeout(() => {
      getData();
    }, 15000); // 2 second

    return () => clearTimeout(timer);
  };

  const onDismiss = () => {
    if (location?.state?.isGoOrder) navigate("/home/order");
    else navigate(-1);
  };

  const onStartStop = () => {
    if (status === 6) navigate("/home", { replace: true });
    else if (dataSession?.ID) {
      if (status === 5) {
        dispatch(fetchStopSession(dataSession?.ID || 0));
      } else dispatch(fetchStartSession(dataSession?.ID));
    }
  };

  const onNext = () => {
    navigate(`/session-details/${id}`, {
      replace: true,
      state: { isGoHome: true },
    });
  };

  const dataSession: Session | null = detailSession?.data;
  const status: number | undefined = dataSession?.Status;
  const duration: number = moments(dataSession?.StartChargingTime)
    .add(dataSession?.ExpectedDuration || 0, "seconds")
    .diff(moments(), "seconds");

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type="secondary"
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
        onPress={
          detailSession?.data?.Status !== 5
            ? () => setOpenCancel(true)
            : undefined
        }
      />

      <LoadingPage
        loading={!detailSession?.data && detailSession?.loading}
        color="primary100"
      >
        <div className="flex-1 overflow-auto scrollbar-none">
          {/* INFORMATION */}
          <div className="mx-4 bg-baseLightGray/60 rounded-lg flex justify-around py-3 px-8">
            <InformationItem
              icon={IcWalletGreen}
              label="Terpakai"
              content={`Rp${rupiah(dataSession?.UsedAmount)}`}
            />

            <InformationItem
              icon={IcClockGreen}
              label="Durasi Pemesanan"
              content={
                dataSession?.ExpectedDuration
                  ? formatDuration(dataSession?.ExpectedDuration)
                  : "-"
              }
            />

            <InformationItem
              icon={IcFlashGreen}
              label="Daya"
              content={status === 5 ? `${dataSession?.MaxWatt} Watt` : "-"}
            />
          </div>

          {/* STATUS */}
          <StatusIndicator
            type={status || 2}
            duration={duration > 0 ? duration : 0}
            onFinish={getData}
            className="mt-8 mb-7"
          />

          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 bg-white rounded-full px-2.5 py-1.5">
              <IcMarkerSmall />

              <span className="font-medium text-xs">
                {dataSession?.ChargingStation?.Name || "-"}
              </span>

              <Signal signalValue={dataSession?.Device?.SignalValue} />
            </div>
          </div>

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
              labelLeft="Alat"
              labelRight={`${dataSession?.Device?.PileNumber}, Socket ${dataSession?.Socket?.Port}`}
              className="bg-baseLightGray rounded-t p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(dataSession?.Transaction?.Amount)}`}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Tarif Pengecasan"
              labelRight={dataSession?.ChargingFee || "-"}
              className="bg-baseLightGray p-3"
            />

            {status === 6 && (
              <BetweenText
                type="medium-content"
                labelLeft="Daya Maksimum"
                labelRight={`${dataSession?.MaxWatt}Watt`}
                className="bg-baseLightGray p-3"
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
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
        description="Sesi Pengisian daya akan dihentikan"
        onDismiss={() => setOpenStop(false)}
        labelButtonLeft="Ya"
        labelButtonRight="Tidak"
        onClick={() => {
          setOpenStop(false);
          dispatch(fetchStopSession(dataSession?.ID || 0));
        }}
      />

      <AlertModal
        visible={openDiagnosisFailed}
        image={ILCharging}
        title="Diagnosis Gagal"
        description="Ups, coba cek lagi chargermu ya"
        labelButtonLeft="Coba Lagi"
        labelButtonRight="Tutup"
        onDismiss={() => setOpenDiagnosisFailed(false)}
        onClick={() => dispatch(fetchStopSession(dataSession?.ID || 0))}
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
        onDismiss={() => setOpenDiagnosis(false)}
        onClick={() => dispatch(fetchCancelSession(Number(id)))}
      />
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
        {isShowIcon && <Icon />}
        <p className="text-xs text-black100/80">{label}</p>
      </div>

      <p className="text-blackBold text-center font-medium mt-1.5">{content}</p>
    </div>
  );
};

export default Charging;
