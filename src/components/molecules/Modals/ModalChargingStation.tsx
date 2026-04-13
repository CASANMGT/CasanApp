import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IcClose } from "../../../assets";
import { getCurrentLocation } from "../../../services/ApiAddress";
import { LoadingPage } from "../../atoms";
import { ChargingLocationCard } from "../Cards";
import ModalContainer from "./ModalContainer";

interface ModalChargingStationProps {
  isOpen: boolean;
  data: ChargingStation[] | undefined;
  filter: number[];
  onDismiss: () => void;
}

const ModalChargingStation: React.FC<ModalChargingStationProps> = ({
  isOpen,
  data,
  filter,
  onDismiss,
}) => {
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    if (isOpen) {
      getMyLocation();
    }
  }, [isOpen]);

  const getMyLocation = async () => {
    const check = await getCurrentLocation();
    setCurrentLocation(check);
  };

  const dataFiltered = (data || []).filter((station) => {
    // jika filter kosong → return semua
    if (!filter || filter.length === 0) return true;

    return (station.Devices || []).some((device) =>
      (device.Sockets || []).some(
        (socket) =>
          socket?.VehicleBrandID !== undefined &&
          filter.includes(socket?.VehicleBrandID),
      ),
    );
  });

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="between-x mb-6">
          <span className="text-base font-semibold">
            Daftar Stasiun Pengecasan
          </span>

          <IcClose onClick={onDismiss} className="cursor-pointer" />
        </div>

        <div className="flex-1 overflow-hidden relative">
          <LoadingPage loading={false}>
            {dataFiltered &&
              dataFiltered.map((item, index: number) => (
                <ChargingLocationCard
                  key={index}
                  data={item}
                  loading={false}
                  currentLocation={currentLocation}
                  onClick={() => {
                    navigate(`/station-details/${item?.ID}`, {
                      state: { currentLocation },
                    });
                    onDismiss();
                  }}
                />
              ))}
          </LoadingPage>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalChargingStation;
