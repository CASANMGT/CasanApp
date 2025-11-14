import React from "react";
import { IcClose, ILNoImage } from "../../../assets";
import { BankAccountList } from "../../../common";
import ModalContainer from "./ModalContainer";
import { BetweenText } from "../../atoms";

interface Props {
  isOpen: boolean;
  onAddBank: () => void;
  onDismiss: () => void;
  onSelect: (data: BankAccountList | undefined) => void;
}

const ModalVehicleDetails: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onClose}
      classNameBottom="!h-auto !max-h-3/4"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Detail Kendaraan</label>

          <div onClick={onClose} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <div className="w-full bg-black10 rounded-lg aspect-video flex items-center justify-center overflow-hidden mt-6 mb-4">
          <img
            src={ILNoImage}
            alt="photo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="mb-4 row gap-1.5">
          <span className="text-blackBold font-semibold">Uwinfly Seri C70</span>
          <span className="text-black70 font-semibold">(B1234B)</span>
        </div>

        <BetweenText
          labelLeft="Spesifikasi Baterai"
          labelRight={'1234567890'}
          classNameLabelRight="font-semibold"
          className="p-3 rounded-t bg-baseLightGray"
        />

         <BetweenText
          labelLeft="No Rangka"
          labelRight={'1234567890'}
          classNameLabelRight="font-semibold"
          className="p-3"
        />

         <BetweenText
          labelLeft="Warna"
          labelRight={'Putih'}
          classNameLabelRight="font-semibold"
          className="p-3 bg-baseLightGray"
        />

         <BetweenText
          labelLeft="No Baterai"
          labelRight={'1234567890'}
          classNameLabelRight="font-semibold"
          className="p-3"
        />

         <BetweenText
          labelLeft="No STNK"
          labelRight={'1234567890'}
          classNameLabelRight="font-semibold"
          className="p-3 rounded-b bg-baseLightGray"
        />
      </div>
    </ModalContainer>
  );
};

export default ModalVehicleDetails;
