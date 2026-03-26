import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { ILNoImage } from "../../assets";
import { openGoogleMapsSearch, rupiah } from "../../helpers";
import {
  branchesSortedByDistance,
  defaultBikePhoto,
  defaultDealershipPhotos,
  defaultProgramBanner,
  formatRtoDistanceKm,
  getBikeGallery,
  getOperatorById,
  getOperatorMockReviews,
  getOperatorOpeningDisplay,
  RTO_ESTIMATE_DISTANCE_ORIGIN,
} from "../../data/rtoProgramExplore";
import { rtoBikePath, rtoProgramExplorePath } from "../../constants/rtoRoutes";
import { rtoCard, rtoCardSubtle, rtoSectionTitle } from "./rtoUi";
import { useRTOExploreUserPosition } from "../../hooks/useRTOExploreUserPosition";
import NotFound from "../NotFound";

export default function RTOOperatorDetail() {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  const op = operatorId ? getOperatorById(operatorId) : undefined;
  const { lat, lng, hasPosition } = useRTOExploreUserPosition();

  /** Jarak dari GPS user, atau perkiraan dari pusat Jakarta */
  const refLat =
    hasPosition && lat != null && lng != null ? lat : RTO_ESTIMATE_DISTANCE_ORIGIN.lat;
  const refLng =
    hasPosition && lat != null && lng != null ? lng : RTO_ESTIMATE_DISTANCE_ORIGIN.lng;

  const displayBranches = useMemo(
    () => (op ? branchesSortedByDistance(op, refLat, refLng) : []),
    [op, refLat, refLng],
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const waShareProgramLink = useMemo(() => {
    if (!op) return "#";
    const openingShare = getOperatorOpeningDisplay(op);
    const effId = selectedBranchId ?? displayBranches[0]?.id ?? "";
    const br =
      displayBranches.find((b) => b.id === effId) ?? displayBranches[0];
    const phone = br?.phone ?? op.phone;
    const addr = br?.address ?? op.address;
    const branchLabel = br?.label ?? "Cabang utama";
    const bikeLines = op.bikes
      .slice(0, 8)
      .map((b) => `• ${b.name} — Rp ${rupiah(b.pricePerDay)}/hari`)
      .join("\n");
    const hoursLine =
      displayBranches.length > 1 && br?.scheduleLines?.length
        ? `⏰ ${br.scheduleLines.join("\n")}`
        : `⏰ ${openingShare.openDaysLabel} · ${openingShare.timeRange}`;
    const text =
      `Cek program RTO *${op.programName}*\n` +
      `${op.name} · ${op.area}\n\n` +
      `📍 ${branchLabel}\n${addr}\n` +
      `📞 ${phone}\n\n` +
      `💼 Min. gaji: Rp ${rupiah(op.minSalary)}\n\n` +
      `🛵 Motor:\n${bikeLines}\n\n` +
      `${hoursLine}\n\n` +
      `Info & ajukan di app CASAN — Rent to Own.`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [op, displayBranches, selectedBranchId]);

  if (!op) return <NotFound />;

  const effectiveBranchId = selectedBranchId ?? displayBranches[0]?.id ?? "";
  const activeEntry =
    displayBranches.find((b) => b.id === effectiveBranchId) ?? displayBranches[0];
  const activeBranch = activeEntry;
  const branchPhone = activeBranch?.phone ?? op.phone;
  const waLink = `https://wa.me/${branchPhone.replace(/\D/g, "")}`;
  const bannerSrc = op.programBanner ?? defaultProgramBanner(op.id);
  const dealerPhotos = op.dealershipPhotos?.length
    ? op.dealershipPhotos
    : defaultDealershipPhotos(op.id);
  const mapsQuery = `${op.name} ${activeBranch?.label ?? ""}, ${activeBranch?.address ?? op.address}`;
  const opening = getOperatorOpeningDisplay(op);
  const mockReviews = getOperatorMockReviews(op);

  return (
    <div className="background-2 min-h-svh overflow-y-auto overflow-x-hidden pb-28 text-gray-900 antialiased">
      {/* Hero banner + back */}
      <div className="relative w-full">
        <div className="h-[200px] w-full overflow-hidden">
          <img
            src={bannerSrc}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = ILNoImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25" />
        </div>
        <button
          type="button"
          onClick={() => navigate(rtoProgramExplorePath())}
          className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/95 shadow-md flex items-center justify-center text-gray-800 text-xl font-medium active:scale-95 transition-transform z-20"
          aria-label="Kembali"
        >
          ‹
        </button>
        <a
          href={waShareProgramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-xl bg-white/95 shadow-md text-[#25D366] font-bold text-xs active:scale-95 transition-transform max-w-[46%]"
          aria-label="Bagikan program via WhatsApp"
        >
          <FaWhatsapp size={22} className="shrink-0" />
          <span className="leading-tight hidden min-[360px]:inline">Bagikan</span>
        </a>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pr-24 sm:pr-28">
          <span className="inline-block px-2.5 py-1 rounded-lg bg-[#4DB6AC] text-white text-[11px] font-bold tracking-wide mb-1.5">
            PROGRAM RTO
          </span>
          <h1 className="text-white font-bold text-[22px] leading-tight drop-shadow-sm">
            {op.programName}
          </h1>
          <p className="text-white/90 text-sm mt-0.5">
            {op.name} · {op.area}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg -mt-3 space-y-5 px-4">
        {/* Lokasi program: pill per cabang + jarak, lalu Maps */}
        <div className={`${rtoCard} p-4`}>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4DB6AC]">
            Lokasi program
          </p>
          <p className="mb-3 text-[11px] leading-snug text-gray-500">
            {hasPosition
              ? "Pilih cabang — urutan terdekat dari lokasi kamu"
              : "Jarak perkiraan dari titik pusat Jakarta — izinkan lokasi untuk jarak akurat"}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {displayBranches.map((b) => {
              const sel = effectiveBranchId === b.id;
              const kmOk = Number.isFinite(b.distanceKm);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`inline-flex flex-col items-start px-3 py-2 rounded-xl border text-left transition-colors min-w-0 max-w-[48%] sm:max-w-none ${
                    sel
                      ? "bg-[#4DB6AC] border-[#4DB6AC] text-white ring-2 ring-[#4DB6AC]/30"
                      : "bg-gray-50 border-gray-200 text-gray-800 active:bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-[12px] font-bold leading-tight line-clamp-2 ${
                      sel ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {b.label}
                  </span>
                  <span
                    className={`text-[11px] font-extrabold mt-1 ${
                      sel ? "text-white" : "text-[#4DB6AC]"
                    }`}
                  >
                    {kmOk ? `${formatRtoDistanceKm(b.distanceKm)} km` : "—"}
                  </span>
                  {!hasPosition && (
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wide mt-0.5 ${
                        sel ? "text-white/80" : "text-amber-700"
                      }`}
                    >
                      perkiraan
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => openGoogleMapsSearch(mapsQuery)}
            className="w-full flex items-center justify-between gap-3 pt-3 border-t border-gray-100 active:opacity-90 transition-opacity text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f3] text-xl">
                🗺️
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayBranches.length > 1 ? activeBranch?.label : op.name}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                  {activeBranch?.address ?? op.address}
                </p>
                {activeEntry && Number.isFinite(activeEntry.distanceKm) && (
                  <p className="text-xs font-bold text-[#4DB6AC] mt-1">
                    {formatRtoDistanceKm(activeEntry.distanceKm)} km
                    {hasPosition ? " dari kamu" : " (perkiraan)"}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[#4DB6AC] text-sm font-bold shrink-0 whitespace-nowrap">
              Maps →
            </span>
          </button>
        </div>

        {/* Summary card */}
        <div className={`${rtoCard} p-4`}>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5f3] to-[#d4ebe8] text-xl font-bold text-[#2d8a7d] ring-2 ring-[#4DB6AC]/10">
              {op.initial}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-gray-900 tracking-tight">{op.name}</h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-sm text-gray-500">
                <span className="text-amber-500 font-semibold">★ {op.rating}</span>
                <span className="text-gray-300">·</span>
                <button
                  type="button"
                  onClick={() => setReviewsOpen(true)}
                  className="text-[#4DB6AC] font-semibold underline-offset-2 hover:underline"
                >
                  {op.reviewCount} ulasan
                </button>
                <span className="text-gray-300">·</span>
                <span>
                  {activeEntry && Number.isFinite(activeEntry.distanceKm)
                    ? `${formatRtoDistanceKm(activeEntry.distanceKm)} km${
                        hasPosition ? " dari kamu" : " (perkiraan)"
                      }`
                    : `${op.distanceKm} km`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {displayBranches.length > 1 && activeBranch ? (
              <>
                <div className="flex gap-3 text-[13px] text-gray-700">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    📅
                  </span>
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-gray-900 text-xs text-[#4DB6AC]">
                      Jam buka — {activeBranch.label}
                    </p>
                    {activeBranch.scheduleLines.map((line, i) => (
                      <p key={i} className="text-gray-700">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3 text-[13px] text-gray-700 items-start">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    📅
                  </span>
                  <div>
                    <span className="font-medium">{opening.openDaysLabel}</span>
                    {opening.closedDays?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {opening.closedDays.map((d) => (
                          <span
                            key={d}
                            className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-100"
                          >
                            {d} libur
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-3 text-[13px] text-gray-700">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    🕐
                  </span>
                  <span>{opening.timeRange}</span>
                </div>
              </>
            )}
            <div className="flex gap-3 text-[13px] text-gray-700">
              <span className="w-8 h-8 rounded-lg bg-[#e0f2f1] text-[#4DB6AC] flex items-center justify-center shrink-0">
                📞
              </span>
              <span className="font-medium">{branchPhone}</span>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <a
              href={`tel:${branchPhone}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 py-3.5 text-sm font-semibold text-gray-800 transition-colors active:bg-gray-100"
            >
              Telepon
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-semibold text-white shadow-md shadow-[#4DB6AC]/20 transition-opacity active:opacity-95"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Dealership photos */}
        <div>
          <h3 className={`${rtoSectionTitle} px-0.5`}>Foto dealer</h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
            {dealerPhotos.map((src, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[140px] h-[100px] rounded-xl overflow-hidden bg-gray-200 shadow-sm border border-gray-100"
              >
                <img
                  src={src}
                  alt={`Dealer ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ILNoImage;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Motor list */}
        <div>
          <h3 className="mb-3 px-0.5 text-base font-bold tracking-tight text-gray-900">
            Motor program{" "}
            <span className="text-sm font-normal text-gray-400">({op.bikes.length})</span>
          </h3>
          <div className="space-y-3">
            {op.bikes.map((bike) => {
              const thumb = bike.photoUrl ?? defaultBikePhoto(bike.id);
              const angles = getBikeGallery(bike);
              const payDays = bike.totalPaymentDays;
              return (
                <button
                  key={bike.id}
                  type="button"
                  onClick={() => navigate(rtoBikePath(bike.id))}
                  className={`${rtoCardSubtle} w-full overflow-hidden text-left transition-all hover:border-[#4DB6AC]/25 hover:shadow-md active:scale-[0.995]`}
                >
                  <div className="flex gap-0">
                    <div className="relative w-[100px] shrink-0 bg-gradient-to-br from-[#e8f5f4] to-[#d8ede9] sm:w-[108px]">
                      <img
                        src={thumb}
                        alt={bike.name}
                        className="w-full h-full min-h-[120px] object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ILNoImage;
                        }}
                      />
                      {bike.tag && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                          {bike.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-3.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-[15px] font-bold leading-tight text-gray-900">
                            {bike.name}{" "}
                            <span className="text-sm font-medium text-gray-400">{bike.year}</span>
                          </h4>
                          <p className="mt-1 text-[11px] font-medium tracking-wide text-gray-500">
                            {bike.specLine}
                          </p>
                        </div>
                        <span className="shrink-0 text-lg text-gray-300">›</span>
                      </div>
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                        Sudut tampilan
                      </p>
                      <div className="mt-1 flex gap-1.5">
                        {angles.slice(0, 4).map((ang, idx) => (
                          <div
                            key={idx}
                            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-gray-100"
                          >
                            <img
                              src={ang.src}
                              alt={ang.label}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = ILNoImage;
                              }}
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-black/55 text-[7px] text-white text-center py-0.5 truncate px-0.5">
                              {ang.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex items-end justify-between border-t border-gray-100/80 pt-2.5">
                        <div className="min-w-0">
                          <p className="text-[10px] font-medium text-gray-500">Harian</p>
                          <p className="mt-0.5 flex flex-wrap items-end gap-x-1.5 gap-y-0.5">
                            <span className="text-base font-extrabold text-[#4DB6AC] tabular-nums leading-tight shrink-0">
                              Rp {rupiah(bike.pricePerDay)}
                            </span>
                            <span className="flex items-baseline gap-x-1 pb-px text-[11px]">
                              <span className="font-normal text-gray-500">untuk</span>
                              <span className="font-semibold text-gray-900 tabular-nums text-xs">
                                {payDays} hari
                              </span>
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-medium text-gray-500">Min. gaji</p>
                          <p className="mt-0.5 text-base font-extrabold text-gray-900 tabular-nums leading-tight">
                            Rp {rupiah(bike.minPayment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ulasan modal */}
      {reviewsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ulasan-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Tutup"
            onClick={() => setReviewsOpen(false)}
          />
          <div className="relative w-full max-w-md max-h-[85vh] sm:rounded-2xl rounded-t-2xl bg-white shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h2 id="ulasan-title" className="font-bold text-lg text-gray-900">
                Ulasan ({mockReviews.length})
              </h2>
              <button
                type="button"
                onClick={() => setReviewsOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              {mockReviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/80 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                    <span className="text-amber-500 text-sm font-semibold">
                      {"★".repeat(r.rating)}
                      <span className="text-gray-300 font-normal">
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{r.date}</p>
                  <p className="text-[13px] text-gray-700 mt-2 leading-relaxed">{r.text}</p>
                </div>
              ))}
              <p className="text-center text-[11px] text-gray-400 pb-2">
                Data contoh — nanti dari API
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
