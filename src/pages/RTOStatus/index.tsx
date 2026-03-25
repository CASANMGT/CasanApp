import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import type { Application } from "../../types/rtoApplication";
import {
  updateApplicationStatus,
  resumeApplicationEdit,
} from "../../features/rto/rtoApplicationSlice";
import { openWhatsApp } from "../../helpers/linking";
import { CUSTOMER_SERVICES } from "../../common";

const STATUS_STEPS = [
  { label: "Terkirim", key: "submitted" },
  { label: "Sedang Direview", key: "under_review" },
  { label: "Keputusan", key: "decided" },
  { label: "Ambil Motor", key: "pickup" },
];

const DOC_LABELS: Record<string, string> = {
  ktp: "KTP",
  selfie_ktp: "Selfie + KTP",
  sim: "SIM C",
  kk: "Kartu Keluarga",
  slip_gaji: "Slip gaji / bukti pendapatan",
  slik: "Hasil SLIK OJK",
};

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
    case "pickup_done":
      return 3;
    default:
      return 0;
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getStatusLabel(status: string): { text: string; color: string } {
  switch (status) {
    case "submitted":
      return { text: "Aplikasi Terkirim", color: "text-primaryDark" };
    case "under_review":
      return { text: "Sedang Direview", color: "text-primaryDark" };
    case "need_documents":
      return { text: "Dokumen Tambahan Diperlukan", color: "text-gold" };
    case "approved":
      return { text: "Disetujui!", color: "text-green" };
    case "rejected":
      return { text: "Tidak Disetujui", color: "text-red" };
    case "pickup_scheduled":
      return { text: "Pickup Terjadwal", color: "text-primaryDark" };
    case "pickup_done":
      return { text: "Selesai", color: "text-green" };
    default:
      return { text: "Diproses", color: "text-black70" };
  }
}

