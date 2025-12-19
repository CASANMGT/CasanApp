import { useEffect, useState } from "react";
import { LuShare } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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

const API_URL = import.meta.env.VITE_API_URL;

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

const Location = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterParams = searchParams.get("filter") || "[]";

  const global = useSelector((state: RootState) => state?.global);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [data, setData] = useState<ResponseProps>();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [centerLocation, setCenterLocation] = useState<LatLng>([
    -6.208763, 106.845599,
  ]);

  // useEffect(() => {
  //   getLocation();
  // }, []);

  useEffect(() => {
    getData();
  }, [filterParams]);

  const getData = async () => {
    try {
      setLoading(true);

      const body: ChargingStationBody = {
        page: 1,
        limit: 100,
        is_admin: false,
      };

      const convertFilter: number[] = JSON.parse(filterParams);
      if (convertFilter?.length) {
        body.brands = filterParams;
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
    navigate(`/location-list?filter=${filterParams}`);
  };

  const onShare = () => {
    const isStaging: boolean = API_URL.includes("staging");
    let brands: string = "";
    let total = filtered?.length ?? 0;
    const dataFilter = ChargeBrandOption.filter((e) =>
      JSON.parse(filterParams).includes(Number(e?.value))
    );

    if (dataFilter?.length) brands = dataFilter?.map((e) => e?.name).join(", ");

    let urlDevice = `https://${
      isStaging ? "staging.casan.id" : "casan.id"
    }/home/location`;

    const convertFilter: number[] = JSON.parse(filterParams);
    if (convertFilter?.length) {
      urlDevice += `?filter=${filterParams}`;
    }

    const url =
      "https://wa.me/?text=" +
      encodeURIComponent(
        `Klik link untuk melihat stasiun charging ${
          brands ? `${brands} ` : ""
        }(${total} stasiun) ${urlDevice}`
      );

    window.open(url, "_blank");
  };

  const filtered = data?.data?.filter((e) => e?.Devices?.length);

  return (
    <div className="container-screen relative">
      <LoadingPage loading={loading || loadingLocation} color="primary100">
        <div className=" w-full h-full relative">
          {/* MAP */}
          <Map
            data={filtered}
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
              selected={JSON.parse(filterParams)}
              isIconOnly
              options={ChargeBrandOption}
              onApply={(s) => setSearchParams({ filter: JSON.stringify(s) })}
            />
          </div>

          {/* SHARE */}
          <button
            onClick={onShare}
            className="absolute right-4 top-14 px-4 py-2 bg-white rounded-full row gap-2 font-medium text-blackBold"
          >
            <LuShare size={16} />
            Bagikan Peta
          </button>

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
      {global?.openChargingStation && (
        <ModalChargingStation
          isOpen={global?.openChargingStation}
          data={global?.data}
          filter={JSON.parse(filterParams)}
          onDismiss={() =>
            dispatch(
              setFromGlobal({ type: "openChargingStation", value: false })
            )
          }
        />
      )}
      {/* END MODAL */}
    </div>
  );
};

export default Location;
