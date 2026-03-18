import { useEffect, useMemo, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiInfo } from "react-icons/fi";
import { IoFlash, IoTimeOutline } from "react-icons/io5";

const IcIsiDaya = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <path d="M21.5 5L12 20h7l-2 11L27.5 16H20l1.5-11z" fill="#4DB6AC" />
    <path d="M21.5 5L12 20h7l-2 11L27.5 16H20l1.5-11z" fill="#F5A623" opacity="0.35" />
  </svg>
);

const IcRentToOwn = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <circle cx="13" cy="18" r="6" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
    <circle cx="13" cy="18" r="2" fill="#F5A623" />
    <path d="M18.5 18h10" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M25 18v4" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 18v4" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IcRent = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="12" stroke="#4DB6AC" strokeWidth="2.5" fill="none" />
    <circle cx="18" cy="18" r="1.8" fill="#F5A623" />
    <path d="M18 9v9l5.5 4" stroke="#4DB6AC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
import { rtoOperatorPath } from "../../constants/rtoRoutes";
import {
  formatRtoDistanceKm,
  nearestBranchDistanceKm,
  RTO_EXPLORE_OPERATORS,
  sortExploreOperatorsNearestFirst,
} from "../../data/rtoProgramExplore";
import { rupiah, moments } from "../../helpers";
import StatusRTO from "./StatusRTO";

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
  bgClass: string;
  activeBorder: string;
  activeBg: string;
}[] = [
  {
    id: "isi-daya",
    label: "Isi Daya",
    sub: "Cas motor kamu",
    icon: IcIsiDaya,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
  },
  {
    id: "rent-to-own",
    label: "Rent to Own",
    sub: "Cicil, lalu miliki",
    icon: IcRentToOwn,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
  },
  {
    id: "rent",
    label: "Rent",
    sub: "Sewa kapan saja",
    icon: IcRent,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
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

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("tab");
      if (q === "rto" || q === "rent-to-own") return "rent-to-own";
    } catch {
      /* SSR */
    }
    return "isi-daya";
  });

  useEffect(() => {
    const st = (location.state as { homeTab?: ActiveTab } | null)?.homeTab;
    if (st === "rent-to-own") {
      setActiveTab("rent-to-own");
      setSearchParams({ tab: "rto" }, { replace: true });
    }
  }, [location.state, setSearchParams]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "rto" || tab === "rent-to-own") {
      setActiveTab("rent-to-own");
    }
  }, [searchParams]);
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
  /** Sama sumber & urutan dengan halaman Jelajahi program lain (RTO_EXPLORE_OPERATORS) */
  const programsSortedByDistance = useMemo(
    () =>
      sortExploreOperatorsNearestFirst(
        RTO_EXPLORE_OPERATORS,
        currentLocation?.[0] ?? null,
        currentLocation?.[1] ?? null,
      ),
    [currentLocation],
  );

  const paginatedPrograms = programsSortedByDistance.slice(
    0,
    programPage * PROGRAMS_PER_PAGE,
  );
  const programHasMore =
    paginatedPrograms.length < programsSortedByDistance.length;

  const getLocation = async () => {
    try {
      const check = await getCurrentLocation();
      setCurrentLocation(check);
    } catch (error) {}
  };

  useEffect(() => {
    if (activeTab === "rent-to-own" && !currentLocation?.length) {
      getLocation();
    }
  }, [activeTab]);

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
    return [
      "radial-gradient(ellipse 130% 50% at 20% -5%, rgba(77,182,172,0.3) 0%, transparent 60%)",
      "radial-gradient(ellipse 90% 45% at 80% 5%, rgba(77,182,172,0.18) 0%, transparent 55%)",
      "linear-gradient(180deg, #c8ebe7 0%, #daf0ed 35%, #ecf2f0 65%, #f4f6f5 100%)",
    ].join(", ");
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
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "rent-to-own" && searchParams.get("tab")) {
                    setSearchParams({}, { replace: true });
                  }
                }}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-[14px] border-2 transition-all duration-300 relative ${
                  isActive
                    ? "bg-white border-[#4DB6AC] shadow-[0_4px_16px_rgba(77,182,172,0.12)]"
                    : "bg-white/70 backdrop-blur-sm border-transparent"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-br from-[#b2dfdb] to-[#80cbc4] shadow-[0_2px_8px_rgba(77,182,172,0.25)]"
                    : tab.bgClass
                }`}>
                  <Icon size={28} />
                </div>
                <span className={`text-[11px] font-bold leading-tight ${isActive ? "text-blackBold" : "text-black50"}`}>{tab.label}</span>
                <span className={`text-[9px] ${isActive ? "text-black70" : "text-black30"}`}>{tab.sub}</span>
                {isActive && (
                  <div className="absolute -bottom-1.5 w-[5px] h-[5px] rounded-full bg-[#4DB6AC]" />
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
            {/* PROGRAM SEKARANG — hanya login + ada program RTO aktif */}
            {isAuthenticated && dataRTO?.ID ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-blackBold">Program sekarang</span>
                  <span
                    className="text-xs font-semibold text-[#4DB6AC] cursor-pointer"
                    onClick={() => navigate("/rto-history")}
                  >
                    Riwayat →
                  </span>
                </div>

                {(() => {
              const creditLeft = dataRTO?.CreditLeft ?? 0;
              const vehicleName = dataRTO?.Vehicle?.Model || dataRTO?.Vehicle?.Brand || "Motor";
              const colorData = dataRTO?.Vehicle?.Colors?.[0];
              const imageUrl = colorData?.ImageURL || ILNoImage;
              const licensePlate = dataRTO?.LicensePlate || "-";
              const status = dataRTO?.Status;
              const nextPay = dataRTO?.NextPaymentDate;
              const targetFinish = dataRTO?.TargetFinishDate;
              const isLowCredit = creditLeft <= 7 && creditLeft > 0;
              const isSuspended = status === 7;
              const isOverdue = status === 4;

              let statusLabel = "Berlangsung";
              let statusBg = "bg-emerald-100";
              let statusText = "text-emerald-700";
              if (isOverdue) { statusLabel = "Tenggat Waktu"; statusBg = "bg-red-100"; statusText = "text-red-600"; }
              if (isSuspended) { statusLabel = "Di-suspend"; statusBg = "bg-red-500"; statusText = "text-white"; }
              if (status === 5) { statusLabel = "Libur Bayar"; statusBg = "bg-amber-100"; statusText = "text-amber-700"; }

              return (
                <button
                  type="button"
                  onClick={() => navigate(`/rto-details/${dataRTO?.ID}`)}
                  className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-[14px]">{dataRTO?.Program?.Name || "Go Green"}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">Oleh {dataRTO?.Admin?.Name || dataRTO?.Dealer || "-"}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${statusBg} ${statusText}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex gap-3 p-4">
                    <div className="w-[72px] h-[72px] rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                      <img src={imageUrl} alt={vehicleName} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[14px] truncate">{vehicleName}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{licensePlate}</p>

                      <div className="flex items-end gap-1.5 mt-2">
                        <span className={`text-2xl font-extrabold leading-none ${isLowCredit || isSuspended ? "text-red-500" : "text-[#4DB6AC]"}`}>
                          {creditLeft}
                        </span>
                        <span className="text-[12px] text-gray-600 pb-0.5">Kredit Hari tersisa</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-3 flex flex-wrap gap-x-4 gap-y-1">
                    {nextPay && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-500">
                          {isOverdue ? "Akan di-suspend:" : "Bayar selanjutnya:"}
                        </span>
                        <span className={`text-[11px] font-semibold ${isOverdue ? "text-red-500" : "text-gray-900"}`}>
                          {moments(nextPay).format("ddd, DD MMM HH:mm")} WIB
                        </span>
                      </div>
                    )}
                    {targetFinish && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-500">Selesai:</span>
                        <span className="text-[11px] font-semibold text-gray-900">
                          {moments(targetFinish).format("DD MMM YYYY")}
                        </span>
                      </div>
                    )}
                    {isSuspended && dataRTO?.OverdueCount > 0 && (
                      <span className="text-[11px] font-semibold text-red-500">
                        ({dataRTO.OverdueCount} hari di-suspend)
                      </span>
                    )}
                  </div>
                </button>
              );
            })()}
              </>
            ) : null}

            {/* RTO PROGRAMS */}
            <div className="px-0.5">
              <span className="text-[15px] font-bold text-blackBold">
                {isAuthenticated ? "Lihat RTO program lainnya" : "Program RTO yang ada"}
              </span>
            </div>

            {paginatedPrograms.map((op) => {
              const dKm =
                currentLocation?.length
                  ? nearestBranchDistanceKm(op, currentLocation[0], currentLocation[1])
                  : null;
              const distLabel =
                dKm != null
                  ? `${formatRtoDistanceKm(dKm)} km`
                  : `${op.distanceKm} km`;
              const nCabang = op.branches?.length ?? 1;
              return (
              <button
                key={op.id}
                type="button"
                onClick={() => navigate(rtoOperatorPath(op.id))}
                className="w-full text-left bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
              >
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#e0f2f1] flex items-center justify-center text-[#4DB6AC] font-bold text-xl shrink-0">
                    {op.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-[14px] leading-tight">{op.programName}</h3>
                        <p className="text-[12px] text-gray-500 mt-0.5">{op.area}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-amber-500 text-[12px] font-semibold">
                          <span>★</span>
                          <span>{op.rating}</span>
                          <span className="text-gray-400 font-normal">({op.reviewCount})</span>
                        </div>
                        <p className="text-[11px] font-semibold text-[#4DB6AC] mt-0.5">{distLabel}</p>
                        <p className="text-[10px] text-gray-400">
                          {dKm != null
                            ? nCabang > 1
                              ? `Cabang terdekat · ${nCabang} lokasi`
                              : "Dari lokasi kamu"
                            : "Perkiraan"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {op.bikes.slice(0, 3).map((b) => (
                        <span key={b.id} className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {b.name}
                        </span>
                      ))}
                      {op.bikes.length > 3 && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          +{op.bikes.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100">
                      <span className="text-[12px] text-gray-600">
                        Min. gaji <span className="font-semibold text-gray-900">{rupiah(op.minSalary)}</span>
                      </span>
                      <span className="text-[12px] font-semibold text-[#4DB6AC] flex items-center gap-0.5">
                        {op.bikes.length} motor <span aria-hidden>›</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
            })}

            {/* LOAD MORE */}
            {programHasMore && (
              <button
                onClick={() => setProgramPage((prev) => prev + 1)}
                className="w-full py-2.5 text-center text-xs font-semibold text-[#4DB6AC] bg-[#e0f2f1] rounded-xl border border-[#b2dfdb]"
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
              <span className="text-xs font-semibold text-[#4DB6AC] cursor-pointer">
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
                      ? "bg-[#4DB6AC] text-white border-[#4DB6AC]"
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
                    <p className="font-bold text-[#4DB6AC]">
                      Rp {rupiah(item.price)}<span className="text-black70 font-normal text-xs">/hari</span>
                    </p>
                    <button className="bg-[#4DB6AC] text-white text-xs font-semibold px-3.5 py-2 rounded-full">
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
