import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcMenuWhite, IcMyLocationBlack } from "../assets";
import { ChargeBrandOption } from "../common";
import {
  DropdownCheckbox,
  LoadingPage,
  Map,
  ModalChargingStation,
} from "../components";
import { setFromGlobal } from "../features";
import { Api } from "../services";
import { getCurrentLocation } from "../services/ApiAddress";
import { AppDispatch, RootState } from "../store";

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

const Location = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const global = useSelector((state: RootState) => state?.global);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [data, setData] = useState<ResponseProps>();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [centerLocation, setCenterLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<OptionsProps[]>([]);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getData();
  }, [filter]);

  const getData = async () => {
    try {
      setLoading(true);

      const body: ChargingStationBody = {
        page: 1,
        limit: 100,
        is_admin: false,
      };

      if (filter?.length) {
        const value = filter.map((e) => Number(e?.value));
        body.brands = JSON.stringify(value);
      }

      const res = await Api.get({
        url: "stations",
        params: body,
      });

      setData(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      setLoadingLocation(true);
      const check = await getCurrentLocation();

      setCenterLocation(check);
    } catch (error) {
    } finally {
      setLoadingLocation(false);
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
      <LoadingPage loading={loading || loadingLocation} color="primary100">
        <div className=" w-full h-full relative">
          {/* MAP */}
          <Map
            data={data?.data}
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

          {/* FILTER */}
          <div className="absolute right-4 top-4">
            <DropdownCheckbox
              selected={filter}
              isIconOnly
              options={ChargeBrandOption}
              onApply={(s) => setFilter(s)}
            />
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
