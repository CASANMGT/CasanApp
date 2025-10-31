import React from "react";
import { IcClose } from "../../../assets";
import {  Voucher } from "../../../common";
import { formatDuration, getCurrentSlot, rupiah } from "../../../helpers";
import { BetweenText } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  dataPriceSetting: PriceSetting | undefined;
  dataDevice: Device | undefined | null;
  dataUser: UserProps | undefined | null;
  dataVoucher: Voucher | undefined | null;
  power: number | string;
  price: number | string;
  duration: number;
  onClose: () => void;
}

const ModalPriceDetails: React.FC<Props> = ({
  isOpen,
  duration,
  power,
  price,
  dataPriceSetting,
  dataDevice,
  dataUser,
  dataVoucher,
  onClose,
}) => {
  const selectedBaseRule: PriceBaseRule | null =
    dataPriceSetting?.PriceBaseRules.find(
      (item) => Number(power) >= item.From && Number(power) <= item.To
    ) ?? null;
  const selectedPriceTimeRule: PriceBaseTime | undefined =
    getCurrentSlot(selectedBaseRule);
  const dataOtherFee: OtherFeesProps[] | undefined =
    dataPriceSetting?.OtherFees;
  const baseFare: number =
    (dataDevice?.VehicleType === 1
      ? dataPriceSetting?.BikeBaseFare
      : dataPriceSetting?.CarBaseFare) ?? 0;
  const formattedDuration = formatDuration(duration || 0);
  const priceType: number = dataPriceSetting?.BikePriceType || 0;
  const totalBasicEnergyPrice: number = Number(price || 0);
  const timeSlotFee: number = selectedPriceTimeRule?.Value || 0;
  const totalFee: number = dataOtherFee?.length
    ? dataOtherFee.reduce(
        (sum, item) =>
          sum +
          (item?.Type === 1
            ? item.Value
            : (item.Value * totalBasicEnergyPrice) / 100),
        0
      )
    : 0;
  const milestone: number =
    ((totalBasicEnergyPrice + timeSlotFee + totalFee) *
      (dataUser?.Milestone?.DiscountPercent || 0)) /
    100;
  const voucher: number =
    dataVoucher?.VoucherType === 1 || dataVoucher?.VoucherType === 3
      ? dataVoucher?.DiscountType === 1
        ? dataVoucher?.DiscountValue
        : ((totalBasicEnergyPrice + timeSlotFee + totalFee) *
            dataVoucher?.DiscountValue) /
          100
      : 0;
  const pju: number = Number(
    ((totalBasicEnergyPrice * (dataPriceSetting?.PJU || 0)) / 100).toFixed(0)
  );
  const subTotal: number = Number(
    (
      totalBasicEnergyPrice +
      timeSlotFee +
      totalFee -
      milestone -
      voucher +
      pju
    ).toFixed(0)
  );
  const ppn: number = Number(
    ((subTotal * (dataPriceSetting?.PPN || 0)) / 100).toFixed(0)
  );
  const total: number = subTotal + ppn;

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
            labelRight={`Rp${rupiah(baseFare)}/kWh`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Pesanan Energi"
            labelRight={priceType === 2 ? `${power}kWh` : formattedDuration}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black100"
          />

          <BetweenText
            labelLeft="Total Harga Energi Dasar"
            labelRight={`Rp${rupiah(totalBasicEnergyPrice)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Biaya Slot Waktu"
            labelRight={`Rp${rupiah(timeSlotFee)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          />

          {dataOtherFee &&
            dataOtherFee.map((item, index) => (
              <BetweenText
                key={index}
                labelLeft={`Biaya ${item?.Name}`}
                labelRight={`Rp${rupiah(
                  item?.Type === 2
                    ? (item?.Value * totalBasicEnergyPrice) / 100
                    : item?.Value
                )}`}
                classNameLabelRight="font-medium text-black100"
                className="py-2 border-b border-b-black10"
              />
            ))}

          <BetweenText
            labelLeft="Diskon Milestone"
            labelRight={`-Rp${rupiah(milestone)}`}
            classNameLabelRight="font-medium text-primary100"
            className="py-2 border-b border-b-black10"
          />

          <BetweenText
            labelLeft="Diskon Voucher"
            labelRight={`-Rp${rupiah(voucher)}`}
            classNameLabelRight="font-medium text-primary100"
            className="py-2 border-b border-b-black10"
          />
          {/* 
          <BetweenText
            labelLeft={`PJU (${dataPriceSetting?.PJU}%)`}
            labelRight={`Rp${rupiah(pju)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black100"
          /> */}

          {/* <BetweenText
            labelLeft="Subtotal"
            labelRight={`Rp${rupiah(subTotal)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          /> */}

          {/* <BetweenText
            labelLeft={`PPN (${dataPriceSetting?.PPN}%)`}
            labelRight={`Rp${rupiah(ppn)}`}
            classNameLabelRight="font-medium text-black100"
            className="py-2 border-b border-b-black10"
          /> */}

          <BetweenText
            labelLeft="Total Pembayaran"
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
