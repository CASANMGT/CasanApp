import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import type { Application, ScoreBreakdown } from "../../types/rtoApplication";
import {
  updateApplicationStatus,
  resumeApplicationEdit,
} from "../../features/rto/rtoApplicationSlice";
import { openGoogleMapsSearch, openWhatsApp } from "../../helpers/linking";
import {
  getPickupDocumentsShortSummary,
  getPickupDocumentReminders,
} from "../../helpers/rtoPickupReminderDocs";
import { rtoBikePath } from "../../constants/rtoRoutes";
import {
  getBikeById,
  getOperatorById,
  defaultDealershipPhotos,
  getBranchLatLng,
  type RTOExploreOperator,
} from "../../data/rtoProgramExplore";
import type { PickupBooking } from "../../types/rtoApplication";
import { CUSTOMER_SERVICES } from "../../common";
import { rtoCard, rtoCardSubtle, rtoSectionTitle } from "../RTOProgramExplore/rtoUi";

const STATUS_STEPS = [
  { label: "Terkirim", key: "submitted", hint: "Data masuk ke dealer" },
  { label: "Direview", key: "under_review", hint: "Tim menilai kelayakan" },
  { label: "Keputusan", key: "decided", hint: "Disetujui, ditolak, atau perlu dokumen" },
  { label: "Ambil motor", key: "pickup", hint: "Jadwal & pengambilan" },
] as const;

const DOC_LABELS: Record<string, string> = {
  ktp: "KTP",
  selfie_ktp: "Selfie + KTP",
  sim: "SIM C",
  kk: "Kartu Keluarga",
  slip_gaji: "Slip gaji / bukti pendapatan",
  slik: "Hasil SLIK OJK",
  ktp_penjamin: "KTP penjamin",
  slip_gaji_penjamin: "Slip gaji / bukti penghasilan penjamin",
};

const SCORE_ROWS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "identity", label: "Identitas & alamat", max: 18 },
  { key: "income", label: "Pendapatan", max: 22 },
  { key: "employment", label: "Pekerjaan", max: 15 },
  { key: "family", label: "Keluarga & penjamin", max: 12 },
  { key: "credit", label: "Riwayat kredit", max: 18 },
  { key: "documents", label: "Dokumen", max: 15 },
];

