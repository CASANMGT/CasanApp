import React from "react";
import { ILNotFound } from "../../../assets";
import { Button, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalNotAvailable: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalContainer isOpen={isOpen} onDismiss={onClose}>
      <div className="center-y gap-3 mb-6">
        <div className="max-h-[130px]">
          <ILNotFound />
        </div>

        <Separator/>

        <span className="text-base font-semibold text-center">Alat Tidak Tersedia</span>
        <p className="text-center">
          Maaf, saat ini alat sedang tidak tersedia, Silahkan pakai alat lain
          yang tersedia, ya!
        </p>
      </div>

      <Button label="Tutup" onClick={onClose} />
    </ModalContainer>
  );
};

export default ModalNotAvailable;
