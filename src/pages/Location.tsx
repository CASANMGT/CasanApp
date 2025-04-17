import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcMenuWhite, IcMyLocationBlack } from "../assets";
import { ChargingStationBody, LatLng, LIMIT_LIST } from "../common";
import { LoadingPage, Map } from "../components";
import { fetchChargingStationLocations } from "../features";
import { AppDispatch, RootState } from "../store";

const Location = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const chargingStationLocations = useSelector(
    (state: RootState) => state?.chargingStationLocations
  );

  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const body: ChargingStationBody = {
      page: 1,
      limit: LIMIT_LIST,
      is_admin: false,
    };

    dispatch(fetchChargingStationLocations(body));
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

  const onShowAll = () => {
    navigate("/location-list");
  };

  return (
    <div className="container-screen relative">
      <LoadingPage loading={chargingStationLocations?.loading}>
        <div className=" w-full h-full relative">
          {/* MAP */}
          <Map
            data={chargingStationLocations?.data?.data}
            myLocation={currentLocation}
          />

          {/* SEARCH */}
          {/* <div
            onClick={onShowAll}
            className="absolute top-4 left-4 right-4 row gap-2 flex-1 bg-white h-10 rounded-full drop-shadow px-4 cursor-pointer"
          >
            <p className="flex-1 text-black100/50 font-medium">Cari Lokasi</p>
            <IcSearchBlack />
          </div> */}

          {/* MY LOCATION */}
          <div
            onClick={getCurrentLocation}
            className="absolute left-4 bottom-[94px] bg-white p-2 rounded-lg drop-shadow cursor-pointer"
          >
            <IcMyLocationBlack />
          </div>

          {/* ALL LIST */}
          <div
            onClick={onShowAll}
            className="row gap-1 absolute right-4 bottom-[94px] bg-blackBold/50 p-2 rounded-lg drop-shadow cursor-pointer"
          >
            <IcMenuWhite />
            <p className="text-white font-medium">Lihat Semua</p>
          </div>
        </div>
      </LoadingPage>
    </div>
  );
};

export default Location;
