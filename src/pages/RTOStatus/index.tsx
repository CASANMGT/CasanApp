import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState } from "../../store";
import type { Application } from "../../types/rtoApplication";
import { openWhatsApp } from "../../helpers/linking";
import { CUSTOMER_SERVICES } from "../../common";

const STATUS_STEPS = [
  { label: "Terkirim", key: "submitted" },
  { label: "Sedang Direview", key: "under_review" },
  { label: "Keputusan", key: "decided" },
  { label: "Ambil Motor", key: "pickup" },
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
      return { text: "Aplikasi Terkirim", color: "text-blue-600" };
    case "under_review":
      return { text: "Sedang Direview", color: "text-blue-600" };
    case "need_documents":
      return { text: "Dokumen Tambahan Diperlukan", color: "text-amber-600" };
    case "approved":
      return { text: "Disetujui!", color: "text-green-600" };
    case "rejected":
      return { text: "Tidak Disetujui", color: "text-red-600" };
    case "pickup_scheduled":
      return { text: "Pickup Terjadwal", color: "text-teal-600" };
    default:
      return { text: "Diproses", color: "text-gray-600" };
  }
}

export default function RTOStatus() {
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();
  const { applications, activeApplicationId } = useSelector(
    (s: RootState) => s.rtoApplication,
  );

  // Find the application — "latest" means most recent
  let app: Application | undefined;
  if (applicationId === "latest") {
    app = applications[applications.length - 1];
  } else {
    app = applications.find((a) => a.id === applicationId);
  }

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Aplikasi tidak ditemukan
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          ID: {applicationId}
        </p>
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
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
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900">Status Aplikasi</h1>
            <p className="text-[11px] text-gray-400 font-mono">{app.id}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-6 space-y-6">
        {/* Status hero */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">
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
          <h2 className={`text-lg font-bold ${statusInfo.color}`}>
            {statusInfo.text}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {app.status === "submitted" || app.status === "under_review"
              ? "Kami sedang memeriksa data kamu."
              : app.status === "approved"
                ? "Selamat! Jadwalkan pengambilan motor."
                : app.status === "rejected"
                  ? "Silakan coba lagi setelah 30 hari."
                  : "Proses aplikasi kamu sedang berlangsung."}
          </p>
        </div>

        {/* Timeline */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
            Status Timeline
          </h3>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i < activeIdx;
              const isCurrent = i === activeIdx;

              return (
                <div key={step.key} className="flex gap-3">
                  {/* Dot + connector line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? "border-[#4DB6AC] bg-[#4DB6AC] text-white"
                          : isCurrent
                            ? "border-[#4DB6AC] bg-white text-[#4DB6AC] animate-pulse"
                            : "border-gray-200 bg-gray-50 text-gray-300"
                      }`}
                    >
                      {isDone ? "✓" : ""}
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 min-h-[24px] ${isDone ? "bg-[#4DB6AC]" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pb-4 pt-0.5">
                    <p
                      className={`text-xs font-semibold ${
                        isDone || isCurrent ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {i === 0 && app.submittedAt && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {formatDate(app.submittedAt)}
                      </p>
                    )}
                    {isCurrent && i > 0 && (
                      <p className="text-[10px] text-[#4DB6AC] mt-0.5">
                        Sedang berlangsung...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Score summary */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
            Skor Kamu
          </h3>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex items-center gap-4">
            <div className="text-3xl font-black tabular-nums text-gray-900">
              {app.score.total}
              <span className="text-sm font-semibold text-gray-400">/100</span>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4DB6AC]"
                  style={{ width: `${app.score.total}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Program info */}
        <section>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
            Program
          </h3>
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4DB6AC]/10 text-lg">
              🛵
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {app.bikeName || "Motor Listrik"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {app.operatorName}
                {app.pricePerDay > 0 && (
                  <> &middot; Rp {app.pricePerDay.toLocaleString("id-ID")}/hari</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <div className="space-y-3 pb-8">
          <button
            type="button"
            onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
            className="w-full rounded-2xl border-2 border-[#4DB6AC]/30 bg-white py-3.5 text-sm font-bold text-[#4DB6AC] transition-colors hover:bg-[#4DB6AC]/5"
          >
            📱 Hubungi Dealer via WhatsApp
          </button>

          {(app.status === "submitted" || app.status === "under_review") && (
            <button
              type="button"
              onClick={() =>
                navigate("/rto-apply?step=1", {
                  state: {
                    operatorId: app.operatorId,
                    bikeId: app.bikeId,
                    operatorName: app.operatorName,
                    bikeName: app.bikeName,
                    pricePerDay: app.pricePerDay,
                  },
                })
              }
              className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
            >
              ✏️ Edit & Lengkapi Aplikasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
