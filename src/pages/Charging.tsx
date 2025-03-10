import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  IcClockGreen,
  IcFlashGreen,
  IcInfoCircleGreen,
  IcInfoCircleRed,
  IcMarkerSmall,
  IcWalletGreen,
  ILCharging,
} from "../assets";
import { Session } from "../common";
import {
  AlertModal,
  BetweenText,
  Button,
  Header,
  LoadingPage,
  Signal,
  StatusIndicator,
} from "../components";
import { fetchDetailSession } from "../features";
import { formatDuration, formatTime, rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const Charging = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);

  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [openCancel, setOpenCancel] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    dispatch(fetchDetailSession(Number(id)));
  };

  const getTotalCharging = useCallback(() => {
    let value: number = 0;

    if (detailSession?.data?.Transaction?.Amount && status === 6)
      value =
        ((detailSession?.data?.Transaction?.Amount -
          detailSession?.data?.RefundAmount) /
          detailSession?.data?.Transaction?.Amount) *
        100;

    return value;
  }, [detailSession?.data?.Transaction]);

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = () => {
    // setVisibleAlert(true);
    alert("coming soon");
  };

  const dataSession: Session | null = detailSession?.data;
  const status: number | undefined = 2; //dataSession?.Status;
  const totalCharging: number = getTotalCharging();

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type="secondary"
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
        onPress={() => setOpenCancel(true)}
      />

      <LoadingPage loading={detailSession?.loading} color="primary100">
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
              label="Durasi"
              content={formatTime(dataSession?.ExpectedDuration)}
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
            duration={dataSession?.ExpectedDuration || 0}
            className="mt-8 mb-7"
          />

          <div className="flex justify-center mb-5">
            <div className="flex items-center gap-2 bg-white rounded-full px-2.5 py-1.5">
              <IcMarkerSmall />

              <span className="font-medium text-xs">
                {detailSession?.data?.ChargingStation?.Location?.Mark ||
                  detailSession?.data?.ChargingStation?.Location?.Name ||
                  "-"}
              </span>

              <Signal signalValue={detailSession?.data?.Device?.SignalValue} />
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
              labelRight={`${dataSession?.ChargingStation?.Name}, Socket ${dataSession?.Socket?.Port}`}
              className="bg-baseLightGray rounded-t p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Durasi pemesanan"
              labelRight={
                dataSession?.Duration
                  ? formatDuration(dataSession?.Duration)
                  : "-"
              }
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(dataSession?.Transaction?.Amount)}`}
              className="bg-baseLightGray p-3"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
          <Button
            type={status === 2 ? "primary" : "danger"}
            buttonType="lg"
            label={status === 2 ? "Mulai Pengisian" : "Selesaikan Pengisian"}
            onClick={onNext}
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
        onClick={() => dispatch(fetchDetailSession(dataSession?.ID || 0))}
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
