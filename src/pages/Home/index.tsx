import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiInfo } from "react-icons/fi";
import { IoFlash, IoTimeOutline } from "react-icons/io5";
import { MdCheckCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcLogo, ILNoImage } from "../../assets";
import { ChargeBrandOption, LIMIT_LIST } from "../../common";
import {
  ChargingLocationCard,
  DropdownCheckbox,
  LoadingPage,
  ModalCarouselDetails,
  OngoingItem,
  Separator,
} from "../../components";
import { useAuth } from "../../context/AuthContext";
import { fetchOnGoingSessionList, setFromGlobal } from "../../features";
import { Api } from "../../services";
import { getCurrentLocation } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";
import { rupiah } from "../../helpers";
import StatusRTO from "./StatusRTO";

const HARDCODED_PROGRAMS = [
  { id: 23, name: "Sponge", dealer: "Casan Untd", vehicles: 1, banner: "" },
  { id: 22, name: "RTO Januari", dealer: "Rental Pulau Seribu", vehicles: 1, banner: "" },
  { id: 21, name: "Testing Endi", dealer: "Zeho Main Dealer, Casan", vehicles: 1, banner: "" },
  { id: 20, name: "Slinging Slasher", dealer: "PT Casan Energi", vehicles: 1, banner: "" },
  { id: 19, name: "The Hash", dealer: "Casan Untd", vehicles: 1, banner: "" },
  { id: 18, name: "Slinging Slasher", dealer: "Tebengan123", vehicles: 1, banner: "" },
  { id: 17, name: "United RTO 11.11", dealer: "United E-Bike Jakarta Barat", vehicles: 1, banner: "" },
  { id: 16, name: "Tes 051", dealer: "Smoot Alsut", vehicles: 1, banner: "" },
  { id: 15, name: "November Desember", dealer: "Smoot Alsut, Smoot ID", vehicles: 3, banner: "" },
  { id: 14, name: "Tes2", dealer: "Smoot Alsut", vehicles: 1, banner: "" },
];

type ResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

type ActiveTab = "isi-daya" | "rent-to-own" | "rent";

const TAB_CONFIG: {
  id: ActiveTab;
  label: string;
  sub: string;
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  activeBorder: string;
  activeBg: string;
}[] = [
  {
    id: "isi-daya",
    label: "Isi Daya",
    sub: "Cas motor kamu",
    icon: IoFlash,
    iconClass: "text-primary100",
    bgClass: "bg-[#e2ffe8]",
    activeBorder: "border-primary100",
    activeBg: "bg-[#e8f7f8]",
  },
  {
    id: "rent-to-own",
    label: "Rent to Own",
    sub: "Cicil, lalu miliki",
    icon: MdCheckCircle,
    iconClass: "text-[#E67E00]",
    bgClass: "bg-[#fff5e2]",
    activeBorder: "border-[#E67E00]",
    activeBg: "bg-[#fffaf1]",
  },
  {
    id: "rent",
    label: "Rent",
    sub: "Sewa kapan saja",
    icon: IoTimeOutline,
    iconClass: "text-[#1976D2]",
    bgClass: "bg-[#e6f2fd]",
    activeBorder: "border-[#1976D2]",
    activeBg: "bg-[#eef5fd]",
  },
];

const MOCK_RENTALS = [
  { name: "Maka Motors R1", specs: "72V · 60km range · 3.5kW", price: 25000, rating: 4.8, available: true },
  { name: "United T1800", specs: "60V · 45km range · 2.7kW", price: 20000, rating: 4.6, available: true },
  { name: "Uwinfly C70", specs: "48V · 35km range · 500W", price: 15000, rating: 4.5, available: false },
];

