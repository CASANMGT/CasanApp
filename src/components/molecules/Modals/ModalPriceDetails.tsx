import React from "react";
import { IcClose } from "../../../assets";
import { rupiah } from "../../../helpers";
import { BetweenText } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  dataStation: ChargingStation;
  dataDevice: Device;
  total: number;
  watt: number;
  onClose: () => void;
}

const ModalPriceDetails: React.FC<Props> = ({
  isOpen,
  total,
  watt,
  dataStation,
  dataDevice,
  onClose,
}) => {
  const pju: number = (total * dataStation?.PriceSetting?.PJU) / 100;
  const ppn: number = (total * dataStation?.PriceSetting?.PPN) / 100;

  const baseFare: number =
    dataDevice?.VehicleType === 1
      ? dataStation?.PriceSetting?.BikeBaseFare
      : dataStation?.PriceSetting?.CarBaseFare;

  console.log("cek station", dataStation);
  // console.log("cek device", dataDevice);

  const selectedBaseRule: PriceBaseRule | null =
    dataStation?.PriceSetting?.PriceBaseRules.find(
      (item) => watt >= item.From && watt <= item.To
    ) ?? null;
  const selectedPriceTimeRule: PriceBaseTime | undefined =
    getCurrentSlot(selectedBaseRule);
  const dataOtherFee: OtherFeesProps[] | undefined =
    dataStation?.PriceSetting?.OtherFees;

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
            labelRight={`Rp${rupiah(baseFare)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft={`Harga ${selectedBaseRule?.From || 0}-${
              selectedBaseRule?.To || 0
            }W`}
            labelRight={`Rp${rupiah(selectedPriceTimeRule?.Value || 0)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Jasa"
            labelRight={`Rp${rupiah()}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Aplikasi"
            labelRight={`Rp${rupiah()}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Alat"
            labelRight={`Rp${rupiah()}`}
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
            labelRight={`Rp${rupiah()}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Waktu Pengisian"
            labelRight={`Rp${rupiah()}`}
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

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getCurrentSlot(
  priceBase: PriceBaseRule | null
): PriceBaseTime | undefined {
  if (!priceBase?.PriceBaseTime?.length) return undefined;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const matchedSlot = priceBase.PriceBaseTime.find((slot) => {
    const fromMinutes = timeToMinutes(slot?.PriceTimeRule?.From);
    const toMinutes = timeToMinutes(slot?.PriceTimeRule?.To);

    if (isNaN(fromMinutes) || isNaN(toMinutes)) return false;

    // Normal same-day range
    if (fromMinutes <= toMinutes) {
      return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
    }

    // Overnight range
    return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
  });

  return matchedSlot;
}
