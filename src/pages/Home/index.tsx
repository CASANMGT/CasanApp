import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IcLogo, ILNoImage } from "../../assets";
import { LIMIT_LIST } from "../../common";
import {
  ChargingLocationCard,
  DropdownCheckbox,
  LoadingPage,
  ModalCarouselDetails,
  Separator,
} from "../../components";
import { rtoOperatorPath } from "../../constants/rtoRoutes";
import { useAuth } from "../../context/AuthContext";
import {
  formatRtoDistanceKm,
  nearestBranchDistanceKm,
  RTO_EXPLORE_OPERATORS,
  sortExploreOperatorsNearestFirst,
} from "../../data/rtoProgramExplore";
import { fetchOnGoingSessionList, setFromGlobal } from "../../features";
import { moments, rupiah } from "../../helpers";
import { Api } from "../../services";
import { getCurrentLocation } from "../../services/ApiAddress";
import { AppDispatch, RootState } from "../../store";

/** Brand teal — aligned with RTO / app primary */
const HOME_ICON_TEAL = "#4DB6AC";

const IcIsiDaya = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
    <circle cx="18" cy="18" r="14" fill={HOME_ICON_TEAL} />
    {/* Yellow lightning bolt */}
    <path d="M20 8L13 19h4.2L15 28l8-12h-4.2L20 8z" fill="#FFCA28" />
  </svg>
);

const IcRentToOwn = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
    <circle cx="18" cy="18" r="14" fill={HOME_ICON_TEAL} />
    {/*
      Key + plus: drawn horizontal (head on the right), then rotated so head reads top-right
      and bit bottom-left (~45°), matching the reference mock.
    */}
    <g transform="translate(18,18) rotate(-44) translate(-18,-18)">
      {/* Key head */}
      <circle cx="24.2" cy="18" r="4.6" fill="#FFC107" />
      {/* Hole offset toward top-right of head */}
      <circle cx="25.9" cy="16.1" r="1.35" fill={HOME_ICON_TEAL} />
      {/* Shaft */}
      <rect
        x="9.2"
        y="16.15"
        width="14.5"
        height="3.7"
        rx="0.9"
        fill="#FFC107"
      />
      {/* Bit: three notches on the left */}
      <path
        d="M9.2 15.1H6.4v1.55H7.9v1.75H6.4v1.55H7.9v1.75H6.4v1.55h2.8v-8.15z"
        fill="#FFC107"
      />
      {/* Plus — sits below / beside shaft, still inside circle */}
      <path
        d="M21.6 22.4h1.35v-1.35h1.35v1.35h1.35v1.35h-1.35v1.35h-1.35v-1.35h-1.35z"
        fill="#FFC107"
      />
    </g>
  </svg>
);

const IcRent = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden>
    <circle cx="18" cy="18" r="14" fill={HOME_ICON_TEAL} />
    {/* Yellow stopwatch body */}
    <circle
      cx="18"
      cy="18.5"
      r="7"
      stroke="#FFCA28"
      strokeWidth="2"
      fill="none"
    />
    {/* Stopwatch top button */}
    <rect x="16.2" y="8.5" width="3.6" height="2.2" rx="1" fill="#FFCA28" />
    {/* Stopwatch side lug */}
    <rect x="22.8" y="12" width="2" height="3.2" rx="1" fill="#FFCA28" />
    {/* Hands */}
    <path
      d="M18 14.5v4l2.8 2"
      stroke="#FFCA28"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="18.5" r="1.1" fill="#FFCA28" />
  </svg>
);

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
  ariaLabel: string;
  icon: React.ElementType;
  bgClass: string;
  activeBorder: string;
  activeBg: string;
}[] = [
  {
    id: "isi-daya",
    label: "Isi Daya",
    sub: "Cas motor kamu",
    ariaLabel: "Isi Daya — cas motor di stasiun terdekat",
    icon: IcIsiDaya,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
  },
  {
    id: "rent-to-own",
    label: "Rent to Own",
    sub: "Cicil, lalu miliki",
    ariaLabel: "Rent to Own — cicilan sampai motor jadi milik kamu",
    icon: IcRentToOwn,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
  },
  {
    id: "rent",
    label: "Rent",
    sub: "Sewa harian / bulanan",
    ariaLabel: "Rent — sewa motor harian atau bulanan",
    icon: IcRent,
    bgClass: "bg-[#e0f2f1]",
    activeBorder: "border-[#4DB6AC]",
    activeBg: "bg-[#e0f2f1]",
  },
];

