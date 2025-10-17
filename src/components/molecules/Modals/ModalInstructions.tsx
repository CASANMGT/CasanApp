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
import { Button, SubTitle } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalInstructions: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalContainer isOpen={isOpen} scrollable onDismiss={onClose}>
      <div className="space-y-4 ">
        <SubTitle icon={IcInfoCircleGreen} label="Instruksi" className="mb-3" />

        <div>
          <p className="mb-1">1. Setelah alat nyala, klik Start Charging</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={ILInstruction1} alt="Photo" className="h-[110px]" />
          </div>
        </div>

        <div>
          <p className="mb-1">2. Tap kartu ke alat</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={ILInstruction2} alt="Photo" className="h-16" />
          </div>
        </div>

        <div>
          <p className="mb-1">
            3. Masukkan kode <span className="font-semibold">123456</span>
          </p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={ILInstruction3} alt="Photo" className="h-[108px]" />
          </div>
        </div>

        <div>
          <p className="mb-1">4. Klik tombol Query untuk mulai pengecasan</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={ILInstruction4} alt="Photo" className="h-[94px]" />
          </div>
        </div>

        <Button type="secondary" label="Saya Mengerti" onClick={onClose} />
      </div>
    </ModalContainer>
  );
};

export default ModalInstructions;
