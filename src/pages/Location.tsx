import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcBackBlack,
  IcMenuWhite,
  IcMyLocationBlack,
  IcSearchBlack,
} from "../assets";
import { ChargingStationBody, LIMIT_LIST } from "../common";
import { LoadingPage, Map } from "../components";
import { fetchChargingStationLocations } from "../features";
import { AppDispatch, RootState } from "../store";

const Location = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const chargingStationLocations = useSelector(
    (state: RootState) => state?.chargingStationLocations
  );

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

  const onDismiss = () => {
    navigate(-1);
  };

  const onShowAll = () => {
    navigate("/location-list");
  };

  return (
    <div className="container-screen relative">
      <LoadingPage loading={chargingStationLocations?.loading}>
        <div className=" w-full h-full relative">
          {/* MAP */}
          <Map data={chargingStationLocations?.data?.data} />

          {/* SEARCH */}
          <div
            onClick={onShowAll}
            className="absolute top-4 left-4 right-4 row gap-2 flex-1 bg-white h-10 rounded-full drop-shadow px-4 cursor-pointer"
          >
            <p className="flex-1 text-black100/50 font-medium">Cari Lokasi</p>
            <IcSearchBlack />
          </div>

          {/* MY LOCATION */}
          <div
            onClick={() => alert("coming soon")}
            className="absolute left-4 bottom-[94px] bg-white p-2 rounded-lg drop-shadow cursor-pointe"
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
