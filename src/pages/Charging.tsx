import { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import {
  IcClockGreen,
  IcFlashGreen,
  IcInfoCircleGreen,
  ILCharging,
} from "../assets";
import {
  AlertModal,
  BetweenText,
  Button,
  CountdownTimer,
  Header,
  Signal,
  StatusIndicator,
} from "../components";
import { rupiah } from "../helpers";

const Charging = () => {
  const navigate = useNavigate();

  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("stand-by");

  const onDismiss = () => {
    navigate(-1);
  };

  const onStart = () => {
    // setVisibleAlert(true);

    if (status === "stand-by") setStatus("charging");
    else navigate("/session-details", { replace: true });
  };

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type="secondary"
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
      />

      <div className="flex-1 overflow-auto scrollbar-none">
        {/* INFORMATION */}
        <div className="mx-4 bg-baseLightGray/60 rounded-lg flex justify-around py-3 px-8">
          <InformationItem
            icon={IcClockGreen}
            label="Durasi"
            content={
              status === "stand-by" ? (
                "00:00:00"
              ) : (
                <CountdownTimer
                  targetDate={new Date().getTime() + 30 * 60 * 1000}
                />
              )
            }
          />
          <InformationItem
            icon={IcFlashGreen}
            label="Daya"
            content={`${status === "stand-by" ? "-" : 200} Watt`}
          />
        </div>

        {/* STATUS */}
        <StatusIndicator type={status} className="my-8" />

        {/* DETAILS */}
        <div className="rounded-lg p-3 mb-4 bg-white drop-shadow">
          <div className="row gap-2 mb-3">
            <div className="w-[30px] h-[30px] center bg-primary10 rounded-full">
              <IcInfoCircleGreen />
            </div>

            <p>Rincian Informasi</p>
          </div>

          <BetweenText
            labelLeft="Stasiun"
            labelRight="Pasar Modern BSD City"
            className="bg-baseLightGray rounded-t p-3"
            classNameLabelRight="text-blackBold font-bold"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Alat"
            labelRight="Device A, Socket 5"
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Total Transaksi"
            labelRight={`Rp${rupiah(5000)}`}
            className="bg-baseLightGray p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Sinyal"
            labelRight="Device A, Socket 5"
            content={<Signal type="full" />}
            className="p-3"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="container-button-footer">
        <Button
          type={status === "stand-by" ? "primary" : "danger"}
          buttonType="lg"
          label={
            status === "stand-by" ? "Mulai Pengisian" : "Selesaikan Pengisian"
          }
          onClick={onStart}
        />
      </div>

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
