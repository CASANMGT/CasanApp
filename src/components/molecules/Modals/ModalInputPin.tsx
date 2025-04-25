import React, { useState } from "react";
import { IcClose, IcRadioActive, IcRadioInactive } from "../../../assets";
import { Button, InputCode, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";
import { openWhatsApp } from "../../../helpers";
import { CUSTOMER_SERVICES } from "../../../common";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}

const maxError: number = 3;

const ModalInputPin: React.FC<Props> = ({ isOpen, onDismiss, onConfirm }) => {
  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [countError, setCountError] = useState<number>(1);

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Masukkan PIN</label>

          <div onClick={onDismiss} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <div className="w-full mt-6 bg-white py-9 drop-shadow rounded-lg">
          <p className="text-center mb-4">Silahkan masukkan kode PIN anda</p>

          <InputCode
            type="password"
            values={codes}
            error={
              countError > 0
                ? `PIN salah. Coba lagi. (${countError}/${maxError})`
                : ""
            }
            onChange={(value: string[]) => setCodes(value)}
          />

          <p className="text-xs text-black70 mt-4 text-center">
            Butuh bantuan?{" "}
            <b
              onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
              className="text-xs text-primary100 cursor-pointer"
            >
              Hubungi Kami
            </b>
          </p>
        </div>


        <div className="py-6 px-4 border-t border-t-black10 mt-4 -mx-4">
          <Button label="Konfirmasi PIN" buttonType="lg" onClick={onConfirm} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalInputPin;

interface SelectBankCardProps {
  isActive: boolean;
  onSelect: () => void;
}

export const SelectBankCard: React.FC<SelectBankCardProps> = ({
  isActive,
  onSelect,
}) => {
  return (
    <div onClick={onSelect} className="cursor-pointer">
      <div className="between-x py-4">
        <div className="flex-col flex">
          <span className="text-blackBold text-xs font-medium">
            Bank Mandiri - 1440024861665
          </span>
          <span className="text-xs mt-1">TEDY IMAN PRIYO TANTO</span>
        </div>

        {isActive ? <IcRadioActive /> : <IcRadioInactive />}
      </div>

      <Separator />
    </div>
  );
};
