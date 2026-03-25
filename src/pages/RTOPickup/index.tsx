import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { updateApplicationStatus } from "../../features/rto/rtoApplicationSlice";
import {
  getOperatorById,
  getOperatorOpeningDisplay,
} from "../../data/rtoProgramExplore";
import PickupCalendlyCalendar from "../../components/rto/PickupCalendlyCalendar";
import {
  buildHourlyPickupSlots,
  DEFAULT_PICKUP_TIME_SLOTS,
  upcomingCalendarDays,
} from "../../helpers/rtoPickupSchedule";
import { rtoApplyPageBg, rtoCard } from "../RTOProgramExplore/rtoUi";

const PICKUP_DAY_RANGE = 15;

export default function RTOPickup() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const applications = useSelector((s: RootState) => s.rtoApplication.applications);

  const app = useMemo(() => {
    if (!applicationId) return undefined;
    return applications.find((a) => a.id === applicationId);
  }, [applications, applicationId]);

  const operator = useMemo(
    () => (app ? getOperatorById(app.operatorId) : undefined),
    [app],
  );
  const opening = useMemo(
    () => (operator ? getOperatorOpeningDisplay(operator) : null),
    [operator],
  );
  const closedDays = opening?.closedDays ?? [];

  const { rangeStart, rangeEnd } = useMemo(() => {
    const list = upcomingCalendarDays(PICKUP_DAY_RANGE);
    return {
      rangeStart: list[0],
      rangeEnd: list[list.length - 1],
    };
  }, []);

  const timeSlotsForDay = useMemo(() => {
    if (!opening) return DEFAULT_PICKUP_TIME_SLOTS;
    const fromOpening = buildHourlyPickupSlots(opening);
    return fromOpening.length ? fromOpening : DEFAULT_PICKUP_TIME_SLOTS;
  }, [opening]);

  const [picked, setPicked] = useState<Date | null>(null);
  const [slot, setSlot] = useState("");

  useEffect(() => {
    if (slot && !timeSlotsForDay.includes(slot)) {
      setSlot("");
    }
  }, [slot, timeSlotsForDay]);

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

  const applicantArea =
    [app.form.city, app.form.province].filter(Boolean).join(", ") || "Lokasi terdaftar";
  const venueAddress = operator?.address?.trim() || applicantArea;

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
          dealerAddress: venueAddress,
          confirmedAt: new Date().toISOString(),
          status: "scheduled",
        },
      }),
    );
    navigate(`/rto-status/${app.id}`, { replace: true });
  };

  return (
    <div className={`flex min-h-[100dvh] flex-col ${rtoApplyPageBg}`}>
      <header className="sticky top-0 z-30 border-b border-gray-200/90 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate(`/rto-status/${app.id}`)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-gray-900">Pilih tanggal &amp; jam</h1>
            <p className="text-[11px] text-gray-500">Fokus jadwal — detail ada di halaman status</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 min-h-0 flex-col gap-4 px-3 pb-8 pt-4 sm:px-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
          <div className="shrink-0 border-b border-gray-50 px-4 py-3 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Tanggal
            </p>
            <p className="mt-0.5 text-xs text-gray-500">{PICKUP_DAY_RANGE} hari ke depan</p>
          </div>
          <div className="min-h-[min(52vh,400px)] flex-1 overflow-y-auto overscroll-contain px-2 py-3 sm:min-h-[48vh] sm:px-4">
            <PickupCalendlyCalendar
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              closedDays={closedDays}
              picked={picked}
              onPick={(d) => {
                setPicked(d);
                setSlot("");
              }}
            />
          </div>
        </div>

        <div className={`${rtoCard} shrink-0 space-y-4 p-4`}>
          {picked && (
            <p className="rounded-xl border border-[#4DB6AC]/25 bg-[#4DB6AC]/8 px-3 py-2 text-center text-xs font-semibold text-[#2d7d74]">
              {picked.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Jam
            </p>
            {opening && (
              <p className="mt-1 text-[10px] leading-relaxed text-gray-400">
                {opening.timeRange}
                {closedDays.length > 0 ? ` · Libur: ${closedDays.join(", ")}` : ""}
                <span className="block">
                  Tanpa 11–13 &amp; 18.00–tutup
                </span>
              </p>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlotsForDay.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSlot(t)}
                  className={`rounded-xl border-2 py-2.5 text-center text-xs font-bold transition-colors ${
                    slot === t
                      ? "border-[#4DB6AC] bg-[#4DB6AC] text-white shadow-md shadow-[#4DB6AC]/25"
                      : "border-gray-100 bg-white text-gray-700 hover:border-[#4DB6AC]/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!picked || !slot}
            onClick={confirm}
            className="w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/30 disabled:opacity-45"
          >
            Konfirmasi jadwal
          </button>
        </div>
      </main>
    </div>
  );
}
