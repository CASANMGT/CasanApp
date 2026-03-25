import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import type { Application, ScoreBreakdown } from "../../types/rtoApplication";
import {
  updateApplicationStatus,
  resumeApplicationEdit,
} from "../../features/rto/rtoApplicationSlice";
import { openWhatsApp } from "../../helpers/linking";
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

type StatusVisual = {
  text: string;
  pillClass: string;
  ringClass: string;
  heroGradient: string;
};

function getStatusVisual(status: string): StatusVisual {
  switch (status) {
    case "submitted":
      return {
        text: "Aplikasi terkirim",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary30/90 to-primary10",
        heroGradient: "from-[#4DB6AC] via-[#4aa89e] to-[#3d9a91]",
      };
    case "under_review":
      return {
        text: "Sedang direview",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary70/40 to-primary30/60",
        heroGradient: "from-[#45a89e] via-[#3f9d94] to-[#358f87]",
      };
    case "need_documents":
      return {
        text: "Perlu dokumen",
        pillClass: "bg-orange/25 text-[#9a6200] border border-orange/40",
        ringClass: "from-orange/35 to-secondary30",
        heroGradient: "from-[#e8a54a] via-[#d99a3c] to-[#c9892e]",
      };
    case "approved":
      return {
        text: "Disetujui",
        pillClass: "bg-green/20 text-green border border-strokeGreen",
        ringClass: "from-strokeGreen to-lightGreen",
        heroGradient: "from-[#3db86b] via-[#2fa65d] to-[#24904f]",
      };
    case "rejected":
      return {
        text: "Belum disetujui",
        pillClass: "bg-white/95 text-red border border-strokeRed shadow-sm",
        ringClass: "from-strokeRed/80 to-lightRed",
        heroGradient: "from-[#e85d6f] via-[#d64d5f] to-[#c44452]",
      };
    case "pickup_scheduled":
      return {
        text: "Pickup dijadwalkan",
        pillClass: "bg-white/20 text-white border border-white/25",
        ringClass: "from-primary50/50 to-primary10",
        heroGradient: "from-[#4DB6AC] via-[#439f96] to-[#3a8f87]",
      };
    case "pickup_done":
      return {
        text: "Selesai",
        pillClass: "bg-green/15 text-green border border-strokeGreen",
        ringClass: "from-strokeGreen to-lightGreen",
        heroGradient: "from-[#34b56a] via-[#2aa35f] to-[#219152]",
      };
    default:
      return {
        text: "Diproses",
        pillClass: "bg-white/15 text-white border border-white/20",
        ringClass: "from-gray-200 to-gray-100",
        heroGradient: "from-[#4DB6AC] to-[#327478]",
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

function ScoreBreakdownPanel({ score }: { score: ScoreBreakdown }) {
  return (
    <div className={`${rtoCard} overflow-hidden p-5`}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Skor kelayakan</p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-gray-900">
            {score.total}
            <span className="text-base font-semibold text-gray-400">/100</span>
          </p>
        </div>
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
              strokeDasharray={`${score.total} 100`}
              pathLength="100"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primaryDark">
            {score.total}
          </span>
        </div>
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
    </div>
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

  const activeIdx = getActiveIndex(app.status);
  const visual = getStatusVisual(app.status);
  const cooldownSeconds = app.rejectionCooldownUntil
    ? Math.max(0, Math.floor((new Date(app.rejectionCooldownUntil).getTime() - Date.now()) / 1000))
    : 0;

  const [pendingSupplementaryNames, setPendingSupplementaryNames] = useState<Record<string, string>>(
    {},
  );

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

  return (
    <div className="min-h-svh overflow-x-hidden antialiased">
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
        <div className={`${rtoCard} relative overflow-hidden p-6`}>
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br opacity-[0.85] blur-2xl ${visual.ringClass}`}
            aria-hidden
          />
          <div className="relative flex gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
                app.status === "rejected"
                  ? "bg-white text-red"
                  : app.status === "need_documents"
                    ? "bg-white text-orange"
                    : "bg-white/90 text-[#2d8a7d]"
              }`}
            >
              <StatusGlyph status={app.status} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold leading-snug text-gray-900">{visual.text}</p>
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

        {app.status === "need_documents" && (
          <section className={`${rtoCard} border-strokeOrange/80 bg-gradient-to-b from-[#FFFAF1] to-white p-5`}>
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
          <section className={`${rtoCard} border-strokeGreen/70 bg-gradient-to-b from-[#EDF8EF] to-white p-5`}>
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
          <section className={`${rtoCard} p-5`}>
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

        {app.status === "pickup_done" && (
          <section className={`${rtoCard} border-strokeGreen/60 bg-gradient-to-br from-lightGreen to-white p-5 text-center`}>
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
          <section className={`${rtoCard} border-strokeRed/70 bg-gradient-to-b from-[#FCEEF0] to-white p-5`}>
            <h3 className="text-sm font-bold text-red">Ringkasan keputusan</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-800">{app.rejectionReason ?? "Tidak memenuhi syarat program."}</p>
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

        {/* Timeline */}
        <section>
          <h3 className={rtoSectionTitle}>Alur proses</h3>
          <div className={`${rtoCard} p-5`}>
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

        <ScoreBreakdownPanel score={app.score} />

        {/* Program */}
        <section>
          <h3 className={rtoSectionTitle}>Program dipilih</h3>
          <div className={`${rtoCard} flex items-center gap-4 p-4`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4DB6AC]/20 to-primary10 text-xl shadow-inner">
              🛵
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{app.bikeName || "Motor listrik"}</p>
              <p className="truncate text-xs text-gray-500">
                {app.operatorName}
                {app.pricePerDay > 0 && (
                  <>
                    <span className="text-gray-300"> · </span>
                    Rp {app.pricePerDay.toLocaleString("id-ID")}/hari
                  </>
                )}
              </p>
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
      </main>
    </div>
  );
}
