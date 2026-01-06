import React from "react";
import {
  IcChargeUnited,
  IcInfoCircleGreen,
  IcTablet,
  IcTap,
  ILInstruction1,
  ILInstruction2,
  ILInstruction3,
  ILInstruction4,
} from "../../../assets";
import { Button, Separator, SubTitle } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalInstructions: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalContainer isOpen={isOpen} scrollable onDismiss={onClose}>
      <div className="space-y-4 max-w-[400px]">
        <SubTitle icon={IcInfoCircleGreen} label="Instruksi" className="mb-3" />

        <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
          <img src={ILInstruction1} alt="Photo" className="h-[110px]" />
        </div>

        <p className="text-xs font-medium ">
          Setelah alat nyala, klik{" "}
          <span className="text-blackBold font-Bold">Start Charging</span> untuk
          memulai pengecasan. Pastikan charger telah terhubung ke kendaraan
        </p>

        <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
          <img src={ILInstruction2} alt="Photo" className="h-[110px]" />
        </div>

        <Separator/>

        <Button type="secondary" label="Saya Mengerti" onClick={onClose} />
      </div>
    </ModalContainer>
  );
};

export default ModalInstructions;
