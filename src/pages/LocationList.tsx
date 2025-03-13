import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcBackBlack, IcPinGreen, IcSearchGray } from "../assets";
import {
  ChargingStationBody,
  GeocodeResult,
  LatLng,
  LIMIT_LIST,
} from "../common";
import { ChargingLocationCard, Label, LoadingPage } from "../components";
import { fetchChargingStationLocations } from "../features";
import { getCurrentLocation, getGeoCode } from "../services/ApiAddress";
import { AppDispatch, RootState } from "../store";

const LocationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  const chargingStationLocations = useSelector(
    (state: RootState) => state?.chargingStationLocations
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"Semua" | "Tersedia">("Semua");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [detailLocation, setDetailLocation] = useState<GeocodeResult>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // getDataList();
  }, [type]);

  const getData = async () => {
    const check = await getCurrentLocation();

    const res: GeocodeResult = await getGeoCode({
      address: `${check[0]},${check[1]}`,
    });

    setDetailLocation(res);
    setCurrentLocation(check);
    setLoading(false);
  };

  const getDataList = (nextPage?: number) => {
    if (currentLocation?.length) {
      const body: ChargingStationBody = {
        page: nextPage || page,
        limit: LIMIT_LIST,
      };

      dispatch(fetchChargingStationLocations(body));
    }
  };

  const onLoadMore = () => {
    const nextPage: number = page + 1;
    setPage(nextPage);
    getDataList(nextPage);
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const onSearch = () => {
    alert("coming soon");
  };

  const isShowData = chargingStationLocations?.data?.data ? true : false;

  return (
    <div className="background-1 overflow-hidden flex flex-col">
      {/* SEARCH */}
      <div className="row gap-4 drop-shadow mx-4 mt-4">
        <div
          onClick={onDismiss}
          className="h-10 w-10 rounded-full bg-baseLightGray/70 cursor-pointer center"
        >
          <IcBackBlack />
        </div>

        {!loading && !chargingStationLocations?.loading && (
          <div
            onClick={onSearch}
            className="row gap-2 flex-1 bg-baseLightGray/70 h-10 rounded-full drop-shadow px-4 cursor-pointer"
          >
            <IcSearchGray />
            <p className="flex-1 text-black50 font-medium">
              Cari lokasi pengecekan
            </p>
          </div>
        )}
      </div>

      <LoadingPage loading={loading || chargingStationLocations?.loading}>
        {/* Filter */}
        <div className="between-x mx-4 mt-5">
          <div className="row gap-3">
            <Label
              label="Semua"
              isActive={type === "Semua"}
              onClick={() => setType("Semua")}
            />
            <Label
              label="Tersedia"
              isActive={type === "Tersedia"}
              onClick={() => setType("Tersedia")}
            />
          </div>

          <div className="row rounded-full bg-white/30 h-[28px] center px-[14px] text-xs text-primary100">
            <IcPinGreen />
            <span className="font-semibold ml-1">{detailLocation?.city}</span>
            <span className="font-medium">{`, ${detailLocation?.province}`}</span>
          </div>
        </div>

        {/* LIST */}
        <div className="overflow-auto px-4 pt-3 scrollbar-none">
          {isShowData &&
            chargingStationLocations?.data?.data.map((item, index: number) => (
              <ChargingLocationCard
                key={index}
                type="location-list"
                data={item}
                currentLocation={currentLocation}
                loading={chargingStationLocations?.loading}
                isLast={
                  chargingStationLocations?.data?.data &&
                  index === chargingStationLocations?.data?.data.length - 1 &&
                  page * LIMIT_LIST ==
                    chargingStationLocations?.data?.data.length
                }
                onClick={() =>
                  navigate("/charging-station-details", {
                    state: { data: item, currentLocation },
                  })
                }
                onLoadMore={onLoadMore}
              />
            ))}
        </div>
      </LoadingPage>
    </div>
  );
};

export default LocationList;
