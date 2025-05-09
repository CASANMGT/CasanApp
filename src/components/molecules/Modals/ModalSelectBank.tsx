import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  IcClose,
  IcPlus,
  IcRadioActive,
  IcRadioInactive,
} from "../../../assets";
import { BankAccountList } from "../../../common";
import { RootState } from "../../../store";
import { Button, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  onAddBank: () => void;
  onDismiss: () => void;
  onSelect: (data: BankAccountList | undefined) => void;
}

const ModalSelectBank: React.FC<Props> = ({
  isOpen,
  onAddBank,
  onDismiss,
  onSelect,
}) => {
  const bankAccountList = useSelector(
    (state: RootState) => state.bankAccountList
  );

  const [selectBank, setSelectBank] = useState<BankAccountList>();

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto !max-h-3/4"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Pilih Rekening Bank</label>

          <div onClick={onDismiss} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <span className="text-black90">Daftar Rekening Bank</span>

        {bankAccountList?.data?.length &&
          bankAccountList?.data.map((item, index) => (
            <SelectBankCard
              key={index}
              data={item}
              isActive={item?.ID === selectBank?.ID}
              onSelect={() => setSelectBank(item)}
            />
          ))}

        <div onClick={onAddBank} className="row cursor-pointer py-4">
          <IcPlus />

          <span className="ml-1 text-primary100 text-xs font-medium">
            Tambah Akun Bank
          </span>
        </div>

        <Separator className="mb-1" />

        <Button label="Pilih" onClick={() => onSelect(selectBank)} />
      </div>
    </ModalContainer>
  );
};

export default ModalSelectBank;

const dataDummy = [1, 2, 3];

interface SelectBankCardProps {
  isActive: boolean;
  data: BankAccountList;
  onSelect: () => void;
}

export const SelectBankCard: React.FC<SelectBankCardProps> = ({
  isActive,
  data,
  onSelect,
}) => {
  return (
    <div onClick={onSelect} className="cursor-pointer">
      <div className="between-x py-4">
        <div className="flex-col flex">
          <span className="text-blackBold text-xs font-medium">
            {data?.Code.replace("ID_", "")} - {data?.Number}
          </span>
          <span className="text-xs mt-1">{data?.Name}</span>
        </div>

        {isActive ? <IcRadioActive /> : <IcRadioInactive />}
      </div>

      <Separator />
    </div>
  );
};
