import React from "react";
import { IcClose } from "../../../assets";
import { ChargingStation, Voucher } from "../../../common";
import { moments } from "../../../helpers";
import ModalContainer from "./ModalContainer";

interface Props {
  visible: boolean;
  data: Voucher;
  onDismiss: () => void;
}

const ModalSKVoucher: React.FC<Props> = ({ visible, data, onDismiss }) => {
  let dataChargingStation: ChargingStation | null = null;

  if (data?.ChargingStations && data?.ChargingStations.length) {
    dataChargingStation = data?.ChargingStations[0];
  }

  return (
    <ModalContainer
      isOpen={visible}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="h-auto"
    >
      <div className="w-full bg-white rounded-t-xl between-y">
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden relative">
          <div className="between-x mb-6">
            <label className="text-base font-semibold">S&K</label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <div className="overflow-auto scrollbar-none text-black100 mb-6">
            <h2 className="font-semibold mb-2">Masa Berlaku</h2>
            <p>{`Mulai dari ${moments(data?.StartDate).format(
              "DD MMM YYYY HH:mm"
            )} - ${
              data?.NoEndPeriod
                ? "tanpa batas waktu"
                : moments(data?.EndDate).format("DD MMM YYYY HH:mm")
            }`}</p>

            <h2 className="font-semibold mb-2 mt-6">Syarat</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Voucher tidak dapat dikembalikan</li>
              <li>Voucher hanya dapat digunakan selama periode promo</li>
              <li>
                Voucher tidak dapat diuangkan atau digabung dengan promo lain
              </li>
              <li>
                Voucher berlaku sesuai lokasi yang ditentukan{" "}
                {dataChargingStation?.Name || "-"}
              </li>
              <li>
                CASAN berhak mengubah atau menghentikan promo sewaktu-waktu
                tanpa pemberitahuan sebelumnya
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalSKVoucher;
