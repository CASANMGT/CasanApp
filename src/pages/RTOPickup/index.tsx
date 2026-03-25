import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { updateApplicationStatus } from "../../features/rto/rtoApplicationSlice";
import { openGoogleMapsSearch } from "../../helpers/linking";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

/**
 * First selectable day is tomorrow. Returns at least `minDays` slots, then every day
 * through the last day of the *next* calendar month so the strip always includes
 * upcoming-month dates (not only the current month).
 */
function upcomingPickupDays(minDays = 14): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);

  const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  endOfNextMonth.setHours(0, 0, 0, 0);

  const out: Date[] = [];
  while (out.length < minDays) {
    out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (out.length > 180) return out;
  }
  while (cursor.getTime() <= endOfNextMonth.getTime()) {
    out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (out.length > 180) break;
  }
  return out;
}

function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date | null): boolean {
  if (!b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function RTOPickup() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((s: RootState) => s.rtoApplication.applications);

  const app = useMemo(() => {
    if (!applicationId) return undefined;
    return applications.find((a) => a.id === applicationId);
  }, [applications, applicationId]);

  const days = useMemo(() => upcomingPickupDays(14), []);
  const [picked, setPicked] = useState<Date | null>(null);
  const [slot, setSlot] = useState("");

  if (!app) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <p className="text-sm text-gray-600">Aplikasi tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => navigate("/home/index")}
          className="mt-4 rounded-2xl bg-[#4DB6AC] px-6 py-3 text-sm font-bold text-white"
        >
          Beranda
        </button>
      </div>
    );
  }

  const canSchedule = app.status === "approved" || app.status === "pickup_scheduled";
  if (!canSchedule) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <p className="text-sm text-gray-600">Jadwal hanya untuk aplikasi yang disetujui.</p>
        <button
          type="button"
          onClick={() => navigate(`/rto-status/${app.id}`)}
          className="mt-4 rounded-2xl bg-[#4DB6AC] px-6 py-3 text-sm font-bold text-white"
        >
          Status aplikasi
        </button>
      </div>
    );
  }

  const dealerLine = [app.form.city, app.form.province].filter(Boolean).join(", ") || "Lokasi dealer";

  const confirm = () => {
    if (!picked || !slot) return;
    const iso = `${picked.getFullYear()}-${String(picked.getMonth() + 1).padStart(2, "0")}-${String(picked.getDate()).padStart(2, "0")}`;
    dispatch(
      updateApplicationStatus({
        id: app.id,
        status: "pickup_scheduled",
        pickup: {
          date: iso,
          timeSlot: slot,
          dealerName: app.operatorName,
          dealerAddress: dealerLine,
          confirmedAt: new Date().toISOString(),
          status: "scheduled",
        },
      }),
    );
    navigate(`/rto-status/${app.id}`, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(`/rto-status/${app.id}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold text-gray-900">Jadwal ambil motor</h1>
            <p className="truncate text-[11px] text-gray-400">{app.bikeName}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 space-y-4 px-4 py-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-800">{app.operatorName}</p>
          <p className="mt-1 text-[11px] text-gray-500">{dealerLine}</p>
          <button
            type="button"
            onClick={() => openGoogleMapsSearch(`${app.operatorName} ${dealerLine}`)}
            className="mt-2 text-xs font-semibold text-[#4DB6AC]"
          >
            Buka di Google Maps
          </button>
        </div>

        <section>
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Pilih tanggal
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {days.map((d) => {
              const sel = sameDay(d, picked);
              const label = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
              return (
                <button
                  key={localDayKey(d)}
                  type="button"
                  onClick={() => setPicked(d)}
                  className={`shrink-0 rounded-xl border-2 px-3 py-2 text-center text-xs font-semibold ${
                    sel ? "border-[#4DB6AC] bg-[#4DB6AC]/10 text-[#3d9a91]" : "border-gray-100 bg-white text-gray-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Pilih jam
          </h2>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSlot(t)}
                className={`rounded-full border-2 px-4 py-2 text-xs font-bold ${
                  slot === t ? "border-[#4DB6AC] bg-[#4DB6AC] text-white" : "border-gray-100 bg-white text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          disabled={!picked || !slot}
          onClick={confirm}
          className="w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/25 disabled:opacity-45"
        >
          Konfirmasi jadwal
        </button>
      </div>
    </div>
  );
}
