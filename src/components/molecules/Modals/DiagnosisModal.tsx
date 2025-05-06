import React, { useEffect, useState } from "react";
import ModalContainer from "./ModalContainer";
import { BetweenText, Button, ProgressBar } from "../../atoms";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { CalculateDurationBody, Device } from "../../../common";
import { useDispatch } from "react-redux";
import { fetchCalculateDuration, fetchDetailSession } from "../../../features";
import { formatDuration, rupiah } from "../../../helpers";
import { IcSuccess, IcSuccessGreen } from "../../../assets";

interface DiagnosisModalProps {
  isOpen: boolean;
  data: Device | undefined;
  onDismiss: () => void;
  onClick: () => void;
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  data,
  onDismiss,
  onClick,
}) => {
  return (
    <ModalContainer isOpen={isOpen} onDismiss={() => {}}>
      <div className="center-y gap-2">
        <div className="w-[58px] h-[58px] border-[6px] border-primary50 border-solid border-t-primary100 rounded-full animate-spin mb-2 mt-4" />

        <h1 className="text-base font-semibold">Memulai Sesi</h1>

        <p className="text-center text-black70 mb-2">
          Memulai pengecasan. Jika melebihi batas{" "}
          <span>{data?.MaxWatt || 0}W</span>, sesi akan dihentikan dan
          pengembalian dana akan diproses
        </p>

        <Button type='secondary' label="Refresh Halaman" onClick={onClick}/>
      </div>
    </ModalContainer>
  );
};

export default DiagnosisModal;
