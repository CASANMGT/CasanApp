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
  onClick: () => void;
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  onDismiss,
  onClick,
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
      setSeconds(60);
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (seconds <= 0) {
  //     onDismiss();
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setSeconds((prev) => prev - 1);
  //   }, 1000); // Runs after 3 seconds

  //   return () => clearTimeout(timeout); // Cleanup
  // }, [seconds]);

  useEffect(() => {
    if (calculateDuration?.data && isOpen) {
      const value = formatDuration(calculateDuration?.data || 0);
      setDuration(value);
    }
  }, [calculateDuration?.data]);


  return (
    <ModalContainer isOpen={isOpen} onDismiss={() => {}}>
      <div className="center-y gap-2">
        <div className="w-[58px] h-[58px] border-[6px] border-primary50 border-solid border-t-primary100 rounded-full animate-spin mb-2 mt-4" />

        <h1 className="text-base font-semibold">Memulai Sesi</h1>

        <p className="text-center text-black70 mb-2">
          Sesi sedang disiapkan untuk pengecasan dalam 1 menit. Silakan tunggu
          ya!
        </p>
      </div>
    </ModalContainer>
  );
};

export default DiagnosisModal;
