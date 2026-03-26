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
      return "Skor dari verifikasi awal. Jadwal & lokasi ada di kartu di atas.";
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
  /** Halaman: gradient lembut mengikuti warna status (selaras kartu ditolak). */
  pageBg: string;
  /** Kartu ringkasan pertama: border + isi seperti kartu utama ditolak. */
  summaryCardClass: string;
  /** Wadah ikon di kartu ringkasan. */
  glyphIconClass: string;
  /** Kartu skor (standalone). */
  scoreCardClass: string;
  /** Kartu skor di dalam blok ditolak. */
  embeddedScoreCardClass: string;
  /** Kartu alur proses. */
  timelineCardClass: string;
  /** Kartu jadwal pickup (opsional). */
  pickupJadwalCardClass: string;
  /** Kartu lokasi dealer (opsional). */
  pickupPrepCardClass: string;
};

function getStatusVisual(status: string): StatusVisual {
  const pageNeutral = "to-[#eef5f4]";
  switch (status) {
    case "submitted":
      return {
        text: "Aplikasi terkirim",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary30/90 to-primary10",
        heroGradient: "from-[#4DB6AC] via-[#4aa89e] to-[#3d9a91]",
        pageBg: `bg-gradient-to-b from-[#e8f5f3]/95 via-[#f2faf8]/60 ${pageNeutral}`,
        summaryCardClass:
          "border border-[#4DB6AC]/30 bg-gradient-to-br from-white via-[#f7fcfb] to-[#e8f5f3]/55 shadow-sm shadow-[#4DB6AC]/5",
        glyphIconClass: "bg-white text-[#2d8a7d] shadow-sm ring-1 ring-[#4DB6AC]/25",
        scoreCardClass:
          "rounded-[22px] border border-[#4DB6AC]/25 bg-gradient-to-b from-[#f4fbfb] to-white shadow-sm shadow-[#4DB6AC]/5",
        embeddedScoreCardClass: "rounded-2xl border border-[#4DB6AC]/20 bg-gradient-to-b from-white to-[#f4fbfb] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-[#4DB6AC]/18 bg-gradient-to-b from-white to-[#f8fdfc]/90 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-[#4DB6AC]/22 bg-gradient-to-b from-[#f4fbfb] to-white p-5 shadow-sm shadow-[#4DB6AC]/5",
        pickupPrepCardClass:
          "rounded-[22px] border border-[#4DB6AC]/20 bg-gradient-to-b from-white to-[#f0faf8]/90 p-4 shadow-sm sm:p-5",
      };
    case "under_review":
      return {
        text: "Sedang direview",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary70/40 to-primary30/60",
        heroGradient: "from-[#45a89e] via-[#3f9d94] to-[#358f87]",
        pageBg: `bg-gradient-to-b from-[#dff2ee]/95 via-[#f0faf8]/55 ${pageNeutral}`,
        summaryCardClass:
          "border border-[#3d9a91]/35 bg-gradient-to-br from-white via-[#f5fbfa] to-[#dff2ee]/50 shadow-sm shadow-[#3d9a91]/8",
        glyphIconClass: "bg-white text-[#2a7d72] shadow-sm ring-1 ring-[#3d9a91]/28",
        scoreCardClass:
          "rounded-[22px] border border-[#3d9a91]/25 bg-gradient-to-b from-[#f0faf8] to-white shadow-sm",
        embeddedScoreCardClass: "rounded-2xl border border-[#3d9a91]/22 bg-gradient-to-b from-white to-[#f0faf8] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-[#3d9a91]/18 bg-gradient-to-b from-white to-[#f6fcfb]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-[#3d9a91]/22 bg-gradient-to-b from-[#f0faf8] to-white p-5 shadow-sm",
        pickupPrepCardClass:
          "rounded-[22px] border border-[#3d9a91]/20 bg-gradient-to-b from-white to-[#f4fbfb]/95 p-4 shadow-sm sm:p-5",
      };
    case "need_documents":
      return {
        text: "Perlu dokumen",
        pillClass: "bg-orange/25 text-[#9a6200] border border-orange/40",
        ringClass: "from-orange/35 to-secondary30",
        heroGradient: "from-[#e8a54a] via-[#d99a3c] to-[#c9892e]",
        pageBg: "bg-gradient-to-b from-[#fff6e8]/95 via-[#fffbf5]/60 to-[#f8f4ed]",
        summaryCardClass:
          "border border-strokeOrange/75 bg-gradient-to-br from-white via-[#FFFCF5] to-[#FFF5E6]/70 shadow-sm shadow-orange/10",
        glyphIconClass: "bg-white text-orange shadow-sm ring-1 ring-orange/35",
        scoreCardClass:
          "rounded-[22px] border border-strokeOrange/55 bg-gradient-to-b from-[#FFFAF1] to-white shadow-sm shadow-orange/5",
        embeddedScoreCardClass:
          "rounded-2xl border border-strokeOrange/50 bg-gradient-to-b from-white to-[#FFFAF1] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-strokeOrange/40 bg-gradient-to-b from-white to-[#FFFCF7]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-strokeOrange/45 bg-gradient-to-b from-[#FFFAF1] to-white p-5 shadow-sm",
        pickupPrepCardClass:
          "rounded-[22px] border border-strokeOrange/40 bg-gradient-to-b from-white to-[#FFFAF6]/90 p-4 shadow-sm sm:p-5",
      };
    case "approved":
      return {
        text: "Disetujui",
        pillClass: "bg-green/20 text-green border border-strokeGreen",
        ringClass: "from-strokeGreen to-lightGreen",
        heroGradient: "from-[#3db86b] via-[#2fa65d] to-[#24904f]",
        pageBg: "bg-gradient-to-b from-[#ecfdf5]/90 via-[#f4fdf8]/55 to-[#eef5f4]",
        summaryCardClass:
          "border border-strokeGreen/65 bg-gradient-to-br from-white via-[#f4fdf7] to-[#ecfdf5]/55 shadow-sm shadow-green/10",
        glyphIconClass: "bg-white text-green shadow-sm ring-1 ring-strokeGreen/40",
        scoreCardClass:
          "rounded-[22px] border border-strokeGreen/55 bg-gradient-to-b from-[#EDF8EF] to-white shadow-sm shadow-green/5",
        embeddedScoreCardClass:
          "rounded-2xl border border-strokeGreen/45 bg-gradient-to-b from-white to-[#EDF8EF] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-strokeGreen/35 bg-gradient-to-b from-white to-[#f4fdf7]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-strokeGreen/40 bg-gradient-to-b from-[#EDF8EF] to-white p-5 shadow-sm",
        pickupPrepCardClass:
          "rounded-[22px] border border-strokeGreen/35 bg-gradient-to-b from-white to-[#f0fdf6]/90 p-4 shadow-sm sm:p-5",
      };
    case "rejected":
      return {
        text: "Belum disetujui",
        pillClass: "bg-white/95 text-red border border-strokeRed shadow-sm",
        ringClass: "from-strokeRed/80 to-lightRed",
        heroGradient: "from-[#e85d6f] via-[#d64d5f] to-[#c44452]",
        pageBg: "bg-gradient-to-b from-[#fff1f3]/95 via-[#fdf7f8]/70 to-[#eef5f4]",
        summaryCardClass:
          "border border-strokeRed/70 bg-gradient-to-b from-[#FCEEF0] to-white shadow-sm shadow-red/10",
        glyphIconClass: "bg-white text-red shadow-sm ring-1 ring-strokeRed/45",
        scoreCardClass:
          "rounded-[22px] border border-strokeRed/55 bg-gradient-to-b from-[#FCEEF0] to-white shadow-sm shadow-red/5",
        embeddedScoreCardClass:
          "rounded-2xl border border-strokeRed/40 bg-gradient-to-b from-white to-[#FCEEF0]/90 p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-strokeRed/25 bg-gradient-to-b from-white to-[#fef7f8]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-strokeRed/30 bg-gradient-to-b from-[#FCEEF0] to-white p-5 shadow-sm",
        pickupPrepCardClass:
          "rounded-[22px] border border-strokeRed/28 bg-gradient-to-b from-white to-[#fef7f8]/90 p-4 shadow-sm sm:p-5",
      };
    case "pickup_scheduled":
      return {
        text: "Pickup dijadwalkan",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary50/50 to-primary10",
        heroGradient: "from-[#4DB6AC] via-[#439f96] to-[#3a8f87]",
        pageBg: `bg-gradient-to-b from-[#dff5f2]/95 via-[#f0faf9]/55 ${pageNeutral}`,
        summaryCardClass:
          "border border-[#4DB6AC]/32 bg-gradient-to-br from-white via-[#f5fcfb] to-[#dff5f2]/45 shadow-sm shadow-[#4DB6AC]/8",
        glyphIconClass: "bg-white text-[#2d8a7d] shadow-sm ring-1 ring-[#4DB6AC]/28",
        scoreCardClass:
          "rounded-[22px] border border-[#4DB6AC]/28 bg-gradient-to-b from-[#f0faf8] to-white shadow-sm shadow-[#4DB6AC]/6",
        embeddedScoreCardClass: "rounded-2xl border border-[#4DB6AC]/22 bg-gradient-to-b from-white to-[#f0faf8] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-[#4DB6AC]/18 bg-gradient-to-b from-white to-[#f8fdfc]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-[#4DB6AC]/24 bg-gradient-to-b from-[#f4fbfb] to-white p-5 shadow-sm shadow-[#4DB6AC]/5",
        pickupPrepCardClass:
          "rounded-[22px] border border-[#4DB6AC]/20 bg-gradient-to-b from-white to-[#f0faf8]/92 p-4 shadow-sm sm:p-5",
      };
    case "pickup_done":
      return {
        text: "Selesai",
        pillClass: "bg-green/15 text-green border border-strokeGreen",
        ringClass: "from-strokeGreen to-lightGreen",
        heroGradient: "from-[#34b56a] via-[#2aa35f] to-[#219152]",
        pageBg: "bg-gradient-to-b from-[#d1fae5]/80 via-[#ecfdf5]/50 to-[#eef5f4]",
        summaryCardClass:
          "border border-strokeGreen/60 bg-gradient-to-br from-white via-[#f0fdf6] to-[#d1fae5]/40 shadow-sm shadow-green/10",
        glyphIconClass: "bg-white text-green shadow-sm ring-1 ring-strokeGreen/45",
        scoreCardClass:
          "rounded-[22px] border border-strokeGreen/50 bg-gradient-to-b from-[#ecfdf5] to-white shadow-sm",
        embeddedScoreCardClass:
          "rounded-2xl border border-strokeGreen/40 bg-gradient-to-b from-white to-[#ecfdf5] p-5 shadow-sm",
        timelineCardClass:
          "rounded-[22px] border border-strokeGreen/32 bg-gradient-to-b from-white to-[#f0fdf6]/95 p-5 shadow-sm",
        pickupJadwalCardClass:
          "rounded-[22px] border border-strokeGreen/38 bg-gradient-to-b from-[#ecfdf5] to-white p-5 shadow-sm",
        pickupPrepCardClass:
          "rounded-[22px] border border-strokeGreen/32 bg-gradient-to-b from-white to-[#f0fdf6]/90 p-4 shadow-sm sm:p-5",
      };
    default:
      return {
        text: "Diproses",
        pillClass: "bg-white/15 text-white border border-white/20",
        ringClass: "from-gray-200 to-gray-100",
        heroGradient: "from-[#4DB6AC] to-[#327478]",
        pageBg: `bg-gradient-to-b from-gray-50/90 via-[#f5f8f9]/60 ${pageNeutral}`,
        summaryCardClass: "border border-gray-200/80 bg-gradient-to-br from-white to-gray-50/50 shadow-sm",
        glyphIconClass: "bg-white/90 text-[#2d8a7d] shadow-sm ring-1 ring-gray-200",
        scoreCardClass: "rounded-[22px] border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/40 p-5 shadow-sm",
        embeddedScoreCardClass: "rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm",
        timelineCardClass: "rounded-[22px] border border-gray-200/60 bg-white p-5 shadow-sm",
        pickupJadwalCardClass: "rounded-[22px] border border-gray-200/60 bg-white p-5 shadow-sm",
        pickupPrepCardClass: "rounded-[22px] border border-gray-200/55 bg-white p-4 shadow-sm sm:p-5",
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
  const showPhotoGallery = photos.length > 1;

  return (
    <section className={surfaceClassName ?? `${rtoCard} p-4 sm:p-5`}>
      <h3 className={rtoSectionTitle}>Lokasi dealer</h3>
      <p className="-mt-0.5 text-xs leading-relaxed text-gray-500">Peta &amp; alamat — dokumen lewat satu tombol di bawah.</p>

      <button
        type="button"
        onClick={() => openGoogleMapsSearch(mapQuery)}
        className="group mt-4 flex w-full gap-3 rounded-2xl border border-gray-100 bg-baseLightGray2/50 p-2.5 text-left shadow-sm transition-colors hover:border-[#4DB6AC]/35"
        aria-label="Buka lokasi di Google Maps"
      >
        <div className="relative h-[5.25rem] w-[6.75rem] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#dff5f2] to-[#c8ebe5]">
          {mapSrc ? (
            <img
              src={mapSrc}
              alt=""
              className="h-full w-full object-cover transition group-hover:opacity-95"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl" aria-hidden>
              📍
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <p className="text-sm font-semibold leading-snug text-gray-900">{pickup.dealerName}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{pickup.dealerAddress}</p>
          <p className="mt-2 text-xs font-bold text-[#327478]">Buka di Google Maps →</p>
        </div>
      </button>

      {showPhotoGallery ? (
        <details className="group mt-3 rounded-2xl border border-gray-100 bg-white/90 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-gray-800">
            <span>Foto cabang ({photos.length})</span>
            <span className="text-[10px] font-medium text-[#327478] group-open:hidden">Tampilkan</span>
            <span className="hidden text-[10px] font-medium text-gray-500 group-open:inline">Sembunyikan</span>
          </summary>
          <div className="flex gap-2 overflow-x-auto px-2 pb-3 [-webkit-overflow-scrolling:touch]">
            {photos.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100"
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </details>
      ) : (
        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100">
          <img src={photos[0]} alt="" className="h-24 w-full object-cover" loading="lazy" />
        </div>
      )}

      <button
        type="button"
        onClick={onOpenChecklist}
        className="mt-4 flex w-full items-center justify-between gap-3 rounded-2xl border border-amber-200/90 bg-amber-50/50 px-4 py-3.5 text-left transition-colors hover:bg-amber-50"
      >
        <div>
          <p className="text-sm font-bold text-gray-900">Checklist dokumen</p>
          <p className="mt-0.5 text-[11px] text-gray-600">{docCount} item sebelum berangkat</p>
        </div>
        <span className="shrink-0 text-lg font-light text-[#327478]" aria-hidden>
          ›
        </span>
      </button>
    </section>
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

  /** Skor lebih atas di layar (pickup terjadwal) — selaras panah di desain. */
  const scoreSectionEarly = app.status === "pickup_scheduled";

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
          <div
            className={`${rtoCardSubtle} border-primary30/60 bg-gradient-to-r from-primary10 to-white px-4 py-3.5`}
          >
            <p className="text-xs leading-relaxed text-primaryDark">
              <span className="font-bold">Demo review:</span> status berubah otomatis dalam beberapa detik — mirip notifikasi dari dealer.
            </p>
          </div>
        )}

        {scoreSectionEarly && (
          <ScoreBreakdownPanel
            score={app.score}
            decisionLabel={getCreditDecisionLabel(app.status)}
            decisionHint={decisionHintForStatus(app.status)}
            cardClassName={visual.scoreCardClass}
          />
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
                    className="rounded-xl border border-strokeOrange/55 bg-white/95 p-3 shadow-sm shadow-orange/5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange/15 text-sm text-[#b37400]">
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
            <h3 className="text-sm font-bold text-green">Langkah berikutnya</h3>
            <ol className="mt-4 space-y-3">
              {[
                "Jadwalkan pengambilan motor",
                "Bawa dokumen asli (KTP, dll.)",
                "Tanda tangan kontrak di dealer",
                "Motor siap dibawa",
              ].map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green/15 text-xs font-bold text-green">
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
            <div className="-mt-1 rounded-2xl border border-gray-100 bg-baseLightGray2/80 p-4">
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
            <h3 className="text-sm font-bold text-red">Ringkasan keputusan</h3>
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
            <div className="mt-4 rounded-2xl border border-strokeRed/40 bg-white/90 p-4">
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
                  <span className="font-bold text-red">
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
              className="mt-4 w-full rounded-2xl border-2 border-[#4DB6AC] bg-white py-3.5 text-sm font-bold text-[#4DB6AC] shadow-sm"
            >
              Lihat program lainnya
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Cek program RTO "${app.operatorName}"!\n\n🛵 ${app.bikeName}\n📍 ${app.operatorName}\n\nInfo & ajukan lewat app CASAN — Rent to Own.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-md shadow-green/20"
            >
              <span aria-hidden>💬</span>
              Bagikan ke teman
            </a>
            <button
              type="button"
              onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600"
            >
              Hubungi support CASAN
            </button>
          </section>
        )}

        {app.status !== "rejected" && !scoreSectionEarly && (
          <ScoreBreakdownPanel
            score={app.score}
            decisionLabel={getCreditDecisionLabel(app.status)}
            decisionHint={decisionHintForStatus(app.status)}
            cardClassName={visual.scoreCardClass}
          />
        )}

        {/* Timeline */}
        <section>
          <h3 className={rtoSectionTitle}>Alur proses</h3>
          <div className={visual.timelineCardClass}>
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < activeIdx;
              const isCurrent = i === activeIdx && activeIdx < STATUS_STEPS.length;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-sm transition-all ${
                        isDone
                          ? "bg-[#4DB6AC] text-white shadow-sm shadow-[#4DB6AC]/25"
                          : isCurrent
                            ? "bg-white text-[#4DB6AC] ring-2 ring-[#4DB6AC] ring-offset-2"
                            : "bg-gray-100 text-gray-300"
                      }`}
                    >
                      {isDone ? "✓" : i + 1}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`my-0.5 w-0.5 flex-1 min-h-[28px] rounded-full ${
                          isDone ? "bg-[#4DB6AC]" : "bg-gray-200"
                        }`}
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className={`min-w-0 flex-1 ${i < STATUS_STEPS.length - 1 ? "pb-5" : ""} pt-0.5`}>
                    <p className={`text-sm font-semibold ${isDone || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] leading-snug text-gray-500">{step.hint}</p>
                    {i === 0 && app.submittedAt && (
                      <p className="mt-1 text-[10px] text-gray-400">{formatDate(app.submittedAt)}</p>
                    )}
                    {isCurrent && (
                      <p className="mt-1 text-[11px] font-medium text-[#327478]">Berlangsung…</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Program */}
        <section>
          <h3 className={rtoSectionTitle}>Program dipilih</h3>
          <div className={`${visual.timelineCardClass} !p-0 overflow-hidden`}>
            <button
              type="button"
              onClick={() => navigate(rtoBikePath(app.bikeId))}
              className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50/80"
              aria-label={`Buka katalog program ${app.bikeName}`}
            >
              <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#dff5f2] to-[#c8ebe5]">
                {programExplore?.bike.photoUrl ? (
                  <img
                    src={programExplore.bike.photoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg">🛵</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-bold text-gray-900">
                  {app.bikeName || "Motor listrik"}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-gray-500">
                  {app.operatorName}
                  {app.pricePerDay > 0 && (
                    <>
                      <span className="text-gray-300"> · </span>
                      Rp {app.pricePerDay.toLocaleString("id-ID")}/hari
                    </>
                  )}
                </p>
              </div>
              <span className="shrink-0 text-[#4DB6AC]" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {pickupDocsShortLine && (
              <div className="border-t border-amber-100/80 bg-amber-50/30 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-amber-900/75">
                  Bawa saat ambil motor
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-gray-700">{pickupDocsShortLine}</p>
              </div>
            )}

            <div className="border-t border-gray-100 px-3 py-2">
              <button
                type="button"
                onClick={() => navigate(rtoBikePath(app.bikeId))}
                className="w-full rounded-lg border border-[#4DB6AC]/40 bg-white py-2 text-[11px] font-semibold text-[#327478] transition-colors hover:bg-primary10/40"
              >
                Detail program di katalog
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
            className={`${rtoCardSubtle} w-full border-[#4DB6AC]/25 bg-white py-3.5 text-sm font-bold text-[#327478] shadow-sm transition-colors hover:bg-primary10/40`}
          >
            Hubungi dealer / CASAN
          </button>

          {(app.status === "submitted" || app.status === "under_review" || app.status === "need_documents") && (
            <button
              type="button"
              onClick={handleEditApplication}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
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
    </div>
  );
}