/** Simulasi review (PRD): skor menentukan hasil setelah under_review */
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="mb-4 text-5xl">🔍</div>
        <h2 className="mb-2 text-lg font-bold text-gray-800">Aplikasi tidak ditemukan</h2>
        <p className="mb-6 text-sm text-gray-500">ID: {applicationId}</p>
        <button
          type="button"
          onClick={() => navigate("/home/index")}
          className="rounded-2xl bg-[#4DB6AC] px-6 py-3 text-sm font-bold text-white shadow-lg"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const activeIdx = getActiveIndex(app.status);
  const statusInfo = getStatusLabel(app.status);
  const cooldownSeconds = app.rejectionCooldownUntil
    ? Math.max(0, Math.floor((new Date(app.rejectionCooldownUntil).getTime() - Date.now()) / 1000))
    : 0;

  const handleResubmitDocs = () => {
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: "submitted",
        reviewerNote: undefined,
        requestedDocIds: null,
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
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/home/index")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-gray-900">Status Aplikasi</h1>
            <p className="font-mono text-[11px] text-gray-400">{app.id}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 space-y-6 px-4 py-6">
        {(app.status === "submitted" || app.status === "under_review") && (
          <div className="rounded-xl border border-primary30 bg-primary10 px-3 py-2">
            <p className="text-[11px] text-primaryDark">
              <span className="font-bold">Simulasi review:</span> status akan diperbarui otomatis beberapa detik — seperti notifikasi dari dealer.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <div className="mb-3 text-4xl">
            {app.status === "submitted" || app.status === "under_review"
              ? "🕐"
              : app.status === "approved"
                ? "🎉"
                : app.status === "rejected"
                  ? "❌"
                  : app.status === "need_documents"
                    ? "📋"
                    : "📦"}
          </div>
          <h2 className={`text-lg font-bold ${statusInfo.color}`}>{statusInfo.text}</h2>
          <p className="mt-1 text-xs text-gray-500">
            {app.status === "submitted" || app.status === "under_review"
              ? "Kami sedang memeriksa data kamu."
              : app.status === "approved"
                ? "Selamat! Lanjut jadwalkan pengambilan motor."
                : app.status === "rejected"
                  ? "Silakan perbaiki profil atau pilih program lain."
                  : "Proses aplikasi kamu sedang berlangsung."}
          </p>
        </div>

        {app.status === "need_documents" && (
          <section className="rounded-2xl border border-strokeOrange bg-lightOrange p-4 shadow-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-600">
              Yang perlu dilengkapi
            </h3>
            {app.reviewerNote && <p className="mt-2 text-sm text-gray-800">{app.reviewerNote}</p>}
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-gray-700">
              {(app.requestedDocIds ?? []).map((id) => (
                <li key={id}>{DOC_LABELS[id] ?? id}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-gray-500">
              Di rilis penuh, unggah langsung di sini. Untuk demo: kirim ulang untuk lanjut simulasi.
            </p>
            <button
              type="button"
              onClick={handleResubmitDocs}
              className="mt-4 w-full rounded-2xl bg-[#4DB6AC] py-3 text-sm font-bold text-white shadow-md"
            >
              Upload &amp; kirim ulang (demo)
            </button>
          </section>
        )}

        {app.status === "approved" && (
          <section className="rounded-2xl border border-strokeGreen bg-lightGreen p-4 shadow-sm">
            <h3 className="text-sm font-bold text-green">Langkah berikutnya</h3>
            <ol className="mt-3 list-inside list-decimal space-y-2 text-xs text-gray-700">
              <li>Jadwalkan ambil motor</li>
              <li>Bawa dokumen asli (KTP, dll.)</li>
              <li>Tanda tangan kontrak di dealer</li>
              <li>Motor langsung bisa dibawa</li>
            </ol>
            <button
              type="button"
              onClick={() => navigate(`/rto-pickup/${app.id}`)}
              className="mt-4 w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg"
            >
              Atur jadwal ambil motor
            </button>
          </section>
        )}

        {app.status === "pickup_scheduled" && app.pickup && (
          <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
              Jadwal pickup
            </h3>
            <p className="mt-2 text-sm font-bold text-gray-900">
              {new Date(app.pickup.date + "T12:00:00").toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · {app.pickup.timeSlot} WIB
            </p>
            <p className="mt-1 text-xs text-gray-600">{app.pickup.dealerName}</p>
            <p className="text-xs text-gray-500">{app.pickup.dealerAddress}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(`/rto-pickup/${app.id}`)}
                className="rounded-xl border-2 border-[#4DB6AC] px-4 py-2 text-xs font-bold text-[#4DB6AC]"
              >
                Ubah jadwal
              </button>
              <button
                type="button"
                onClick={() => dispatch(updateApplicationStatus({ id: app.id, status: "pickup_done" }))}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600"
              >
                Tandai sudah diambil (demo)
              </button>
            </div>
          </section>
        )}

        {app.status === "rejected" && (
          <section className="rounded-2xl border border-strokeRed bg-lightRed p-4 shadow-sm">
            <h3 className="text-sm font-bold text-red">Alasan</h3>
            <p className="mt-2 text-sm text-gray-800">{app.rejectionReason ?? "Tidak memenuhi syarat program."}</p>
            <div className="mt-3 rounded-lg bg-white/80 p-3 text-[11px] text-gray-600">
              <p className="font-semibold text-gray-800">Tips naikkan skor</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                <li>Tambah penjamin dengan penghasilan tetap (+poin keluarga)</li>
                <li>Lengkapi dokumen &amp; bukti pendapatan (+poin dokumen)</li>
                <li>Pilih program dengan minimal gaji lebih rendah</li>
              </ul>
            </div>
            {cooldownSeconds > 0 && (
              <p className="mt-3 text-xs text-gray-600">
                Estimasi bisa ajukan ulang:{" "}
                <span className="font-bold text-red">
                  {Math.ceil(cooldownSeconds / 86400)} hari lagi
                </span>
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate("/rto-program-explore")}
              className="mt-4 w-full rounded-2xl border-2 border-[#4DB6AC] py-3 text-sm font-bold text-[#4DB6AC]"
            >
              Lihat program lainnya
            </button>
            <button
              type="button"
              onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
              className="mt-2 w-full rounded-2xl border border-gray-200 py-3 text-sm font-semibold text-gray-600"
            >
              Hubungi support CASAN
            </button>
          </section>
        )}

        <section>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Status Timeline
          </h3>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < activeIdx;
              const isCurrent = i === activeIdx;

              return (
                <div key={step.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                        isDone
                          ? "border-[#4DB6AC] bg-[#4DB6AC] text-white"
                          : isCurrent
                            ? "animate-pulse border-[#4DB6AC] bg-white text-[#4DB6AC]"
                            : "border-gray-200 bg-gray-50 text-gray-300"
                      }`}
                    >
                      {isDone ? "✓" : ""}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`min-h-[24px] w-0.5 flex-1 ${isDone ? "bg-[#4DB6AC]" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="pb-4 pt-0.5">
                    <p className={`text-xs font-semibold ${isDone || isCurrent ? "text-gray-900" : "text-gray-400"}`}>
                      {step.label}
                    </p>
                    {i === 0 && app.submittedAt && (
                      <p className="mt-0.5 text-[10px] text-gray-400">{formatDate(app.submittedAt)}</p>
                    )}
                    {isCurrent && i > 0 && (
                      <p className="mt-0.5 text-[10px] text-[#4DB6AC]">Sedang berlangsung...</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Skor kamu
          </h3>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="text-3xl font-black tabular-nums text-gray-900">
              {app.score.total}
              <span className="text-sm font-semibold text-gray-400">/100</span>
            </div>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#4DB6AC]" style={{ width: `${app.score.total}%` }} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Program
          </h3>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4DB6AC]/10 text-lg">
              🛵
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900">{app.bikeName || "Motor Listrik"}</p>
              <p className="truncate text-xs text-gray-500">
                {app.operatorName}
                {app.pricePerDay > 0 && (
                  <> &middot; Rp {app.pricePerDay.toLocaleString("id-ID")}/hari</>
                )}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-3 pb-8">
          <button
            type="button"
            onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
            className="w-full rounded-2xl border-2 border-[#4DB6AC]/30 bg-white py-3.5 text-sm font-bold text-[#4DB6AC] transition-colors hover:bg-[#4DB6AC]/5"
          >
            Hubungi dealer via WhatsApp
          </button>

          {(app.status === "submitted" || app.status === "under_review" || app.status === "need_documents") && (
            <button
              type="button"
              onClick={handleEditApplication}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Edit &amp; lengkapi aplikasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
