import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcMenuWhite, IcMyLocationBlack } from "../assets";
import { LIMIT_LIST } from "../common";
import { LoadingPage, Map, ModalChargingStation } from "../components";
import { fetchChargingStationLocations, setFromGlobal } from "../features";
import { getCurrentLocation } from "../services/ApiAddress";
import { AppDispatch, RootState } from "../store";

const Location = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const chargingStationLocations = useSelector(
    (state: RootState) => state?.chargingStationLocations
  );
  const global = useSelector((state: RootState) => state?.global);

  const [loading, setLoading] = useState<boolean>(true);
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [centerLocation, setCenterLocation] = useState<LatLng>();

  useEffect(() => {
    getData();
    getLocation();
  }, []);

  const getData = () => {
    const body: ChargingStationBody = {
      page: 1,
      limit: LIMIT_LIST,
      is_admin: false,
    };

    dispatch(fetchChargingStationLocations(body));
  };

  const getLocation = async () => {
    try {
      const check = await getCurrentLocation();

      setCenterLocation(check);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getMyLocation = async () => {
    const check = await getCurrentLocation();
    setCurrentLocation(check);
  };

  const onShowAll = () => {
    navigate("/location-list");
  };
  

  return (
    <div className="container-screen relative">
      <LoadingPage
        loading={chargingStationLocations?.loading || loading}
        color="primary100"
      >
        <div className=" w-full h-full relative">
          {/* MAP */}
          <Map
            data={chargingStationLocations?.data?.data}
            myLocation={currentLocation}
            center={centerLocation}
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
            onClick={getMyLocation}
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

      {/* MODAL */}
      <ModalChargingStation
        isOpen={global?.openChargingStation}
        data={global?.data}
        onDismiss={() =>
          dispatch(setFromGlobal({ type: "openChargingStation", value: false }))
        }
      />
      {/* END MODAL */}
    </div>
  );
};

export default Location;
