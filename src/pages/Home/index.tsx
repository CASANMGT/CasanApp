import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChargeBrandOption, LIMIT_LIST } from "../../common";
import {
  ChargingLocationCard,
  DropdownCheckbox,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchOnGoingSessionList, setFromGlobal } from "../../features";
import { Api } from "../../services";
import { getCurrentLocation } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";
import StatusRTO from "./StatusRTO";

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const global = useSelector((state: RootState) => state.global);
  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList
  );

  const [loading, setLoading] = useState(false);
  const [loadingRTO, setLoadingRTO] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ResponseProps>();
  const [dataRTO, setDataRTO] = useState<RTOProps>();
  const [typeVehicle, setTypeVehicle] = useState<string | number>("bike");
  const [place, setPlace] = useState<string>("terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<number[]>([]);

  const [hideHeader, setHideHeader] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);

  useEffect(() => {
    setPage(1);
    if (!currentLocation) getLocation();
    if (isAuthenticated) {
      getOngoing();
      getDataRTO();
    }
  }, []);

  useEffect(() => {
    getData();
  }, [currentLocation, filter, page]);

  const getLocation = async () => {
    try {
      const check = await getCurrentLocation();

      setCurrentLocation(check);
    } catch (error) {}
  };

  const getData = async () => {
    try {
      setLoading(true);
      const body: ChargingStationBody = {
        page: page,
        limit: LIMIT_LIST,
        is_admin: false,
      };

      if (currentLocation?.length) {
        body.latitude = currentLocation[0];
        body.longitude = currentLocation[1];
      }

      if (filter?.length) body.brands = JSON.stringify(filter);

      const res = await Api.get({
        url: "stations/locations",
        params: body,
      });

      setData((prev) =>
        page > 1 && prev?.data?.length
          ? { ...prev, data: [...prev.data, ...res.data] }
          : res
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getOngoing = () => {
    const body = {
      page: 1,
      limit: 10,
      is_finish: 0,
    };
    dispatch(fetchOnGoingSessionList(body));
  };

  const getDataRTO = async () => {
    try {
      setLoadingRTO(true);
      const res = await Api.get({
        url: "rtos",
        params: { statuses: "1,2,3,4,5,8,9,11", page: 1, limit: 1 },
      });

      setDataRTO(res?.data?.[0] ?? undefined);
    } catch (error) {
    } finally {
      setLoadingRTO(false);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const current = el.scrollTop;
    setHideHeader(current > lastScroll.current && current > 20);
    lastScroll.current = current;
  };

  const isShowOngoing: boolean = useMemo(
    () =>
      onGoingSessionList?.data?.data && onGoingSessionList?.data?.data.length
        ? true
        : false,
    [onGoingSessionList?.data]
  );

  // ${hideHeader ? "-translate-y-6 opacity-0 h-0 overflow-hidden" : "translate-y-0 opacity-100 h-auto"}
  return (
    <div className="overflow-hidden flex flex-col w-full">
      {/* SEARCH */}
      <div className="between-x m-4 gap-4">
        <div
          onClick={() => navigate("/search-station")}
          className="row px-3 h-10 rounded-full bg-baseLightGray/70 gap-2.5 flex-1 cursor-pointer"
        >
          <CiSearch size={20} className="text-black70" />
          <span className="text-black70 text-xs">Cari lokasi pengecasan</span>
        </div>

        <DropdownCheckbox
          isIconOnly
          selected={filter}
          options={ChargeBrandOption}
          onApply={(s) => {
            setPage(1);
            setFilter(s);
          }}
        />
      </div>

      <div className="h-screen w-full relative px-4">
        <div
          className={`absolute top-0 left-0 right-0 z-20 p-4 transition-all duration-300 ${
            hideHeader
              ? "-translate-y-full opacity-0"
              : "translate-y-0 opacity-100"
          } `}
        >
          {/* ONGOING */}
          {isShowOngoing && (
            <div className="bg-white rounded-lg p-3 mt-5">
              <p className="font-medium mb-3">Sedang berlangsung</p>
              <div className="row gap-2 overflow-x-auto scrollbar-none">
                {onGoingSessionList?.data?.data.map(
                  (item: any, index: number) => (
                    <OngoingItem
                      key={index}
                      data={item}
                      onClick={() => navigate(`/charging/${item?.ID}`)}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* STATUS RTO */}
          {dataRTO?.ID && (
            <StatusRTO
              data={dataRTO}
              onClick={() => navigate(`/booking-details/${dataRTO?.ID}`)}
            />
          )}
        </div>

        {/* CHARGING LIST */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={`h-full overflow-y-auto scrollbar-none transition-all duration-300
          ${hideHeader ? "pt-0" : "pt-0"}
        `}
        >
          <LoadingPage loading={!data?.data && loading} color="primary100">
            {data?.data &&
              data?.data.map((item, index: number) => (
                <ChargingLocationCard
                  key={index}
                  data={item}
                  loading={loading}
                  currentLocation={currentLocation}
                  isLast={
                    index === data?.data.length - 1 &&
                    page * LIMIT_LIST === data?.data.length
                  }
                  onClick={() =>
                    navigate(`/station-details/${item?.ID}`, {
                      state: { currentLocation },
                    })
                  }
                  onLoadMore={() => setPage((prev) => prev + 1)}
                />
              ))}
          </LoadingPage>
        </div>
      </div>

      {/* MODAL */}
      {global?.openCarousel && (
        <ModalCarouselDetails
          visible
          data={global?.data}
          onDismiss={() =>
            dispatch(
              setFromGlobal({
                type: "openCarousel",
                value: false,
              })
            )
          }
        />
      )}
      {/* END MODAL */}
    </div>
  );
};

export default Home;
