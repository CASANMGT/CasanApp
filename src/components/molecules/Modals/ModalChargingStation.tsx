import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcClose } from "../../../assets";
import { LatLng } from "../../../common";
import { fetchLocationById } from "../../../features";
import { AppDispatch, RootState } from "../../../store";
import { LoadingPage } from "../../atoms";
import { ChargingLocationCard } from "../Cards";
import ModalContainer from "./ModalContainer";

interface ModalChargingStationProps {
  isOpen: boolean;
  locationId: string;
  onDismiss: () => void;
}

const ModalChargingStation: React.FC<ModalChargingStationProps> = ({
  isOpen,
  locationId,
  onDismiss,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const locationById = useSelector((state: RootState) => state.locationById);

  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    if (isOpen && locationId) {
      getData();
      getCurrentLocation();
    }
  }, [isOpen]);

  const getData = () => {
    dispatch(fetchLocationById(locationId));
  };

  const getCurrentLocation = () => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            console.log("User denied the request for Geolocation.");
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            console.log("Location information is unavailable.");
          } else if (err.code === err.TIMEOUT) {
            console.log("The request to get user location timed out.");
          } else {
            console.log("An unknown error occurred.");
          }
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  return (
    <ModalContainer isOpen={isOpen} isBottom onDismiss={onDismiss}>
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="between-x">
          <span className="text-base font-semibold">
            Daftar Stasiun Pengecasan
          </span>

          <IcClose onClick={onDismiss} className="cursor-pointer" />
        </div>

        <div className="flex-1 overflow-hidden relative">
          <LoadingPage
            loading={
              !locationById?.data?.data?.ChargingStations &&
              locationById?.loading
            }
          >
            {locationById?.data?.data?.ChargingStations &&
              locationById?.data?.data?.ChargingStations.map(
                (item, index: number) => (
                  <ChargingLocationCard
                    key={index}
                    data={item}
                    loading={locationById?.loading}
                    currentLocation={currentLocation}
                    onClick={() =>
                      navigate("/charging-station-details", {
                        state: { data: item, currentLocation },
                      })
                    }
                  />
                )
              )}
          </LoadingPage>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalChargingStation;
