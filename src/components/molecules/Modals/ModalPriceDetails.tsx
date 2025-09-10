import React from "react";
import { IcClose } from "../../../assets";
import { formatDuration, rupiah } from "../../../helpers";
import { BetweenText } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  dataStation: ChargingStation;
  dataDevice: Device;
  total: number;
  watt: number;
  power: number | string;
  duration: number;
  onClose: () => void;
}

const ModalPriceDetails: React.FC<Props> = ({
  isOpen,
  watt,
  duration,
  power,
  total,
  dataStation,
  dataDevice,
  onClose,
}) => {
  const selectedBaseRule: PriceBaseRule | null =
    dataStation?.PriceSetting?.PriceBaseRules.find(
      (item) => watt >= item.From && watt <= item.To
    ) ?? null;
  const selectedPriceTimeRule: PriceBaseTime | undefined =
    getCurrentSlot(selectedBaseRule);
  const dataOtherFee: OtherFeesProps[] = dataStation?.PriceSetting?.OtherFees;

  const baseFare: number =
    dataDevice?.VehicleType === 1
      ? dataStation?.PriceSetting?.BikeBaseFare
      : dataStation?.PriceSetting?.CarBaseFare;
  const priceWatt: number = selectedPriceTimeRule?.Value || 0;
  const totalFee: number = dataOtherFee.reduce(
    (sum, item) => sum + item.Value,
    0
  );
  const pju: number = Number(
    ((baseFare * dataStation?.PriceSetting?.PJU) / 100).toFixed(0)
  );
  const ppn: number = Number(
    ((baseFare + priceWatt + pju + totalFee) / 100).toFixed(0)
  );
  const formattedDuration = formatDuration(duration || 0);
  const priceType: number = dataStation?.PriceSetting?.BikePriceType;
  const labelPrice =
    priceType === 1
      ? `${selectedBaseRule?.From || 0}-${selectedBaseRule?.To || 0}W`
      : "Tambahan";

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
            labelLeft={`Harga ${labelPrice}`}
            labelRight={`Rp${rupiah(selectedPriceTimeRule?.Value || 0)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          {dataOtherFee.map((item, index) => (
            <BetweenText
              key={index}
              labelLeft={`Biaya ${item?.Name}`}
              labelRight={`Rp${rupiah(item?.Value)}`}
              classNameLabelRight="font-medium text-black100"
              className="py-2 border-b border-b-black10"
            />
          ))}

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

          {priceType === 1 && (
            <>
              <BetweenText
                labelLeft="Energi Digunakan"
                labelRight={`${watt}W`}
                classNameLabelRight="font-medium text-black100"
                className="py-2 border-b border-b-black10"
              />
              <BetweenText
                labelLeft="Waktu Pengisian"
                labelRight={formattedDuration || "0"}
                classNameLabelRight="font-medium text-black100"
                className="py-2"
              />
            </>
          )}

          {priceType === 2 && (
            <BetweenText
              labelLeft="Energi Terisi"
              labelRight={`${power} kWh`}
              classNameLabelRight="font-medium text-black100"
              className="py-2"
            />
          )}

          <BetweenText
            labelLeft="Total"
            labelRight={`Rp${rupiah(total)}`}
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
