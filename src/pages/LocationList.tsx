import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcBackBlack, IcPinGreen } from "../assets";
import { ChargeBrandOption, GeocodeResult, LIMIT_LIST } from "../common";
import { ChargingLocationCard, DropdownCheckbox, Label, LoadingPage } from "../components";
import { Api } from "../services";
import { getCurrentLocation, getGeoCode } from "../services/ApiAddress";
import { AppDispatch } from "../store";

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

const LocationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate: NavigateFunction = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ResponseProps>();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"Semua" | "Tersedia">("Semua");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [detailLocation, setDetailLocation] = useState<GeocodeResult>();
  const [filter, setFilter] = useState<OptionsProps[]>([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getDataList();
  }, [filter]);

  const getData = async () => {
    const check = await getCurrentLocation();

    const res: GeocodeResult = await getGeoCode({
      address: `${check[0]},${check[1]}`,
    });

    setDetailLocation(res);
    setCurrentLocation(check);
  };

  const getDataList = async (nextPage?: number) => {
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

  const isShowData = data?.data ? true : false;

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

        {/* {!loading && !chargingStationLocations?.loading && (
          <div
            onClick={onSearch}
            className="row gap-2 flex-1 bg-baseLightGray/70 h-10 rounded-full drop-shadow px-4 cursor-pointer"
          >
            <IcSearchGray />
            <p className="flex-1 text-black50 font-medium">
              Cari lokasi pengecekan
            </p>
          </div>
        )} */}
      </div>

      <LoadingPage loading={loading}>
        {/* Filter */}
        <div className="between-x mx-4 mt-5">
          <div className="row rounded-full bg-white/30 h-[28px] center px-[14px] text-xs text-primary100">
            <IcPinGreen />
            <span className="font-semibold ml-1">{detailLocation?.city}</span>
          </div>

          <DropdownCheckbox
            selected={filter}
            options={ChargeBrandOption}
            onApply={(s) => setFilter(s)}
          />
        </div>

        {/* LIST */}
        <div className="overflow-auto px-4 pt-3 scrollbar-none">
          {isShowData &&
            data?.data.map((item, index: number) => (
              <ChargingLocationCard
                key={index}
                type="location-list"
                data={item}
                currentLocation={currentLocation}
                loading={loading}
                isLast={
                  data?.data &&
                  index === data?.data.length - 1 &&
                  page * LIMIT_LIST == data?.data.length
                }
                onClick={() =>
                  navigate(`/charging-station-details/${item?.ID}`, {
                    state: { currentLocation },
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
