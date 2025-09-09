import React from "react";
import { Button } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface DiagnosisModalProps {
  isOpen: boolean;
  maxWatt: number;
  onDismiss: () => void;
}

const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  maxWatt,
  onDismiss
}) => {
  return (
    <ModalContainer isOpen={isOpen} onDismiss={onDismiss}>
      <div className="center-y gap-2">
        <div className="w-[58px] h-[58px] border-[6px] border-primary50 border-solid border-t-primary100 rounded-full animate-spin mb-2 mt-4" />

        <h1 className="text-base font-semibold">Memulai Sesi</h1>

        <p className="text-center text-black70 mb-2">
          Memulai pengecasan. Jika melebihi batas
          {maxWatt > 0 && (
            <span className="font-bold text-black100"> {maxWatt}W</span>
          )}
          , sesi akan dihentikan dan pengembalian dana akan diproses
        </p>

        <Button label="Tutup" onClick={onDismiss} />
      </div>
    </ModalContainer>
  );
};

export default DiagnosisModal;