const MOCK_RENTALS = [
  {
    name: "Maka Motors R1",
    specs: "72V · 60km range · 3.5kW",
    price: 25000,
    rating: 4.8,
    available: true,
  },
  {
    name: "United T1800",
    specs: "60V · 45km range · 2.7kW",
    price: 20000,
    rating: 4.6,
    available: true,
  },
  {
    name: "Uwinfly C70",
    specs: "48V · 35km range · 500W",
    price: 15000,
    rating: 4.5,
    available: false,
  },
];

const RENT_FILTERS = ["Semua", "Harian", "Mingguan", "Bulanan", "Terdek."];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();

  const global = useSelector((state: RootState) => state.global);

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
  const [currentLocation, setCurrentLocation] = useState<LatLng>();
  const [filter, setFilter] = useState<number[]>([]);
  const [rentFilter, setRentFilter] = useState("Semua");
  const [brandOptions, setBrandOptions] = useState<OptionsProps[]>([]);

  const [programPage, setProgramPage] = useState(1);

  useEffect(() => {
    setPage(1);
    getBrands();
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

  const getBrands = async () => {
    try {
      const res = await Api.get({
        url: "vehicle-brands",
        params: { is_charging: true },
      });

      if (res?.data?.length) {
        setBrandOptions(
          res.data.map((e: VehicleBrandProps) => ({
            value: e?.ID,
            name: e?.Name || "-",
          })),
        );
      }
    } catch (error) {}
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

  const headerBg = useMemo(() => {
    return [
      "radial-gradient(ellipse 130% 50% at 20% -5%, rgba(38,166,154,0.7) 0%, transparent 60%)",
      "radial-gradient(ellipse 90% 45% at 80% 5%, rgba(38,166,154,0.5) 0%, transparent 55%)",
      "linear-gradient(180deg, #26a69a 0%, #4DB6AC 40%, #b2dfdb 70%, #f4f6f5 100%)",
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
          className="row gap-2 text-white font-semibold text-sm"
        >
          <FiInfo size={18} className="text-white/80" />
          Tentangs Casan →
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
          options={brandOptions}
          onApply={(s) => {
            setPage(1);
            setFilter(s);
          }}
        />
      </div>

      <div className="h-full overflow-y-auto overscroll-contain scrollbar-none transition-all duration-300 px-3 space-y-4 z-10">
        {/* SERVICE TAB CARDS */}
        <div
          role="tablist"
          aria-label="Pilih layanan utama"
          className="flex gap-2.5"
        >
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                id={`home-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`home-tabpanel-${tab.id}`}
                aria-label={tab.ariaLabel}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== "rent-to-own" && searchParams.get("tab")) {
                    setSearchParams({}, { replace: true });
                  }
                }}
                className={`relative flex-1 flex flex-col items-center gap-2 p-3 rounded-[14px] border-2 transition-all duration-200 ease-out ${
                  isActive
                    ? "cursor-default bg-white border-[#4DB6AC] shadow-[0_4px_20px_rgba(77,182,172,0.25)]"
                    : "cursor-pointer bg-white/70 backdrop-blur-sm border-transparent opacity-85 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-br from-[#4DB6AC] to-[#26a69a] shadow-[0_0_12px_rgba(77,182,172,0.4)]"
                      : tab.bgClass
                  }`}
                >
                  <Icon size={28} />
                </div>
                <span
                  className={`font-bold leading-tight ${isActive ? "text-[13px] text-[#4DB6AC] tracking-wide" : "text-[11px] text-black70"}`}
                >
                  {tab.label}
                </span>
                <span
                  className={`text-[9px] ${isActive ? "text-blackBold" : "text-black50"}`}
                >
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {activeTab === "rent-to-own" && (
          <p className="-mt-1 px-1 text-center text-[10px] leading-snug text-gray-500">
            Cicilan sampai motor jadi milik kamu — berbeda dengan sewa harian di
            tab Rent.
          </p>
        )}

        {/* ===== ISI DAYA TAB ===== */}
        {activeTab === "isi-daya" && (
          <div
            id="home-tabpanel-isi-daya"
            role="tabpanel"
            aria-labelledby="home-tab-isi-daya"
            className="space-y-4"
          >
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-blackBold">
                Stasiun terdekat
              </span>
              <span
                className="text-xs font-semibold text-primary100 cursor-pointer"
                onClick={() => navigate("/location-list")}
              >
                Lihat peta →
              </span>
            </div>

            {/* CHARGING LIST - PREVIEW WITH DUMMY DATA */}
            {/* <ChargingLocationCard
              data={mockStationForPreview as ChargingStation}
              loading={false}
              currentLocation={currentLocation}
              isLast={false}
              onClick={() => {}}
            /> */}

            {/* Real data below */}
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
        )}

        {/* ===== RENT TO OWN TAB ===== */}
        {activeTab === "rent-to-own" && (
          <div
            id="home-tabpanel-rent-to-own"
            role="tabpanel"
            aria-labelledby="home-tab-rent-to-own"
            className="space-y-4"
          >
            {/* PROGRAM SEKARANG — hanya login + ada program RTO aktif */}
            {isAuthenticated && dataRTO?.ID ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-medium text-blackBold">
                    Program sekarang
                  </span>
                  <span
                    className="text-xs font-semibold text-[#4DB6AC] cursor-pointer"
                    onClick={() => navigate("/rto-history")}
                  >
                    Riwayat →
                  </span>
                </div>

                {(() => {
                  const creditLeft = dataRTO?.CreditLeft ?? 0;
                  const creditPaid = dataRTO?.CreditPaid ?? 0;
                  const totalCredits =
                    dataRTO?.Payment ?? creditLeft + creditPaid;
                  const progressPct =
                    totalCredits > 0
                      ? Math.round((creditPaid / totalCredits) * 100)
                      : 0;
                  const brand =
                    dataRTO?.Vehicle?.VehicleModel?.VehicleBrand || "";
                  const model = dataRTO?.Vehicle?.VehicleModel?.ModelName || "";
                  const vehicleName = [brand, model].filter(Boolean).join(" ");
                  const colorData = dataRTO?.Vehicle?.Colors?.[0];
                  const imageUrl = colorData?.ImageURL || ILNoImage;
                  const licensePlate = dataRTO?.LicensePlate;
                  const status = dataRTO?.Status;
                  const nextPay = dataRTO?.NextPaymentDate;
                  const targetFinish = dataRTO?.TargetFinishDate;
                  const isLowCredit = creditLeft <= 7 && creditLeft > 0;
                  const isSuspended = status === 7;
                  const isOverdue = status === 4;

                  let statusLabel = "Berlangsung";
                  let statusBg = "bg-emerald-100";
                  let statusText = "text-emerald-700";
                  if (isOverdue) {
                    statusLabel = "Tenggat waktu";
                    statusBg = "bg-red-100";
                    statusText = "text-red-600";
                  }
                  if (isSuspended) {
                    statusLabel = "Di-suspend";
                    statusBg = "bg-red-500";
                    statusText = "text-white";
                  }
                  if (status === 5) {
                    statusLabel = "Libur bayar";
                    statusBg = "bg-amber-100";
                    statusText = "text-amber-700";
                  }

                  return (
                    <button
                      type="button"
                      onClick={() => navigate(`/rto-details/${dataRTO?.ID}`)}
                      className="w-full overflow-hidden rounded-2xl border border-gray-100/90 bg-white text-left shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all active:scale-[0.99] hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
                    >
                      <div className="border-b border-gray-100 px-4 pb-3 pt-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[15px] font-bold leading-tight text-gray-900">
                                {vehicleName}
                              </p>
                              {licensePlate && (
                                <span className="shrink-0 text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {licensePlate}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] leading-snug text-gray-500">
                              {dataRTO?.Program?.Name || "Program RTO"}
                              <span className="text-gray-300"> · </span>
                              {dataRTO?.Admin?.Name || dataRTO?.Dealer || "-"}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 ${statusBg} ${statusText}`}
                            style={{
                              backgroundColor: isSuspended
                                ? "#ef4444"
                                : isOverdue
                                  ? "#fee2e2"
                                  : status === 5
                                    ? "#fef3c7"
                                    : "#d1fae5",
                              color: isSuspended
                                ? "#ffffff"
                                : isOverdue
                                  ? "#dc2626"
                                  : status === 5
                                    ? "#b45309"
                                    : "#047857",
                            }}
                          >
                            {(isSuspended || isOverdue) && (
                              <FiAlertTriangle size={12} />
                            )}
                            {statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 p-4">
                        <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={vehicleName}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-end gap-1.5">
                            <span
                              className="text-2xl font-extrabold leading-none tabular-nums"
                              style={{
                                color:
                                  isLowCredit || isSuspended
                                    ? "#ef4444"
                                    : "#4DB6AC",
                              }}
                            >
                              {creditLeft}
                            </span>
                            <span className="pb-0.5 text-[12px] text-gray-600">
                              Kredit Hari Tersisa
                            </span>
                          </div>

                          {totalCredits > 0 && (
                            <div className="mt-3">
                              <div className="mb-1 flex items-center justify-between text-[11px] text-gray-500">
                                <span>
                                  {creditPaid}/{totalCredits} hari terbayar
                                </span>
                                <span className="font-semibold tabular-nums text-gray-800">
                                  {progressPct}%
                                </span>
                              </div>
                              <div
                                className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
                                role="progressbar"
                                aria-valuenow={progressPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Progres cicilan"
                              >
                                <div
                                  className={`h-full rounded-full transition-[width]`}
                                  style={{
                                    width: `${progressPct}%`,
                                    backgroundColor:
                                      isSuspended || isOverdue
                                        ? "#f87171"
                                        : status === 5
                                          ? "#fbbf24"
                                          : "#4DB6AC",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-1 text-[11px]">
                          {nextPay && (
                            <div className="flex flex-wrap items-baseline gap-x-1.5">
                              {isSuspended ? (
                                <span style={{ color: "#dc2626" }}>
                                  Lunasi tagihan terlebih dahulu
                                  {dataRTO?.OverdueCount > 0 && (
                                    <span className="font-semibold">
                                      {" "}
                                      ({dataRTO.OverdueCount} hari di-suspend)
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <>
                                  <span className="text-gray-500">
                                    Bayar selanjutnya:
                                  </span>
                                  <span
                                    className={`font-semibold ${isOverdue ? "text-red-600" : "text-gray-900"}`}
                                  >
                                    {moments(nextPay).format(
                                      "ddd, DD MMM HH:mm",
                                    )}{" "}
                                    WIB
                                  </span>
                                </>
                              )}
                            </div>
                          )}
                          {targetFinish && (
                            <div className="flex flex-wrap items-baseline gap-x-1.5 text-gray-600">
                              <span className="text-gray-500">
                                Estimasi selesai:
                              </span>
                              <span className="font-semibold text-gray-900">
                                {moments(targetFinish).format("DD MMM YYYY")}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="shrink-0 text-xs font-bold text-[#4DB6AC]">
                          Detail →
                        </span>
                      </div>
                    </button>
                  );
                })()}
              </>
            ) : null}

            {/* RTO PROGRAMS */}
            <div className="px-0.5">
              <span className="text-[15px] font-medium text-blackBold">
                {isAuthenticated
                  ? "Lihat RTO program lainnya"
                  : "Program RTO yang ada"}
              </span>
            </div>

            {paginatedPrograms.map((op) => {
              const dKm = currentLocation?.length
                ? nearestBranchDistanceKm(
                    op,
                    currentLocation[0],
                    currentLocation[1],
                  )
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
                  className="mb-3 w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all active:scale-[0.99] hover:border-[#4DB6AC]/25 hover:shadow-md"
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#e0f2f1] flex items-center justify-center text-[#4DB6AC] font-bold text-xl shrink-0">
                      {op.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-[14px] leading-tight">
                            {op.programName}
                          </h3>
                          <p className="text-[12px] text-gray-500 mt-0.5">
                            {op.area}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[11px] font-semibold text-[#4DB6AC]">
                            {distLabel}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {dKm != null
                              ? nCabang > 1
                                ? `Cabang terdekat · ${nCabang} lokasi`
                                : "Dari lokasi kamu"
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {op.bikes.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700"
                          >
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
                          Min. gaji{" "}
                          <span className="font-semibold text-gray-900">
                            Rp{rupiah(op.minSalary)}
                          </span>
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
          </div>
        )}

        {/* ===== RENT TAB ===== */}
        {activeTab === "rent" && (
          <div
            id="home-tabpanel-rent"
            role="tabpanel"
            aria-labelledby="home-tab-rent"
            className="space-y-4"
          >
            {/* SECTION HEADER */}
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-blackBold">
                Sewa motor listrik
              </span>
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
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
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
                    <p className="text-sm font-semibold text-blackBold">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[#E67E00] text-xs">★</span>
                      <span className="text-xs font-semibold text-blackBold">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-black70 mt-1">{item.specs}</p>
                  <Separator />
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold text-[#4DB6AC]">
                      Rp {rupiah(item.price)}
                      <span className="text-black70 font-normal text-xs">
                        /hari
                      </span>
                    </p>
                    <button className="bg-[#4DB6AC] text-white text-xs font-semibold px-3.5 py-2 rounded-full">
                      Sewa →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
