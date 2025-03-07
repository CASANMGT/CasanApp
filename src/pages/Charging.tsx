import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  IcClockGreen,
  IcFlashGreen,
  IcInfoCircleGreen,
  ILCharging,
} from "../assets";
import {
  chargingStartBodyProps,
  chargingStopBodyProps,
  portReportBodyProps,
} from "../common";
import {
  AlertModal,
  BetweenText,
  Button,
  Header,
  LoadingPage,
  Signal,
  StatusIndicator,
  Timer,
} from "../components";
import { hideLoading, showLoading } from "../features/globalSlice";
import { rupiah } from "../helpers";
import {
  fetchChargingStart,
  fetchChargingStop,
  fetchPortReport,
} from "../services/request";
import { AppDispatch, RootState } from "../store";

const Charging = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { formData } = useSelector((state: RootState) => state.formCharging);
  const detailSession = useSelector((state: RootState) => state.detailSession);

  const { loading, data } = useSelector(
    (state: RootState) => state.chargingStart
  );
  const sessionSetting = useSelector(
    (state: RootState) => state.sessionSetting
  );

  const [visibleAlert, setVisibleAlert] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("stand-by");
  const [power, setPower] = useState<number>(0);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (data) {
      setStatus("charging");
    }
  }, [data, loading]);

  useEffect(() => {
    if (status === "charging") {
      const body: portReportBodyProps = {
        deviceID: formData?.deviceId || "",
        port: formData?.port || 0,
      };

      dispatch(fetchPortReport(body)).then((res: any) => {
        setPower(res?.payload || 0);
      });

      setTimeout(() => {
        dispatch(fetchPortReport(body)).then((res: any) => {
          setPower(res?.payload || 0);
        });
      }, 10000);
    }
  }, [status]);

  const getData = () => {
    // dispatch(fetchDetailSession(Number(id)));
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = () => {
    // setVisibleAlert(true);

    if (status === "stand-by") onStart();
    else onStop();
  };

  const onStart = () => {
    const body: chargingStartBodyProps = {
      deviceID: formData?.deviceId || "",
      value: formData?.price || 0,
      port: formData?.port || 0,
      orderNumber: "00123451",
    };

    dispatch(fetchChargingStart(body));
  };

  const onStop = () => {
    const body: chargingStopBodyProps = {
      deviceID: formData?.deviceId || "",
      port: formData?.port || 0,
      orderNumber: "00123451",
    };

    dispatch(fetchChargingStop(body)).then((res) => {
      if (res?.payload) {
        setStatus("stand-by");
        navigate("/session-details", {
          replace: true,
        });
      }
    });
  };

  return (
    <div className="background-1 pt-3 overflow-hidden flex flex-col justify-between">
      <Header
        type="secondary"
        title="Halaman Pengisian"
        onDismiss={onDismiss}
        className="mx-4 mb-4"
        onPress={()=> alert('coming soon')}
      />

      <LoadingPage loading={detailSession?.loading} color="primary100">
        <div className="flex-1 overflow-auto scrollbar-none">
          {/* INFORMATION */}
          {status === "charging" && (
            <div className="mx-4 bg-baseLightGray/60 rounded-lg flex justify-around py-3 px-8">
              <InformationItem
                icon={IcClockGreen}
                label="Durasi"
                content={<Timer />}
              />
              <InformationItem
                icon={IcFlashGreen}
                label="Daya"
                content={`${power} Watt`}
              />
            </div>
          )}

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
              labelRight={`Device A, Socket ${formData?.port || 0}`}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(formData?.price || 0)}`}
              className="bg-baseLightGray p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Sinyal"
              labelRight="Device A, Socket 5"
              content={
                <Signal signalValue={sessionSetting?.data?.signalValue} />
              }
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