function getActiveIndex(status: string): number {
  switch (status) {
    case "submitted":
      return 0;
    case "under_review":
      return 1;
    case "need_documents":
    case "approved":
    case "rejected":
      return 2;
    case "pickup_scheduled":
      return 3;
    case "pickup_done":
      return 4;
    default:
      return 0;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

/** Keputusan kredit / pengajuan — bukan status operasional (jadwal, pickup). */
function getCreditDecisionLabel(status: Application["status"]): string {
  switch (status) {
    case "approved":
    case "pickup_scheduled":
    case "pickup_done":
      return "Disetujui";
    case "rejected":
      return "Belum disetujui";
    case "need_documents":
      return "Perlu melengkapi dokumen";
    case "submitted":
    case "under_review":
      return "Menunggu keputusan";
    default:
      return "";
  }
}

function decisionHintForStatus(status: Application["status"]): string {
  switch (status) {
    case "submitted":
    case "under_review":
      return "Keputusan kredit mengikuti hasil review tim.";
    case "need_documents":
      return "Lengkapi dokumen yang diminta agar keputusan dapat diproses.";
    case "approved":
      return "Skor merangkum hasil verifikasi saat pengajuan disetujui.";
    case "pickup_scheduled":
      return "Skor dari verifikasi awal. Jadwal, lokasi dealer, dan checklist dokumen ada di bawah.";
    case "pickup_done":
      return "Ringkasan skor dari proses pengajuan Anda.";
    default:
      return "";
  }
}

/** Judul kartu ringkasan — hindari mengulang teks pill hero secara persis. */
function getStatusSummaryHeadline(status: Application["status"]): string {
  switch (status) {
    case "submitted":
      return "Aplikasi sudah masuk";
    case "under_review":
      return "Sedang ditinjau tim";
    case "need_documents":
      return "Perlu tindakan Anda";
    case "approved":
      return "Lanjut jadwal pengambilan";
    case "pickup_scheduled":
      return "Persiapan ke dealer";
    case "pickup_done":
      return "Proses pengambilan selesai";
    case "rejected":
      return "Pengajuan tidak dilanjutkan";
    default:
      return "";
  }
}

function resolvePickupLatLng(
  op: RTOExploreOperator | undefined,
  pickup: PickupBooking,
): [number, number] | null {
  if (!op) return null;
  const addr = pickup.dealerAddress.toLowerCase().trim();
  const branches = op.branches ?? [];
  for (const b of branches) {
    const slice = b.address.slice(0, Math.min(24, b.address.length)).toLowerCase();
    if (slice.length >= 8 && addr.includes(slice)) {
      const c = getBranchLatLng(b, op);
      if (c) return c;
    }
  }
  const first = branches[0];
  if (first) {
    const c = getBranchLatLng(first, op);
    if (c) return c;
  }
  if (typeof op.lat === "number" && typeof op.lng === "number") return [op.lat, op.lng];
  return null;
}

function staticMapThumbnailUrl(lat: number, lng: number): string {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=15&size=640x240&markers=${lat},${lng},red-pushpin`;
}

type StatusVisual = {
  text: string;
  pillClass: string;
  ringClass: string;
  heroGradient: string;
  /** Warna status: gradient halaman (bukan kartu). */
  pageBg: string;
  /** Kartu ringkasan: putih netral (sama semua status). */
  summaryCardClass: string;
  /** Aksen kecil pada ikon ringkasan saja. */
  glyphIconClass: string;
  scoreCardClass: string;
  embeddedScoreCardClass: string;
  timelineCardClass: string;
  pickupJadwalCardClass: string;
  pickupPrepCardClass: string;
};

/** Kartu konten seragam: putih, border abu — warna hanya dari pageBg + hero. */
const NEUTRAL_CARD_BORDER = "border border-gray-200/90";
const NEUTRAL_CARD_SHADOW = "shadow-sm shadow-black/[0.06]";
const neutralSummaryInset = `${NEUTRAL_CARD_BORDER} bg-white ${NEUTRAL_CARD_SHADOW}`;
const neutralScoreCard = `rounded-[22px] ${NEUTRAL_CARD_BORDER} bg-white p-5 ${NEUTRAL_CARD_SHADOW}`;
const neutralTimelineCard = `rounded-[22px] ${NEUTRAL_CARD_BORDER} bg-white p-5 ${NEUTRAL_CARD_SHADOW}`;
const neutralPickupJadwal = `rounded-[22px] ${NEUTRAL_CARD_BORDER} bg-white p-5 ${NEUTRAL_CARD_SHADOW}`;
const neutralPickupPrep = `rounded-[22px] ${NEUTRAL_CARD_BORDER} bg-white p-4 sm:p-5 ${NEUTRAL_CARD_SHADOW}`;
const neutralEmbeddedScore = `rounded-2xl ${NEUTRAL_CARD_BORDER} bg-white p-5 ${NEUTRAL_CARD_SHADOW}`;

/*
 * Color system — 4 semantic families:
 *   NEUTRAL (submitted, under_review)  → slate-blue-gray  #6b7c93-family
 *   ACTION  (need_documents)           → amber            #d97706-family
 *   POSITIVE (approved, pickup_sched, pickup_done) → green #16a34a-family
 *   NEGATIVE (rejected)                → rose             #e11d48-family
 *
 * Color shows in: hero gradient + page gradient background.
 * Cards stay white. Glyph tile has a tiny ring tint only.
 */

function getStatusVisual(status: string): StatusVisual {
  const cards = {
    summaryCardClass: neutralSummaryInset,
    scoreCardClass: neutralScoreCard,
    embeddedScoreCardClass: neutralEmbeddedScore,
    timelineCardClass: neutralTimelineCard,
    pickupJadwalCardClass: neutralPickupJadwal,
    pickupPrepCardClass: neutralPickupPrep,
  };

  switch (status) {
    case "submitted":
      return {
        text: "Aplikasi terkirim",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-[#94a3b8]/40 to-[#cbd5e1]/50",
        heroGradient: "from-[#64748b] via-[#5b6d82] to-[#475569]",
        pageBg: "bg-gradient-to-b from-[#e2e8f0] to-[#eef1f5]",
        glyphIconClass: "bg-gray-50 text-[#475569] shadow-sm ring-1 ring-slate-200",
        ...cards,
      };
    case "under_review":
      return {
        text: "Sedang direview",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-[#94a3b8]/50 to-[#cbd5e1]/40",
        heroGradient: "from-[#5b6d82] via-[#526275] to-[#475569]",
        pageBg: "bg-gradient-to-b from-[#dce4ed] to-[#eaeff4]",
        glyphIconClass: "bg-gray-50 text-[#475569] shadow-sm ring-1 ring-slate-200",
        ...cards,
      };
    case "need_documents":
      return {
        text: "Perlu dokumen",
        pillClass: "bg-amber-100/90 text-amber-800 border border-amber-300/70",
        ringClass: "from-amber-300/50 to-amber-100/60",
        heroGradient: "from-[#d97706] via-[#c2690a] to-[#b45309]",
        pageBg: "bg-gradient-to-b from-[#fef3c7] to-[#fef9ee]",
        glyphIconClass: "bg-gray-50 text-amber-600 shadow-sm ring-1 ring-amber-200/70",
        ...cards,
      };
    case "approved":
      return {
        text: "Disetujui",
        pillClass: "bg-green-100/90 text-green-800 border border-green-300/70",
        ringClass: "from-green-300/50 to-green-100/60",
        heroGradient: "from-[#16a34a] via-[#15803d] to-[#166534]",
        pageBg: "bg-gradient-to-b from-[#dcfce7] to-[#f0fdf4]",
        glyphIconClass: "bg-gray-50 text-green-600 shadow-sm ring-1 ring-green-200/70",
        ...cards,
      };
    case "rejected":
      return {
        text: "Belum disetujui",
        pillClass: "bg-rose-100/95 text-rose-800 border border-rose-300/70 shadow-sm",
        ringClass: "from-rose-300/55 to-rose-100/65",
        heroGradient: "from-[#e11d48] via-[#c81e3e] to-[#be123c]",
        pageBg: "bg-gradient-to-b from-[#ffe4e6] to-[#fff5f6]",
        glyphIconClass: "bg-gray-50 text-rose-600 shadow-sm ring-1 ring-rose-200/60",
        ...cards,
      };
    case "pickup_scheduled":
      return {
        text: "Pickup dijadwalkan",
        pillClass: "bg-green-100/85 text-green-800 border border-green-300/60",
        ringClass: "from-green-300/45 to-green-100/55",
        heroGradient: "from-[#22c55e] via-[#16a34a] to-[#15803d]",
        pageBg: "bg-gradient-to-b from-[#d1fae5] to-[#ecfdf5]",
        glyphIconClass: "bg-gray-50 text-green-600 shadow-sm ring-1 ring-green-200/65",
        ...cards,
      };
    case "pickup_done":
      return {
        text: "Selesai",
        pillClass: "bg-green-100/85 text-green-800 border border-green-300/70",
        ringClass: "from-green-300/50 to-green-100/60",
        heroGradient: "from-[#15803d] via-[#166534] to-[#14532d]",
        pageBg: "bg-gradient-to-b from-[#bbf7d0] to-[#ecfdf5]",
        glyphIconClass: "bg-gray-50 text-green-700 shadow-sm ring-1 ring-green-200/70",
        ...cards,
      };
    default:
      return {
        text: "Diproses",
        pillClass: "bg-white/15 text-white border border-white/20",
        ringClass: "from-gray-200 to-gray-100",
        heroGradient: "from-[#64748b] to-[#475569]",
        pageBg: "bg-gradient-to-b from-[#e2e8f0] to-[#f1f5f9]",
        glyphIconClass: "bg-gray-50 text-slate-600 shadow-sm ring-1 ring-slate-200",
        ...cards,
      };
  }
}

function statusSubtitle(status: string): string {
  switch (status) {
    case "submitted":
    case "under_review":
      return "Tim kami memeriksa kelengkapan dan kelayakan pengajuan Anda.";
    case "approved":
      return "Silakan jadwalkan pengambilan motor dan siapkan dokumen asli.";
    case "rejected":
      return "Anda bisa melihat program lain; pengajuan baru mengikuti kebijakan masa tunggu.";
    case "need_documents":
      return "Lengkapi dokumen yang diminta agar verifikasi bisa dilanjutkan.";
    case "pickup_scheduled":
      return "Datang sesuai jadwal; bawa identitas dan dokumen pendukung.";
    case "pickup_done":
      return "Terima kasih telah melengkapi proses pengambilan motor.";
    default:
      return "Pantau langkah berikutnya di bawah.";
  }
}

function StatusGlyph({ status }: { status: string }) {
  const common = "h-9 w-9 text-current";
  switch (status) {
    case "submitted":
    case "under_review":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" className="opacity-35" />
          <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "need_documents":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M8 4h6l4 4v12a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 4v4h4M10 13h6M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "approved":
    case "pickup_done":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.5 12.5l2.5 2.5 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "rejected":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 15l6-6M15 15L9 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "pickup_scheduled":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 3v4M16 3v4M4 11h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l2.2 7.2L22 12l-7.8 2.8L12 22l-2.2-7.2L2 12l7.8-2.8L12 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      );
  }
}

function useMockReviewLifecycle(app: Application | undefined, dispatch: AppDispatch) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!app) return;

    const clearAll = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    if (app.status === "submitted") {
      const t = setTimeout(() => {
        dispatch(updateApplicationStatus({ id: app.id, status: "under_review" }));
      }, 2000);
      timersRef.current.push(t);
      return clearAll;
    }

    if (app.status === "under_review") {
      const total = app.score.total;
      const delay = total >= 60 ? 3500 : total >= 41 ? 3000 : 2500;
      const t = setTimeout(() => {
        if (total >= 60) {
          dispatch(updateApplicationStatus({ id: app.id, status: "approved" }));
        } else if (total >= 41) {
          dispatch(
            updateApplicationStatus({
              id: app.id,
              status: "need_documents",
              reviewerNote:
                "Mohon unggah slip gaji bulan terakhir dan kartu keluarga yang lebih jelas untuk melengkapi verifikasi.",
              requestedDocIds: ["slip_gaji", "kk"],
            }),
          );
        } else {
          const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          dispatch(
            updateApplicationStatus({
              id: app.id,
              status: "rejected",
              rejectionReason:
                "Skor kelayakan di bawah ambang program. Coba tambah penghasilan tetap, penjamin, atau pilih program dengan syarat lebih ringan.",
              rejectionCooldownUntil: until,
            }),
          );
        }
      }, delay);
      timersRef.current.push(t);
      return clearAll;
    }

    return clearAll;
  }, [app?.id, app?.status, app?.score?.total, dispatch]);
}

function ScoreRing({ total }: { total: number }) {
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg className="-rotate-90 transform" viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#E8F0EF" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="#4DB6AC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${total} 100`}
          pathLength="100"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primaryDark">
        {total}
      </span>
    </div>
  );
}

