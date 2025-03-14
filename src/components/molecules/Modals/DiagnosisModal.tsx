import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { BetweenText, Button, ProgressBar } from "../../atoms";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { CalculateDurationBody } from "../../../common";
import { useDispatch } from "react-redux";
import { fetchCalculateDuration, fetchDetailSession } from "../../../features";
import { formatDuration, rupiah } from "../../../helpers";
import { IcSuccess, IcSuccessGreen } from "../../../assets";

interface DiagnosisModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onClick:()=> void
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  onDismiss,
  onClick
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);
  const calculateDuration = useSelector(
    (state: RootState) => state.calculateDuration
  );

  const [seconds, setSeconds] = useState(1);
  const [duration, setDuration] = useState<string>("-");
  const [isDiagnostic, setIsDiagnostic] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setSeconds(35);
      getData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (seconds <= 0) {
      setIsDiagnostic(false);
      return;
    }

    const timeout = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000); // Runs after 3 seconds

    return () => clearTimeout(timeout); // Cleanup
  }, [seconds]);

  useEffect(() => {
    if (calculateDuration?.data && isOpen) {
      const value = formatDuration(calculateDuration?.data || 0);
      setDuration(value);
    }
  }, [calculateDuration?.data]);

  const getData = () => {
    setIsDiagnostic(true);

    if (
      detailSession?.data?.ChargingStationID &&
      detailSession?.data?.MaxWatt
    ) {
      const body: CalculateDurationBody = {
        id: detailSession?.data?.ChargingStationID,
        total_charge: Number(detailSession?.data?.Transaction?.Amount),
        vehicle_type: 1,
        watt: Number(detailSession?.data?.MaxWatt),
      };

      dispatch(fetchCalculateDuration(body));
    }
  };

  return (
    <ModalContainer isOpen={isOpen} onDismiss={() => {}}>
      {isDiagnostic ? (
        <div className="center-y gap-2">
          <div className="w-[58px] h-[58px] border-[6px] border-primary50 border-solid border-t-primary100 rounded-full animate-spin mb-2 mt-4" />

          <h1 className="text-base font-semibold">Sedang Mendiagnosis Sesi</h1>

          <p className="text-center text-black80 mb-2">
            Tunggu dulu ya, dalam{" "}
            <span className="font-medium">{`${seconds} detik`}</span> kami
            diagnosis dulu agar sesi lebih akurat
          </p>

          <Button
            type="light-red"
            label="Hentikan Diagnosis"
            onClick={onClick}
            className="w-full flex justify-center"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <div className="row gap-1 mb-2">
                <h1 className="text-base font-semibold">Diagnosis Selesai</h1>
                <IcSuccessGreen  className="w-3"/>
              </div>

              <p className="text-xs font-medium mb-4">
                {false
                  ? "Terjadi penyesuaian durasi"
                  : "Tidak ada perbedaan nominal/waktu"}
              </p>
            </div>

            <BetweenText
              labelLeft="Nominal"
              labelRight={`Rp${rupiah(
                detailSession?.data?.Transaction?.Amount
              )}`}
              labelAdjustment={false ? `Rp${rupiah(5000)}` : undefined}
              classNameLabelRight="font-medium text-black100"
            />

            <BetweenText
              labelLeft="Daya Maksimum"
              labelRight={`${detailSession?.data?.MaxWatt}W`}
              labelAdjustment={
                false ? `${detailSession?.data?.MaxWatt}W` : undefined
              }
              classNameLabelRight="font-medium"
            />

            <BetweenText
              labelLeft="Durasi"
              labelRight={duration}
              labelAdjustment={false ? "1 Jam" : undefined}
              classNameLabelRight="font-medium"
              className="my-1"
            />

            <ProgressBar
              max={15}
              onFinish={() => {
                setTimeout(() => {
                  onDismiss();
                  if (detailSession?.data?.ID && isOpen)
                    dispatch(fetchDetailSession(detailSession?.data?.ID));
                }, 1500);
              }}
            />

            <Button
              type="light-red"
              label="Batalkan Sesi"
              onClick={onClick}
              className="w-full flex justify-center mt-2"
            />
          </div>
        </>
      )}
    </ModalContainer>
  );
};

export default DiagnosisModal;
