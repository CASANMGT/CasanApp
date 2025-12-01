import React from "react";
import { IcClose } from "../../../assets";
import { rupiah } from "../../../helpers";
import { BetweenText, Button } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  loading: boolean;
  data: CalculateGrossProps | undefined;
  dataPriceSetting: PriceSetting;
  onClose: () => void;
  onClick: () => void;
}

const ModalFullyCharge: React.FC<Props> = ({
  isOpen,
  data,
  loading,
  dataPriceSetting,
  onClose,
  onClick,
}) => {
  const baseFare: number = dataPriceSetting?.BikeBaseFare;

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
              Perkiraan pengisian{" "}
              <span className="text-primary100 font-medium">
                {data?.KwhUsed}kWh
              </span>{" "}
              dengan saldo{" "}
              <span className="text-primary100 font-medium">
                Rp{rupiah(data?.Total)}.
              </span>{" "}
              Sisa kWh akan dikembalikan ke saldo.
            </p>

            <p className="text-black70 text-xs mt-4">
              *Berdasarkan tarif energi dasar Rp{rupiah(baseFare)}/kWh dan biaya
              lainnya. Detail dapat dilihat setelah pengisian.
            </p>
          </div>

          <div className="shadow-lg mt-4">
            <Button
              buttonType="lg"
              loading={loading}
              label="Isi Penuh Daya"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalFullyCharge;
