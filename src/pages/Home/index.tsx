import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiInfo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcLogo } from "../../assets";
import { ChargeBrandOption, LIMIT_LIST } from "../../common";
import {
  ChargingLocationCard,
  DropdownCheckbox,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchOnGoingSessionList, setFromGlobal } from "../../features";
import { Api } from "../../services";
import { getCurrentLocation } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";
import StatusRTO from "./StatusRTO";
import { openURL } from "../../helpers";

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
    (state: RootState) => state.onGoingSessionList,
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
  const ticking = useRef(false);
  const lastHidden = useRef(false);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!el || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideHeader(!entry.isIntersecting);
      },
      {
        root: el,
        threshold: 1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
          : res,
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
        params: { statuses: "1,2,4,5,7", page: 1, limit: 1 },
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
    const delta = Math.abs(current - lastScroll.current);

    // ⛔ abaikan scroll kecil (touch jitter)
    if (delta < 8) return;

    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const shouldHide = current > lastScroll.current && current > 30;

      // ⛔ JANGAN update state jika sama
      if (shouldHide !== lastHidden.current) {
        lastHidden.current = shouldHide;
        setHideHeader(shouldHide);
      }

      lastScroll.current = current;
      ticking.current = false;
    });
  };

  const isShowOngoing: boolean = useMemo(
    () =>
      onGoingSessionList?.data?.data && onGoingSessionList?.data?.data.length
        ? true
        : false,
    [onGoingSessionList?.data],
  );

  let pList = 16;

  if (isShowOngoing) {
    pList += 110;
  }

  if (dataRTO?.ID) {
    pList += 140 + 16;
  }

  return (
    <div className="overflow-hidden flex flex-col w-full">
      {/* BACKGROUND HEADER */}
      <div
        className="absolute right-0 left-0 top-0 w-auto h-[260px] rounded-b-2xl z-0"
        style={{
          background: `linear-gradient(270deg, #19ACB6, #2DBA9D)`,
        }}
      ></div>

      {/* LOGO */}
      <div className="z-10 between-x m-4 mb-2.5 ">
        <IcLogo />

        <button
          onClick={() => window.open("https://about.casan.id/", "_blank")}
        >
          <FiInfo size={20} className="text-white" />
        </button>
      </div>

      {/* SEARCH */}
      <div className="between-x p-1 rounded-full bg-white flex-1 cursor-pointer mx-4 mb-4 z-20">
        <div
          onClick={() => navigate("/search-station")}
          className="row gap-2.5 px-3"
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

      <div className="h-full overflow-y-auto overscroll-contain scrollbar-none transition-all duration-300 px-3 space-y-4 z-10">
        {/* ONGOING */}
        {isShowOngoing && (
          <div className="bg-white rounded-lg p-3 h-[110px]">
            <p className="font-medium mb-3">Sedang berlangsung</p>
            <div className="row gap-2 overflow-x-auto scrollbar-none">
              {onGoingSessionList?.data?.data.map(
                (item: any, index: number) => (
                  <OngoingItem
                    key={index}
                    data={item}
                    onClick={() => navigate(`/charging/${item?.ID}`)}
                  />
                ),
              )}
            </div>
          </div>
        )}

        {/* STATUS RTO */}
        {dataRTO?.ID && (
          <StatusRTO
            data={dataRTO}
            onClick={() => navigate(`/rto-details/${dataRTO?.ID}`)}
          />
        )}

        {/* CHARGING LIST */}
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

        <div className="h-10" />
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
              }),
            )
          }
        />
      )}
      {/* END MODAL */}
    </div>
  );
};

export default Home;
