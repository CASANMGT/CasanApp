import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcInfoCircleGreen, IcSuccessGreen } from "../assets";
import { portReportBodyProps } from "../common";
import { BetweenText, Button, Header, LoadingPage } from "../components";
import { moments, setDiff } from "../helpers";
import { fetchChargingSession } from "../services/request";
import { AppDispatch, RootState } from "../store";

const SessionDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { formData } = useSelector((state: RootState) => state.formCharging);

  const { loading, data } = useSelector(
    (state: RootState) => state.chargingSession
  );

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleBack = () => {
      onDismiss();
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  const getData = () => {
    if (!formData?.deviceId || !formData?.port || !formData?.price) {
      alert("perangkat tidak ditemukan");
      navigate("/home", { replace: true });
    } else {
      const body: portReportBodyProps = {
        deviceID: formData?.deviceId,
        port: formData?.port,
      };

      dispatch(fetchChargingSession(body));
    }
  };

  const onDismiss = () => {
    navigate("/home", { replace: true });
  };

  const onNext = () => {
    alert("coming soon");
  };

  const onShare = () => {
    alert("coming soon");
  };

  const onSave = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header type="secondary" title="Detail Sesi" onDismiss={onDismiss} />

      <LoadingPage loading={loading}>
        <div className="flex-1 overflow-auto scrollbar-none px-4 pb-7">
          {/* ICON */}
          <div className="center flex-col gap-2 my-[28px]">
            <IcSuccessGreen />
            <span className="text-blackBold font-medium">Sesi Selesai</span>
          </div>

          {/* TOOL INFORMATION */}
          <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
            <div className="row gap-3 mb-3">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <span className="text-blackBold font-medium">Informasi Alat</span>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="Lokasi"
              labelRight="Pasar Modern BSD City"
              className="bg-baseLightGray p-3 rounded-t"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Nomor Alat"
              labelRight={data?.DeviceID || "-"}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Socket"
              labelRight={`Socket ${data?.Port || "-"}`}
              className="bg-baseLightGray p-3 rounded-b"
            />
          </div>

          {/* SESSION INFORMATION */}
          <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
            <div className="row gap-3 mb-3">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <span className="text-blackBold font-medium">Informasi Sesi</span>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="ID Sesi"
              labelRight="112113"
              className="bg-baseLightGray p-3 rounded-t"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Waktu Mulai"
              labelRight={moments(data?.StartTime).format("DD MMM YYYY")}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Waktu Selesai"
              labelRight={moments(data?.StopTime).format("DD MMM YYYY")}
              className="bg-baseLightGray p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Durasi"
              labelRight={
                data?.StartTime && data?.StopTime
                  ? setDiff(data?.StartTime, data?.StopTime)
                  : "-"
              }
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Maksimum Watt"
              labelRight={`${data?.MaxWatt}W`}
              className="bg-baseLightGray p-3"
            />
          </div>

          {/* PAYMENT INFORMATION */}
          {/* <div className="p-3 pb-6 bg-white rounded-lg drop-shadow">
          <p className="font-medium mb-2">Informasi Transaksi</p>

          <div className="text-black100/70 row gap-2">
            <p className="text-xs">{moments().format("DD MMMM YYYY")}</p>
            <p className="text-xs">{moments().format("HH:mm WIB")}</p>
            <p className="text-xs">ID1876546</p>
          </div>

          <Separator className="my-4 bg-black10" />

          <p className="text-xs text-black100/70 mb-2">Detail Transaksi</p>

          <BetweenText labelLeft="Metode Pembayaran" labelRight="Dana" />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Nominal Pengisian"
            labelRight={`Rp${rupiah(10000)}`}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Biaya Transaksi"
            labelRight={`Rp${rupiah(1000)}`}
          />

          <Separator className="my-1.5 bg-black100" />
          <BetweenText
            labelLeft="Total Transaksi"
            labelRight={`Rp${rupiah(11000)}`}
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100"
          />
          <Separator className="mt-1.5 bg-black100" />

          <Separator className="my-6 bg-black10" />

          <div className="between gap-4">
            <Button
              type="secondary"
              label="Bagikan Resi"
              iconRight={IcShareGreen2}
              onClick={onShare}
            />
            <Button
              type="secondary"
              label="Simpan Resi"
              iconRight={IcSaveGreen}
              onClick={onSave}
            />
          </div>
        </div> */}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-white drop-shadow">
          <Button
            buttonType="lg"
            label="Pergi ke Riwayat"
            onClick={onDismiss}
          />
        </div>
      </LoadingPage>
    </div>
  );
};

export default SessionDetails;
