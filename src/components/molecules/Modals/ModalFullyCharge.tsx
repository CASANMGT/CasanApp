import React from "react";
import { IcClose } from "../../../assets";
import { rupiah } from "../../../helpers";
import { BetweenText, Button } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  power: number;
  onClose: () => void;
  onViewDetails: () => void;
  onClick: () => void;
}

const ModalFullyCharge: React.FC<Props> = ({
  isOpen,
  power,
  onClose,
  onClick,
  onViewDetails,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onClose}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* TITLE */}
          <div className="between-x mb-4">
            <label className="text-base font-semibold">Isi Penuh Daya</label>

            <div onClick={onClose} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="px-4 py-3 mb-2 rounded-md bg-[#D5F1EB]/40 border border-primary100/40">
            <p>
              Anda bisa isi{" "}
              <span className="text-primary100 font-medium">{power}kWh</span>{" "}
              dengan saldo{" "}
              <span className="text-primary100 font-medium">
                Rp{rupiah(0)}.
              </span>{" "}
              Sisa kWh akan dikembalikan ke saldo.
            </p>
          </div>

          {/* DETAIL */}
          <BetweenText
            labelLeft="Total Harga Energi Dasar"
            labelRight={`Rp${rupiah(0)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Lainnya"
            labelRight={`Rp${rupiah(0)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Total Pembayaran"
            labelRight={`Rp${rupiah(0)}`}
            className="border-y border-black100 py-2"
            classNameLabelLeft="text-blackBold"
            classNameLabelRight="text-blackBold font-medium"
          />

          <span
            onClick={onViewDetails}
            className="py-4 text-primary100 text-xs cursor-pointer"
          >
            {"Lihat Detail ->"}
          </span>

          <div className="shadow-lg">
            <Button buttonType="lg" label="Isi Penuh Daya" onClick={onClick} />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalFullyCharge;
