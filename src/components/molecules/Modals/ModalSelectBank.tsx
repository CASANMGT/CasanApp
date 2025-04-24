import React from "react";
import {
    IcClose,
    IcPlus,
    IcRadioActive,
    IcRadioInactive,
} from "../../../assets";
import { Button, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  onAddBank: () => void;
  onDismiss: () => void;
  onSelect: () => void;
}

const ModalSelectBank: React.FC<Props> = ({
  isOpen,
  onAddBank,
  onDismiss,
  onSelect,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Pilih Rekening Bank</label>

          <div onClick={onDismiss} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <span className="text-black90">Daftar Rekening Bank</span>

        {dataDummy.map((item, index) => (
          <SelectBankCard key={index} isActive={false} onSelect={() => {}} />
        ))}

        <div onClick={onAddBank} className="row cursor-pointer py-4">
          <IcPlus />

          <span className="ml-1 text-primary100 text-xs font-medium">
            Tambah Akun Bank
          </span>
        </div>

        <Separator className="mb-1" />

        <Button label="Pilih" onClick={onSelect} />
      </div>
    </ModalContainer>
  );
};

export default ModalSelectBank;

const dataDummy = [1, 2, 3];

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
