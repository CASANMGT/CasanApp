import React from "react";
import {
  IcChargeUnited,
  IcInfoCircleGreen,
  IcTablet,
  IcTap,
} from "../../../assets";
import { Button, SubTitle } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalInstructions: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalContainer isOpen={isOpen} onDismiss={onClose}>
      <div className="space-y-4">
        <SubTitle icon={IcInfoCircleGreen} label="Instruksi" className="mb-3" />

        <div>
          <p className="mb-1">1. Setelah alat nyala, klik Start Charging</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB]"></div>
        </div>

        <div>
          <p className="mb-1">2. Tap kartu ke alat</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={IcTap} alt="Photo" className="w-16" />
          </div>
        </div>

        <div>
          <p className="mb-1">
            3. Masukkan kode <span className="font-semibold">123456</span>
          </p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={IcTablet} alt="Photo" className="w-[146px]" />
          </div>
        </div>

        <div>
          <p className="mb-1">4. Klik tombol Query untuk mulai pengecasan</p>

          <div className="w-full h-[132px] rounded bg-[#EBEBEB] center">
            <img src={IcChargeUnited} alt="Photo" className="w-10" />
          </div>
        </div>

        <Button type="secondary" label="Saya Mengerti" onClick={onClose} />
      </div>
    </ModalContainer>
  );
};

export default ModalInstructions;