const RENT_FILTERS = ["Semua", "Harian", "Mingguan", "Bulanan", "Terdek."];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const global = useSelector((state: RootState) => state.global);
  const onGoingSessionList = useSelector(
    (state: RootState) => state.onGoingSessionList,
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("isi-daya");
  const [loading, setLoading] = useState(false);
  const [loadingRTO, setLoadingRTO] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ResponseProps>();
  const [dataRTO, setDataRTO] = useState<RTOProps>();
  const [typeVehicle, setTypeVehicle] = useState<string | number>("bike");
  const [place, setPlace] = useState<string>("terdekat");
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<number[]>([]);
  const [rentFilter, setRentFilter] = useState("Semua");

  const [programPage, setProgramPage] = useState(1);

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

  const PROGRAMS_PER_PAGE = 5;
  const paginatedPrograms = HARDCODED_PROGRAMS.slice(0, programPage * PROGRAMS_PER_PAGE);
  const programHasMore = paginatedPrograms.length < HARDCODED_PROGRAMS.length;

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
        params: { statuses: "1,2,3,4,5,7", page: 1, limit: 1 },
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

    if (delta < 8) return;

    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const shouldHide = current > lastScroll.current && current > 30;

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

  const headerBg = useMemo(() => {
    switch (activeTab) {
      case "rent-to-own":
        return [
          "radial-gradient(ellipse 130% 50% at 20% -5%, rgba(255,167,38,0.25) 0%, transparent 60%)",
          "radial-gradient(ellipse 90% 45% at 80% 5%, rgba(255,152,0,0.15) 0%, transparent 55%)",
          "linear-gradient(180deg, #fce8c8 0%, #f5ede0 35%, #f2f0ee 65%, #f4f6f5 100%)",
        ].join(", ");
      case "rent":
        return [
          "radial-gradient(ellipse 130% 50% at 20% -5%, rgba(33,150,243,0.22) 0%, transparent 60%)",
          "radial-gradient(ellipse 90% 45% at 80% 5%, rgba(66,165,245,0.15) 0%, transparent 55%)",
          "linear-gradient(180deg, #c8e2f5 0%, #dde8f0 35%, #edf0f2 65%, #f4f6f5 100%)",
        ].join(", ");
      default:
        return [
          "radial-gradient(ellipse 130% 50% at 20% -5%, rgba(0,230,118,0.3) 0%, transparent 60%)",
          "radial-gradient(ellipse 90% 45% at 80% 5%, rgba(0,200,83,0.18) 0%, transparent 55%)",
          "linear-gradient(180deg, #c8eeda 0%, #dcf0e4 35%, #ecf2ee 65%, #f4f6f5 100%)",
        ].join(", ");
    }
  }, [activeTab]);

  return (
    <div className="overflow-hidden flex flex-col w-full bg-[#f4f6f5]">
      {/* BACKGROUND HEADER */}
      <div
        className="absolute right-0 left-0 top-0 w-auto h-[300px] z-0 transition-all duration-400"
        style={{ background: headerBg }}
      />

      {/* LOGO */}
      <div className="z-10 between-x m-4 mb-2 pb-4 border-b border-b-white/40">
        <IcLogo />
        <button
          onClick={() => window.open("https://about.casan.id/", "_blank")}
          className="row gap-2 text-blackBold/70 font-semibold text-sm"
        >
          <FiInfo size={18} className="text-blackBold/50" />
          Tentang Casan →
        </button>
      </div>

      {/* SEARCH */}
      <div className="between-x p-1 rounded-full bg-white/80 backdrop-blur-sm flex-1 cursor-pointer mx-4 mb-3 z-20 border border-white/50 shadow-[0_2px_8px_rgba(0,60,30,0.04)]">
        <div
          onClick={() => navigate("/search-station")}
          className="row gap-2.5 px-3 flex-1 h-full"
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
        {/* SERVICE TAB CARDS */}
        <div className="flex gap-2.5">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-[14px] border-2 transition-all duration-300 relative ${
                  isActive
                    ? `bg-white ${tab.activeBorder} shadow-[0_4px_16px_rgba(0,50,25,0.08)]`
                    : "bg-white/70 backdrop-blur-sm border-transparent"
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? tab.id === "isi-daya"
                      ? "bg-gradient-to-br from-[#c0f5cc] to-[#88e89c] shadow-[0_2px_8px_rgba(0,200,83,0.2)]"
                      : tab.id === "rent-to-own"
                        ? "bg-gradient-to-br from-[#ffe6bf] to-[#ffc965] shadow-[0_2px_8px_rgba(255,152,0,0.2)]"
                        : "bg-gradient-to-br from-[#c8e0f5] to-[#8cc4f0] shadow-[0_2px_8px_rgba(33,150,243,0.2)]"
                    : tab.bgClass
                }`}>
                  <Icon size={22} className={tab.iconClass} />
                </div>
                <span className={`text-[11px] font-bold leading-tight ${isActive ? "text-blackBold" : "text-black50"}`}>{tab.label}</span>
                <span className={`text-[9px] ${isActive ? "text-black70" : "text-black30"}`}>{tab.sub}</span>
                {isActive && (
                  <div className={`absolute -bottom-1.5 w-[5px] h-[5px] rounded-full ${
                    tab.id === "isi-daya" ? "bg-primary100" :
                    tab.id === "rent-to-own" ? "bg-[#E67E00]" : "bg-[#1976D2]"
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* ===== ISI DAYA TAB ===== */}
        {activeTab === "isi-daya" && (
          <>
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-blackBold">Stasiun terdekat</span>
              <span
                className="text-xs font-semibold text-primary100 cursor-pointer"
                onClick={() => navigate("/location-list")}
              >
                Lihat peta →
              </span>
            </div>

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
          </>
        )}

        {/* ===== RENT TO OWN TAB ===== */}
        {activeTab === "rent-to-own" && (
          <>
            {/* ACTIVE RTO PROGRAM */}
            {isAuthenticated && dataRTO?.ID && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-blackBold">Program aktif</span>
                  <span
                    className="text-xs font-semibold text-[#E67E00] cursor-pointer"
                    onClick={() => navigate("/rto-history")}
                  >
                    Riwayat →
                  </span>
                </div>
                <StatusRTO
                  data={dataRTO}
                  onClick={() => navigate(`/rto-details/${dataRTO?.ID}`)}
                />
              </>
            )}

            {/* EXPLORE MOTORS */}
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-blackBold">Jelajahi motor lainnya</span>
            </div>

            {paginatedPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-[14px] p-3.5 flex gap-3.5 items-center cursor-pointer mb-2.5 shadow-[0_1px_6px_rgba(0,30,15,0.04)]"
                onClick={() => navigate("/select-rent-buy")}
              >
                <div className="w-[80px] h-[60px] rounded-[10px] bg-baseLightGray flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {program.banner ? (
                    <img
                      src={program.banner}
                      alt={program.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#ffe6bf] to-[#ffc965] flex items-center justify-center">
                      <MdCheckCircle size={24} className="text-[#E67E00]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-blackBold truncate">
                    {program.name}
                  </p>
                  <p className="text-[10px] text-black70 mt-0.5 truncate">
                    {program.dealer}
                  </p>
                  <p className="text-[10px] text-black50 mt-0.5">
                    {program.vehicles} kendaraan
                  </p>
                </div>
                <button className="bg-gradient-to-br from-[#FF9800] to-[#E67E00] text-white text-[11px] font-bold px-3.5 py-2 rounded-[10px] whitespace-nowrap flex-shrink-0">
                  Ajukan →
                </button>
              </div>
            ))}

            {/* LOAD MORE */}
            {programHasMore && (
              <button
                onClick={() => setProgramPage((prev) => prev + 1)}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#E67E00] bg-[#fff5e2] rounded-xl border border-[#ffe0a0]"
              >
                Lihat program lainnya →
              </button>
            )}
          </>
        )}

        {/* ===== RENT TAB ===== */}
        {activeTab === "rent" && (
          <>
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-bold text-blackBold">Sewa motor listrik</span>
              <span className="text-xs font-semibold text-[#1976D2] cursor-pointer">
                Filter →
              </span>
            </div>

            {/* FILTER PILLS */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none -mt-2">
              {RENT_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setRentFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors ${
                    rentFilter === f
                      ? "bg-[#1976D2] text-white border-[#1976D2]"
                      : "bg-white text-blackBold border-black20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* RENTAL LISTINGS */}
            {MOCK_RENTALS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="bg-baseLightGray2 h-40 flex items-center justify-center relative">
                  <img
                    src={ILNoImage}
                    alt={item.name}
                    className="h-full object-contain"
                  />
                  {item.available && (
                    <span className="absolute top-3 left-3 bg-[#e8f7f8] text-primary100 text-[10px] font-semibold px-2 py-1 rounded">
                      Tersedia
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-blackBold">{item.name}</p>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[#E67E00] text-xs">★</span>
                      <span className="text-xs font-semibold text-blackBold">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-black70 mt-1">{item.specs}</p>
                  <Separator />
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold text-[#1976D2]">
                      Rp {rupiah(item.price)}<span className="text-black70 font-normal text-xs">/hari</span>
                    </p>
                    <button className="bg-[#1976D2] text-white text-xs font-semibold px-3.5 py-2 rounded-full">
                      Sewa →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

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
    </div>
  );
};

export default Home;
