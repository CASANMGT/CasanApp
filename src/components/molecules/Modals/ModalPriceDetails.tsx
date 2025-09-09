import React from "react";
import { IcClose } from "../../../assets";
import { ChargingStation } from "../../../common";
import { rupiah } from "../../../helpers";
import { BetweenText } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  dataStation: ChargingStation;
  total: number;
  onClose: () => void;
}

const ModalPriceDetails: React.FC<Props> = ({
  isOpen,
  total,
  dataStation,
  onClose,
}) => {
  const pju: number = (total * dataStation?.PriceSetting?.PJU) / 100;
  const ppn: number = (total * dataStation?.PriceSetting?.PPN) / 100;

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onClose}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="between-x mb-2.5">
            <label className="text-base font-semibold">Rincian harga</label>

            <div onClick={onClose} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <BetweenText
            labelLeft="Harga Energi Dasar"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Harga 0-200W"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Jasa"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Aplikasi"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Alat"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="PJU"
            labelRight={pju}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="PPN"
            labelRight={ppn}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Energi Digunakan"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Waktu Pengisian"
            labelRight={"-"}
            classNameLabelRight="font-medium text-black100"
            className="py-2"
          />

          <BetweenText
            labelLeft="Total"
            labelRight={`Rp${rupiah(0)}`}
            className="border-y border-black100 py-2"
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100 font-medium"
          />

          <div className="w-full border-t border-dashed border-black30 my-4"></div>

          <p className="text-xs text-black80 mb-10">
            *Harga sudah sesuai dengan{" "}
            <span className="text-xs text-black100 font-medium">
              Permen ESDM No. 11 Tahun 2023
            </span>{" "}
            terkait tarif pengisian kendaraan listrik.
          </p>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPriceDetails;
