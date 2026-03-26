import { useEffect, useState } from "react";

/**
 * Tanggal mulai hitung estimasi selesai bayar — selalu "hari ini",
 * di-refresh setiap pergantian hari lokal + saat tab aktif lagi + tiap menit.
 */
export function usePaymentScheduleStartDate(): Date {
  const [start, setStart] = useState(() => new Date());

  useEffect(() => {
    const sync = () => setStart(new Date());

    const msToNextLocalMidnight = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      return Math.max(1000, next.getTime() - now.getTime());
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const armMidnight = () => {
      timeoutId = setTimeout(() => {
        sync();
        armMidnight();
      }, msToNextLocalMidnight());
    };
    armMidnight();

    const onVis = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVis);
    const everyMin = setInterval(sync, 60_000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(everyMin);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return start;
}
