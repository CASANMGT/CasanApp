import React from "react";
import { IcClose, ILNoImage } from "../../../assets";
import { BetweenText } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalVehicleDetails: React.FC<ModalProps> = ({
  isOpen,
  data,
  onClose,
}) => {
  const dataVehicle: VehicleProps | undefined = data;
  const color: ColorVehicleModelProps | null = dataVehicle?.Colors?.[0] ?? null;

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
            src={color?.ImageURL || ILNoImage}
            alt="photo"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="mb-4 row gap-1.5">
          <span className="text-blackBold font-semibold">
            {dataVehicle?.VehicleModel?.ModelName}
          </span>
          <span className="text-black70 font-semibold">
            ({data?.LicensePlate || "-"})
          </span>
        </div>

        <BetweenText
          labelLeft="Spesifikasi Baterai"
          labelRight={"-"}
          classNameLabelRight="font-semibold"
          className="p-3 rounded-t bg-baseLightGray"
        />

        <BetweenText
          labelLeft="No Rangka"
          labelRight={data?.FrameNumber || "-"}
          classNameLabelRight="font-semibold"
          className="p-3"
        />

        <BetweenText
          labelLeft="Warna"
          labelRight={color?.ColorName || "-"}
          classNameLabelRight="font-semibold"
          className="p-3 bg-baseLightGray"
        />

        <BetweenText
          labelLeft="No Baterai"
          labelRight={dataVehicle?.BatteryNumber || "-"}
          classNameLabelRight="font-semibold"
          className="p-3"
        />

        <BetweenText
          labelLeft="No STNK"
          labelRight={data?.STNK || "-"}
          classNameLabelRight="font-semibold"
          className="p-3 rounded-b bg-baseLightGray"
        />
      </div>
    </ModalContainer>
  );
};

export default ModalVehicleDetails;
