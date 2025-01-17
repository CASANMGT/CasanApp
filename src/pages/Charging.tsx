import { useNavigate } from "react-router-dom";
import {
  IcClockGreen,
  IcFlashGreen,
  IcInfoCircleGreen,
  IcWalletGreen,
  ILCharging,
} from "../assets";
import {
  AlertModal,
  BetweenText,
  Button,
  Header,
  StatusIndicator,
} from "../components";
import { rupiah } from "../helpers";
import { useState } from "react";

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
    else navigate("/session-details");
  };

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type="secondary"
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
      />

      <div className="flex-1 overflow-auto">
        {/* INFORMATION */}
        <div className="mx-4 bg-baseLightGray/60 rounded-lg flex justify-around py-3">
          <InformationItem
            icon={IcWalletGreen}
            label="Terpakai"
            content={`Rp${rupiah(0)}`}
          />
          <InformationItem
            icon={IcClockGreen}
            label="Durasi"
            content={"00:00:00"}
          />
          <InformationItem
            icon={IcFlashGreen}
            label="Kecepatan"
            content={"- Watt"}
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
            classNameLabelRight="text-blackBold text-base font-bold"
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
            labelLeft="Voltase Maksimum"
            labelRight="-"
            className="p-3"
          />

          <BetweenText
            type="medium-content"
            labelLeft="Arus"
            labelRight="-"
            className="bg-baseLightGray rounded-b p-3"
          />
        </div>
      </div>

      <div className="p-4 bg-white drop-shadow">
        <Button
          type={status === "stand-by" ? "primary" : "danger"}
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
  content: string;
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