function ScoreBreakdownPanel({
  score,
  decisionLabel,
  decisionHint,
  hideSectionTitle,
  embedded,
  cardClassName,
  embeddedCardClassName,
}: {
  score: ScoreBreakdown;
  decisionLabel?: string;
  decisionHint?: string;
  hideSectionTitle?: boolean;
  embedded?: boolean;
  /** Mengganti gaya kartu skor standalone (warna status). */
  cardClassName?: string;
  /** Mengganti gaya kartu skor di blok ditolak / tertanam. */
  embeddedCardClassName?: string;
}) {
  const showDecision = Boolean(decisionLabel);
  const cardClass = embedded
    ? embeddedCardClassName ?? "rounded-2xl border border-gray-100/90 bg-white/95 p-5 shadow-sm"
    : cardClassName
      ? `${cardClassName} overflow-hidden`
      : `${rtoCard} overflow-hidden p-5`;

  const inner = (
    <>
      <div
        className={
          showDecision
            ? "mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            : "mb-5 flex items-end justify-between gap-3"
        }
      >
        {showDecision ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Keputusan pengajuan</p>
              <p className="mt-1 text-lg font-bold leading-snug text-gray-900">{decisionLabel}</p>
              {decisionHint ? <p className="mt-1 text-xs leading-relaxed text-gray-500">{decisionHint}</p> : null}
            </div>
            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <div className="text-right sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Skor kelayakan</p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-gray-900">
                  {score.total}
                  <span className="text-base font-semibold text-gray-400">/100</span>
                </p>
              </div>
              <ScoreRing total={score.total} />
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Skor kelayakan</p>
              <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-gray-900">
                {score.total}
                <span className="text-base font-semibold text-gray-400">/100</span>
              </p>
            </div>
            <ScoreRing total={score.total} />
          </>
        )}
      </div>
      <div className="space-y-3">
        {SCORE_ROWS.map(({ key, label, max }) => {
          const v = score[key] as number;
          const pct = max > 0 ? Math.min(100, (v / max) * 100) : 0;
          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="font-medium text-gray-600">{label}</span>
                <span className="tabular-nums font-semibold text-gray-900">
                  {v}
                  <span className="font-normal text-gray-400">/{max}</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4DB6AC] to-primary70 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  if (embedded) {
    return <div className={cardClass}>{inner}</div>;
  }

  return (
    <section>
      {showDecision && !hideSectionTitle ? <h3 className={rtoSectionTitle}>Skor kelayakan</h3> : null}
      <div className={cardClass}>{inner}</div>
    </section>
  );
}

function PickupPrepSection({
  app,
  operator,
  programExplore,
  docCount,
  onOpenChecklist,
  surfaceClassName,
}: {
  app: Application;
  operator: RTOExploreOperator | undefined;
  programExplore: ReturnType<typeof getBikeById>;
  docCount: number;
  onOpenChecklist: () => void;
  surfaceClassName?: string;
}) {
  const pickup = app.pickup;
  const [photosOpen, setPhotosOpen] = useState(false);
  if (!pickup) return null;

  const photos = (() => {
    if (operator?.dealershipPhotos?.length) return operator.dealershipPhotos;
    const bikeUrl = programExplore?.bike.photoUrl;
    const extra = operator?.programBanner;
    if (bikeUrl) return extra ? [bikeUrl, extra] : [bikeUrl];
    return defaultDealershipPhotos(app.operatorId);
  })();

  const coords = resolvePickupLatLng(operator, pickup);
  const mapQuery = `${pickup.dealerName} ${pickup.dealerAddress}`.trim();
  const mapSrc = coords ? staticMapThumbnailUrl(coords[0], coords[1]) : null;

  return (
    <>
      <section className={surfaceClassName ?? `${rtoCard} p-4 sm:p-5`}>
        <h3 className={rtoSectionTitle}>Lokasi dealer</h3>

        <button
          type="button"
          onClick={() => openGoogleMapsSearch(mapQuery)}
          className="group mt-3 flex w-full gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-2.5 text-left shadow-sm transition-colors hover:border-[#4DB6AC]/35"
          aria-label="Buka lokasi di Google Maps"
        >
          <div className="relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100/80">
            {mapSrc ? (
              <img src={mapSrc} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-full items-center justify-center text-xl" aria-hidden>📍</div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="text-sm font-semibold leading-snug text-gray-900">{pickup.dealerName}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-gray-500">{pickup.dealerAddress}</p>
            <p className="mt-1.5 text-xs font-bold text-[#4DB6AC]">Arahkan di Maps →</p>
          </div>
        </button>

        <div className="mt-3 flex gap-2">
          {photos.length > 0 && (
            <button
              type="button"
              onClick={() => setPhotosOpen(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              Foto ({photos.length})
            </button>
          )}
          <button
            type="button"
            onClick={onOpenChecklist}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 py-2.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-50"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            Dokumen ({docCount})
          </button>
        </div>
      </section>

      {photosOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button type="button" className="absolute inset-0 bg-black/50" aria-label="Tutup" onClick={() => setPhotosOpen(false)} />
          <div className="relative z-10 max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Foto cabang</h2>
              <button
                type="button"
                onClick={() => setPhotosOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                aria-label="Tutup"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {photos.map((src, i) => (
                <div key={`${src}-${i}`} className="overflow-hidden rounded-2xl">
                  <img src={src} alt="" className="w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function RTOStatus() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { applications } = useSelector((s: RootState) => s.rtoApplication);

  const app = useMemo(() => {
    if (applicationId === "latest") {
      return applications[applications.length - 1];
    }
    return applications.find((a) => a.id === applicationId);
  }, [applications, applicationId]);

  useMockReviewLifecycle(app, dispatch);

  if (!app) {
    return (
      <div className="flex min-h-svh flex-col bg-gradient-to-b from-[#d9f2ef] via-[#f5f8f9] to-[#eef5f4]">
        <header className="bg-gradient-to-br from-[#4DB6AC] via-[#45a89e] to-[#3a9a90] px-4 pb-16 pt-10 text-center shadow-lg shadow-[#4DB6AC]/20 rounded-b-[28px]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-md">
            🔍
          </div>
          <h1 className="text-lg font-bold text-white">Aplikasi tidak ditemukan</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/85">ID: {applicationId}</p>
        </header>
        <div className="mx-auto -mt-10 w-full max-w-lg flex-1 px-4">
          <div className={`${rtoCard} p-6 text-center`}>
            <p className="text-sm text-gray-600">Periksa tautan atau ajukan program dari beranda.</p>
            <button
              type="button"
              onClick={() => navigate("/home/index")}
              className="mt-6 w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/30"
            >
              Kembali ke beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  const programExplore = useMemo(() => getBikeById(app.bikeId), [app.bikeId]);
  const operator = useMemo(() => getOperatorById(app.operatorId), [app.operatorId]);
  const pickupDocReminders = useMemo(() => getPickupDocumentReminders(app), [app]);
  const pickupDocCount = pickupDocReminders.length;

  /** Saat pickup terjadwal, dokumen sudah di kartu lokasi — hindari blok duplikat di program. */
  const pickupDocsShortLine = useMemo(() => {
    if (app.status !== "approved") return null;
    return getPickupDocumentsShortSummary(app);
  }, [app]);

  const activeIdx = getActiveIndex(app.status);
  const visual = getStatusVisual(app.status);
  const cooldownSeconds = app.rejectionCooldownUntil
    ? Math.max(0, Math.floor((new Date(app.rejectionCooldownUntil).getTime() - Date.now()) / 1000))
    : 0;

  const [pendingSupplementaryNames, setPendingSupplementaryNames] = useState<Record<string, string>>(
    {},
  );
  const [pickupChecklistOpen, setPickupChecklistOpen] = useState(false);

  useEffect(() => {
    setPendingSupplementaryNames({});
  }, [app.id]);

  const requestedDocIdsList = app.requestedDocIds ?? [];
  const allSupplementaryChosen =
    requestedDocIdsList.length > 0 &&
    requestedDocIdsList.every((docId) => Boolean(pendingSupplementaryNames[docId]?.trim()));

  const handleSupplementaryFileChange = (docId: string, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    setPendingSupplementaryNames((prev) => ({ ...prev, [docId]: file.name }));
  };

  const handleSubmitSupplementaryDocs = () => {
    if (!allSupplementaryChosen) return;
    const supplementarySubmissions = requestedDocIdsList.map((docId) => ({
      docId,
      fileName: pendingSupplementaryNames[docId],
      submittedAt: new Date().toISOString(),
    }));
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: "submitted",
        reviewerNote: undefined,
        requestedDocIds: null,
        supplementarySubmissions,
      }),
    );
  };

  const handleEditApplication = () => {
    dispatch(resumeApplicationEdit(app.id));
    navigate("/rto-apply", {
      state: {
        operatorId: app.operatorId,
        bikeId: app.bikeId,
        operatorName: app.operatorName,
        bikeName: app.bikeName,
        pricePerDay: app.pricePerDay,
        minSalary: app.minSalary ?? 0,
        __resume: true,
      },
    });
  };

  /** Solid/light pills that need contrast on tinted headers */
  const headerSolidPill =
    app.status === "need_documents" || app.status === "rejected";

  const isPending = app.status === "submitted" || app.status === "under_review";
  const showScoreAfterSummary = app.status !== "rejected";

  return (
    <div className={`min-h-svh overflow-x-hidden antialiased ${visual.pageBg}`}>
      {/* Hero */}
      <header
        className={`relative bg-gradient-to-br px-4 pb-14 pt-10 shadow-lg shadow-black/10 rounded-b-[28px] ${visual.heroGradient}`}
      >
        <div className="mx-auto flex max-w-lg items-start gap-3">
          <button
            type="button"
            onClick={() => navigate("/home/index")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition-colors hover:bg-white/28"
            aria-label="Kembali"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">Status aplikasi</p>
            <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-tight text-white">Pengajuan RTO</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${headerSolidPill ? visual.pillClass : "bg-white/20 text-white ring-1 ring-white/30 backdrop-blur-sm"}`}
              >
                {visual.text}
              </span>
              <span className="font-mono text-[10px] text-white/75">#{app.id}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg -mt-8 space-y-5 px-4 pb-28">
        {/* Status summary card */}
        <div className={`relative overflow-hidden rounded-[22px] p-6 ${visual.summaryCardClass}`}>
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br opacity-[0.85] blur-2xl ${visual.ringClass}`}
            aria-hidden
          />
          <div className="relative flex gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner ${visual.glyphIconClass}`}
            >
              <StatusGlyph status={app.status} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-snug text-gray-900">
                {getStatusSummaryHeadline(app.status) || visual.text}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{statusSubtitle(app.status)}</p>
            </div>
          </div>
        </div>

        {(app.status === "submitted" || app.status === "under_review") && (
          <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3.5 shadow-sm">
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-bold text-slate-700">Demo review:</span> status berubah otomatis dalam beberapa detik — mirip notifikasi dari dealer.
            </p>
          </div>
        )}

        {showScoreAfterSummary && !isPending && (
          <ScoreBreakdownPanel
            score={app.score}
            decisionLabel={getCreditDecisionLabel(app.status)}
            decisionHint={decisionHintForStatus(app.status)}
            cardClassName={visual.scoreCardClass}
          />
        )}

        {isPending && (
          <div className={`${visual.scoreCardClass} overflow-hidden`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Keputusan pengajuan</p>
                <p className="mt-1.5 text-lg font-bold text-gray-900">Menunggu keputusan</p>
                <p className="mt-1 text-xs text-gray-500">Tim sedang meninjau kelayakan — hasil muncul di sini.</p>
              </div>
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-slate-200/60" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" className="opacity-30" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {app.status === "need_documents" && (
          <section className={`rounded-[22px] p-5 ${visual.summaryCardClass}`}>
            <h3 className={rtoSectionTitle}>Yang perlu dilengkapi</h3>
            {app.reviewerNote && <p className="-mt-1 mb-3 text-sm leading-relaxed text-gray-800">{app.reviewerNote}</p>}
            <ul className="space-y-3">
              {requestedDocIdsList.map((id) => {
                const inputId = `rto-supplementary-${app.id}-${id}`;
                const picked = pendingSupplementaryNames[id];
                return (
                  <li
                    key={id}
                    className="rounded-xl border border-amber-200/80 bg-white p-3 shadow-sm shadow-amber-500/5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm text-amber-700">
                        📄
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">{DOC_LABELS[id] ?? id}</p>
                        <p className="mt-1 text-[11px] text-gray-500">
                          PDF atau foto (JPG/PNG); ukuran berkas mengikuti kebijakan unggah.
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <input
                            id={inputId}
                            type="file"
                            accept="image/*,.pdf,application/pdf"
                            className="sr-only"
                            onChange={(e) => handleSupplementaryFileChange(id, e.target.files)}
                          />
                          <label
                            htmlFor={inputId}
                            className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-[#4DB6AC] bg-white px-4 py-2 text-xs font-bold text-[#327478] transition-colors hover:bg-primary10"
                          >
                            Pilih berkas
                          </label>
                          {picked ? (
                            <span className="max-w-[200px] truncate text-xs font-medium text-green" title={picked}>
                              ✓ {picked}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Belum ada berkas</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
              Setelah semua dokumen dipilih, kirim ke dealer untuk dilanjutkan verifikasi. Unggahan nyata
              tersambung API di rilis penuh — untuk saat ini nama berkas disimpan secara lokal (demo).
            </p>
            <button
              type="button"
              disabled={!allSupplementaryChosen}
              onClick={handleSubmitSupplementaryDocs}
              className="mt-4 w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/25 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
            >
              Kirim dokumen
            </button>
            {!allSupplementaryChosen && requestedDocIdsList.length > 0 && (
              <p className="mt-2 text-center text-[11px] text-gray-500">
                Pilih berkas untuk setiap dokumen di atas agar tombol aktif.
              </p>
            )}
          </section>
        )}

        {app.status === "approved" && (
          <section className={`rounded-[22px] p-5 ${visual.summaryCardClass}`}>
            <h3 className="text-sm font-bold text-green-700">Langkah berikutnya</h3>
            <ol className="mt-4 space-y-3">
              {[
                "Jadwalkan pengambilan motor",
                "Bawa dokumen asli (KTP, dll.)",
                "Tanda tangan kontrak di dealer",
                "Motor siap dibawa",
              ].map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{item}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => navigate(`/rto-pickup/${app.id}`)}
              className="mt-5 w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/30"
            >
              Atur jadwal ambil motor
            </button>
          </section>
        )}

        {app.status === "pickup_scheduled" && app.pickup && (
          <section className={visual.pickupJadwalCardClass}>
            <h3 className={rtoSectionTitle}>Jadwal pengambilan</h3>
            <div className="-mt-1 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-base font-bold text-gray-900">
                {new Date(app.pickup.date + "T12:00:00").toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#327478]">{app.pickup.timeSlot} WIB</p>
              <p className="mt-3 text-sm font-medium text-gray-800">{app.pickup.dealerName}</p>
              <p className="text-xs leading-relaxed text-gray-500">{app.pickup.dealerAddress}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(`/rto-pickup/${app.id}`)}
                className="flex-1 min-w-[120px] rounded-2xl border-2 border-[#4DB6AC] bg-white py-3 text-xs font-bold text-[#4DB6AC]"
              >
                Ubah jadwal
              </button>
              <button
                type="button"
                onClick={() => dispatch(updateApplicationStatus({ id: app.id, status: "pickup_done" }))}
                className="flex-1 min-w-[120px] rounded-2xl border border-gray-200 bg-gray-50 py-3 text-xs font-semibold text-gray-600"
              >
                Sudah diambil (demo)
              </button>
            </div>
          </section>
        )}

        {app.status === "pickup_scheduled" && app.pickup && (
          <PickupPrepSection
            app={app}
            operator={operator}
            programExplore={programExplore}
            docCount={pickupDocCount}
            onOpenChecklist={() => setPickupChecklistOpen(true)}
            surfaceClassName={visual.pickupPrepCardClass}
          />
        )}

        {app.status === "pickup_done" && (
          <section className={`rounded-[22px] p-5 text-center ${visual.summaryCardClass}`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm text-green">
              <StatusGlyph status="pickup_done" />
            </div>
            <p className="mt-4 text-base font-bold text-gray-900">Pengambilan selesai</p>
            <p className="mx-auto mt-2 max-w-[280px] text-sm text-gray-600">
              Semoga aktivitas dengan motor listriknya menyenangkan. Hubungi dealer untuk pertanyaan layanan paska-pengambilan.
            </p>
          </section>
        )}

        {app.status === "rejected" && (
          <section className={`rounded-[22px] p-5 ${visual.summaryCardClass}`}>
            <h3 className="text-sm font-bold text-rose-600">Ringkasan keputusan</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">{app.rejectionReason ?? "Tidak memenuhi syarat program."}</p>
            <div className="mt-4">
              <ScoreBreakdownPanel
                score={app.score}
                decisionLabel={getCreditDecisionLabel("rejected")}
                decisionHint="Skor merangkum kelayakan saat review; keputusan mengikuti kebijakan program."
                hideSectionTitle
                embedded
                embeddedCardClassName={visual.embeddedScoreCardClass}
              />
            </div>
            <div className="mt-4 rounded-2xl border border-rose-200/60 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-700">Tips meningkatkan peluang</p>
              <ul className="mt-2 space-y-2 text-xs leading-relaxed text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green">✓</span>
                  Tambah penjamin dengan penghasilan tetap
                </li>
                <li className="flex gap-2">
                  <span className="text-green">✓</span>
                  Lengkapi dokumen &amp; bukti pendapatan
                </li>
                <li className="flex gap-2">
                  <span className="text-green">✓</span>
                  Pertimbangkan program dengan syarat lebih ringan
                </li>
              </ul>
            </div>
            {cooldownSeconds > 0 && app.rejectionCooldownUntil && (
              <div className="mt-4 rounded-2xl bg-white/90 p-3 text-xs leading-relaxed text-gray-700">
                <p className="font-semibold text-gray-900">Masa tunggu pengajuan baru</p>
                <p className="mt-1">
                  Setelah{" "}
                  <span className="font-bold text-rose-600">
                    {new Date(app.rejectionCooldownUntil).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>{" "}
                  Anda dapat mengajukan program lain. Satu akun hanya satu pengajuan aktif; bagikan program ke teman tetap boleh.
                </p>
              </div>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
              &ldquo;Lihat program lainnya&rdquo; untuk menjelajah &amp; membagikan. Tombol <strong>Ajukan</strong> mengikuti kebijakan di atas.
            </p>
            <button
              type="button"
              onClick={() => navigate("/rto-program-explore")}
              className="mt-4 w-full rounded-2xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/25 transition-colors hover:bg-green-700"
            >
              Jelajahi program lainnya
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Cek program RTO "${app.operatorName}"!\n\n🛵 ${app.bikeName}\n📍 ${app.operatorName}\n\nInfo & ajukan lewat app CASAN — Rent to Own.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              <span aria-hidden>💬</span>
              Bagikan ke teman
            </a>
            <button
              type="button"
              onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              Hubungi support CASAN
            </button>
          </section>
        )}

        {/* Horizontal progress tracker */}
        <section className={visual.timelineCardClass}>
          <div className="flex items-center justify-between" role="list" aria-label="Alur proses">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < activeIdx;
              const isCurrent = i === activeIdx && activeIdx < STATUS_STEPS.length;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={step.key} className="flex flex-1 items-center" role="listitem">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                        isDone
                          ? "bg-[#4DB6AC] text-white shadow-sm"
                          : isCurrent
                            ? "bg-white text-[#4DB6AC] ring-2 ring-[#4DB6AC] ring-offset-1 shadow-sm"
                            : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {isDone ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-center text-[10px] leading-tight ${
                        isDone || isCurrent ? "font-semibold text-gray-800" : "font-medium text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium text-[#4DB6AC]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4DB6AC]" />
                        Aktif
                      </span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${isDone ? "bg-[#4DB6AC]" : "bg-gray-200"}`}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
          {app.submittedAt && (
            <p className="mt-3 text-center text-[10px] text-gray-400">
              Diajukan {formatDate(app.submittedAt)}
            </p>
          )}
        </section>

        {/* Bottom actions — before sticky footer */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Hubungi dealer / CASAN
          </button>

          {(app.status === "submitted" || app.status === "under_review" || app.status === "need_documents") && (
            <button
              type="button"
              onClick={handleEditApplication}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Edit &amp; lengkapi aplikasi
            </button>
          )}
        </div>

        {pickupChecklistOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-black/45"
              aria-label="Tutup modal"
              onClick={() => setPickupChecklistOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pickup-checklist-title"
              className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 id="pickup-checklist-title" className="text-lg font-bold text-gray-900">
                    Dokumen bawa ambil motor
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {pickupDocCount} item — siapkan sebelum ke dealer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickupChecklistOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  aria-label="Tutup"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-3">
                {pickupDocReminders.map((item, idx) => (
                  <li
                    key={`${item.title}-${idx}`}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-baseLightGray2/50 p-3"
                  >
                    <span className="text-base leading-none" aria-hidden>
                      {item.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      {item.detail ? (
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.detail}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setPickupChecklistOpen(false)}
                className="mt-6 w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/25"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky program mini-footer */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200/80 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-2.5">
          <button
            type="button"
            onClick={() => navigate(rtoBikePath(app.bikeId))}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-label={`Program ${app.bikeName}`}
          >
            <div className="relative h-10 w-11 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-green-100/80">
              {programExplore?.bike.photoUrl ? (
                <img src={programExplore.bike.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm">🛵</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-gray-900">{app.bikeName || "Motor listrik"}</p>
              <p className="truncate text-[10px] text-gray-500">
                {app.operatorName}
                {app.pricePerDay > 0 && <> · Rp {app.pricePerDay.toLocaleString("id-ID")}/hari</>}
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate(rtoBikePath(app.bikeId))}
            className="shrink-0 rounded-xl bg-[#4DB6AC] px-4 py-2 text-[11px] font-bold text-white shadow-sm"
          >
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}
