import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  estimateRtoFinishExcludingWeekends,
  formatRtoEstimatedFinishId,
  openGoogleMapsSearch,
  rupiah,
} from "../../helpers";
import { rtoOperatorPath } from "../../constants/rtoRoutes";
import { getBikeById, getBikeGallery } from "../../data/rtoProgramExplore";
import { usePaymentScheduleStartDate } from "../../hooks/usePaymentScheduleStartDate";
import { rtoCard, rtoCardSubtle, rtoSectionTitle } from "./rtoUi";
import { Api } from "../../services";
import NotFound from "../NotFound";

function getChargingSupport(operatorName: string, bikeName: string) {
  const text = `${operatorName} ${bikeName}`.toLowerCase();

  if (text.includes("united")) {
    return { brandName: "United", filterValues: [2] };
  }

  if (text.includes("maka")) {
    return { brandName: "Maka Motors", filterValues: [3] };
  }

  if (text.includes("tangkas")) {
    return { brandName: "Tangkas", filterValues: [4] };
  }

  return { brandName: "Casan", filterValues: [1] };
}

function BikeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br from-[#e9f7f5] to-[#d7efeb] flex items-center justify-center ${className ?? ""}`}
      >
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <path
                d="M10 26c0-1 1-2 2-2h3l2.5-8h5l1.5 4h4c1.5 0 2.5 1 2.5 2.5"
                stroke="#4DB6AC"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="11.5" cy="28" r="3" fill="#4DB6AC" />
              <circle cx="11.5" cy="28" r="1.2" fill="#fff" />
              <circle cx="28.5" cy="28" r="3" fill="#4DB6AC" />
              <circle cx="28.5" cy="28" r="1.2" fill="#fff" />
              <path d="M16.5 22.5h7" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-[#4DB6AC]">Placeholder motor</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function RTOMotorbikeProgram() {
  const { bikeId } = useParams<{ bikeId: string }>();
  const navigate = useNavigate();
  const estimateStart = usePaymentScheduleStartDate();
  const found = bikeId ? getBikeById(bikeId) : undefined;
  const [activeAngle, setActiveAngle] = useState(0);
  const [stationCount, setStationCount] = useState<number | null>(null);
  const [loadingStationCount, setLoadingStationCount] = useState(false);

  if (!found) return <NotFound />;

  const { operator: op, bike } = found;
  const gallery = getBikeGallery(bike);
  const mainSrc = gallery[activeAngle]?.src ?? gallery[0].src;
  const mainLabel = gallery[activeAngle]?.label ?? gallery[0].label;
  const chargingSupport = getChargingSupport(op.name, bike.name);
  const chargingFilterParam = JSON.stringify(chargingSupport.filterValues);
  const chargingFilterUrl = `/home/location?filter=${encodeURIComponent(chargingFilterParam)}`;

  const paymentDays = bike.totalPaymentDays;
  const estimatedFinish = estimateRtoFinishExcludingWeekends(paymentDays, estimateStart);
  const estimatedFinishLabel = formatRtoEstimatedFinishId(estimatedFinish);

  const wattNum = bike.watt.replace(/[^\d.]/g, "");
  const batteryNum = bike.batteryWh.replace(/[^\d.]/g, "");
  const rangeNum = bike.rangeKm.replace(/[^\d]/g, "");

  const shareText = encodeURIComponent(
    `Cek program RTO "${op.programName}" di ${op.name}!\n\n` +
      `🛵 ${bike.name} (${bike.year})\n` +
      `💰 Rp ${rupiah(bike.pricePerDay)}/hari\n` +
      `⚡ ${bike.watt} · ${bike.rangeKm} range\n` +
      `📍 ${op.area}\n\n` +
      `Benefit: ${op.benefits.join(", ")}\n\n` +
      `Ajukan sekarang di app CASAN!`,
  );
  const waShareLink = `https://wa.me/?text=${shareText}`;

  useEffect(() => {
    let active = true;

    const fetchStationCount = async () => {
      try {
        setLoadingStationCount(true);
        const res = await Api.get({
          url: "stations",
          params: {
            page: 1,
            limit: 100,
            is_admin: false,
            brands: chargingFilterParam,
          },
        });

        const rawData = Array.isArray(res?.data) ? res.data : [];
        const visibleStations = rawData.filter(
          (item: ChargingStation) => item?.IsVisibleToUser && item?.Devices?.length,
        );

        if (active) setStationCount(visibleStations.length);
      } catch (error) {
        if (active) setStationCount(null);
      } finally {
        if (active) setLoadingStationCount(false);
      }
    };

    fetchStationCount();

    return () => {
      active = false;
    };
  }, [chargingFilterParam]);

  return (
    <div className="background-2 min-h-svh overflow-y-auto overflow-x-hidden pb-40 text-gray-900 antialiased">
      <header className="bg-gradient-to-br from-[#4DB6AC] via-[#45a89e] to-[#3a9a90] px-4 pt-10 pb-8 rounded-b-[28px] shadow-lg shadow-[#4DB6AC]/15">
        <div className="max-w-lg mx-auto w-full">
          <button
            type="button"
            onClick={() => navigate(rtoOperatorPath(op.id))}
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30 active:scale-95"
            aria-label="Kembali ke dealer"
          >
            ‹
          </button>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">Program RTO</p>
          <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-white">
            {bike.name}
          </h1>
          <p className="mt-1.5 text-sm text-white/85 leading-snug">
            {op.name}
            <span className="text-white/50"> · </span>
            {op.programName}
          </p>
          <button
            type="button"
            onClick={() => openGoogleMapsSearch(`${op.name}, ${op.address}`)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/18 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/28"
          >
            <span className="text-base leading-none" aria-hidden>
              📍
            </span>
            Lokasi dealer
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-lg -mt-5 space-y-5 px-4 pb-6">
        <div className={`${rtoCard} overflow-hidden`}>
          <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-50">
            <BikeImage src={mainSrc} alt={mainLabel} className="h-full w-full object-cover" />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900/75 px-3.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {mainLabel}
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto p-3">
            {gallery.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveAngle(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  activeAngle === i
                    ? "border-[#4DB6AC] ring-2 ring-[#4DB6AC]/25 shadow-sm"
                    : "border-gray-100 opacity-90 hover:opacity-100"
                }`}
              >
                <BikeImage src={item.src} alt={item.label} className="h-full w-full object-cover" />
              </button>
            ))}
            <div className="ml-1 flex items-center gap-2 border-l border-gray-100 pl-3">
              <div
                className="h-5 w-5 rounded-full border-2 border-gray-200 bg-[#37474F]"
                title="Hitam"
              />
              <div
                className="h-5 w-5 rounded-full border-2 border-gray-100 bg-[#e57373]"
                title="Merah"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className={`${rtoCardSubtle} border-gray-100/80 bg-gradient-to-br from-white to-[#f7fcfb] p-4`}
          >
            <p className="text-[11px] font-medium text-gray-500 tracking-wide">Harian</p>
            <p className="mt-2 flex flex-wrap items-end gap-x-2 gap-y-1">
              <span className="text-2xl font-extrabold text-[#4DB6AC] tabular-nums leading-tight tracking-tight">
                Rp {rupiah(bike.pricePerDay)}
              </span>
              <span className="flex items-baseline gap-x-1.5 pb-0.5 text-sm">
                <span className="font-normal text-gray-500">untuk</span>
                <span className="font-semibold text-gray-900 tabular-nums text-[15px]">
                  {paymentDays} hari
                </span>
              </span>
            </p>
            <p className="text-[10px] text-gray-400 mt-2.5 leading-relaxed">
              Sabtu–Minggu &amp; libur tidak dihitung
            </p>
          </div>
          <div
            className={`${rtoCardSubtle} border-[#4DB6AC]/18 bg-gradient-to-br from-[#f4fbfa] to-white p-4 ring-1 ring-[#4DB6AC]/10`}
          >
            <p className="text-[11px] font-medium text-gray-500 tracking-wide">Min. gaji</p>
            <p className="mt-2 text-2xl font-extrabold text-gray-900 tabular-nums leading-tight">
              Rp {rupiah(bike.minPayment)}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">Semua profesi</p>
          </div>
        </div>

        <section>
          <h3 className={rtoSectionTitle}>Tenaga &amp; performa</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { n: wattNum, u: "W", l: "Motor" },
              { n: batteryNum, u: "Wh", l: "Baterai" },
              { n: rangeNum, u: "km", l: "Jarak" },
            ].map((x) => (
              <div
                key={x.l}
                className="rounded-2xl border border-gray-100/90 bg-gradient-to-b from-white to-gray-50/80 px-2 py-3.5 text-center shadow-sm"
              >
                <p className="text-2xl font-extrabold tabular-nums tracking-tight text-gray-900">
                  {x.n}
                </p>
                <p className="text-xs font-bold text-[#4DB6AC]">{x.u}</p>
                <p className="mt-0.5 text-[10px] font-medium text-gray-400">{x.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={rtoSectionTitle}>Spesifikasi</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Volt", value: bike.volt },
              { label: "Amp", value: bike.amp },
              { label: "Speed", value: bike.speed },
              { label: "Berat", value: bike.weight },
              { label: "Ban", value: bike.tire },
              { label: "Charge", value: bike.chargeTime },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-sm"
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  {s.label}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={rtoSectionTitle}>Charging</h3>
          <div className={`${rtoCard} divide-y divide-gray-100 overflow-hidden p-0`}>
            <div className="flex items-center gap-3 p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-lg"
                aria-hidden
              >
                🏠
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">Home — 10A · ~5 jam</p>
                <p className="text-xs text-gray-500">Charger 10A gratis</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#e5f6f3] to-[#cfece8] flex items-center justify-center shrink-0 border border-[#4DB6AC]/15">
                  <div className="relative">
                    <div className="w-10 h-12 rounded-lg bg-white shadow-sm border border-[#d7efeb] flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                        <rect x="8" y="6" width="10" height="16" rx="3" fill="#4DB6AC" opacity="0.18" />
                        <path d="M11 9h4v6h-4z" fill="#4DB6AC" />
                        <path d="M19 11l4-4" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
                        <path d="M21 13l4-4" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
                        <path d="M18 19l-4 6h3l-1 4 5-7h-3l0-3z" fill="#F5A623" />
                      </svg>
                    </div>
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#4DB6AC] bg-white px-1.5 py-0.5 rounded-full border border-[#d7efeb]">
                      SPKL
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-gray-900">Fast — 30A · 45min</p>
                  <p className="text-xs text-gray-500">
                    30–40A SPKL {chargingSupport.brandName} compatible
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(chargingFilterUrl)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#4DB6AC]"
                  >
                    {loadingStationCount
                      ? "Cek stasiun terdekat…"
                      : `Lihat ${stationCount ?? 0} stasiun ${chargingSupport.brandName} →`}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[11px]">
                <span className="leading-snug text-gray-500">
                  Stasiun terdekat (filter brand cocok)
                </span>
                <span className="shrink-0 rounded-full bg-[#e8f5f3] px-2.5 py-1 text-xs font-bold text-[#2d8a7d]">
                  {loadingStationCount ? "…" : `${stationCount ?? 0}`}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className={rtoSectionTitle}>Jadwal bayar</h3>
          <div className="space-y-2.5">
            <div className={`${rtoCard} flex items-center justify-between gap-3 p-4`}>
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f3] text-lg"
                  aria-hidden
                >
                  📅
                </span>
                <p className="text-sm font-bold leading-snug text-gray-900">
                  Sen–Sab
                  <span className="block text-xs font-semibold text-gray-500">
                    Rp {rupiah(bike.pricePerDay)}/hari
                  </span>
                </p>
              </div>
              <div className="max-w-[50%] shrink-0 pl-1 text-right">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  Estimasi selesai
                </p>
                <p className="mt-1 text-[11px] font-bold leading-tight text-[#4DB6AC]">
                  {estimatedFinishLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#4DB6AC]/15 bg-[#f0faf8] px-4 py-3.5">
              <span className="text-lg" aria-hidden>
                ✨
              </span>
              <p className="text-sm font-semibold text-gray-800">Minggu &amp; hari libur — GRATIS</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className={rtoSectionTitle}>Benefit program</h3>
          <div className="space-y-2">
            {op.benefits.map((b) => (
              <div
                key={b}
                className={`${rtoCardSubtle} flex items-center justify-between gap-3 border-gray-100 p-3.5`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4DB6AC]/12 text-sm font-bold text-[#2d8a7d]">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-gray-800">{b}</span>
                </div>
                <span className="shrink-0 rounded-full bg-[#4DB6AC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Free
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 flex justify-center">
        <div className="pointer-events-auto w-full max-w-lg border-t border-gray-200/90 bg-white/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md safe-area-pb rounded-t-2xl">
          <div className="mx-auto flex max-w-lg gap-3">
            <a
              href={waShareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#4DB6AC]/40 text-[#4DB6AC] transition-colors hover:bg-[#4DB6AC]/5"
              aria-label="Bagikan WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.212L4 20l1.212-3.757A8 8 0 1112 20z" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => navigate("/select-rent-buy")}
              className="min-h-12 flex-1 rounded-2xl bg-[#4DB6AC] text-base font-bold text-white shadow-lg shadow-[#4DB6AC]/30 transition-transform active:scale-[0.99] hover:bg-[#45a89e]"
            >
              Ajukan program ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
