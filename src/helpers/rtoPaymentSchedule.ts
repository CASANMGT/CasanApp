import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

/**
 * Estimasi tanggal selesai RTO: N hari bayar (mis. 300).
 * Sabtu & Minggu tidak dihitung (sama konsep Minggu & libur GRATIS di jadwal).
 * startFrom = hari mulai hitung (biasanya hari ini) → estimasi berubah tiap hari.
 */
export function estimateRtoFinishExcludingWeekends(
  totalPaymentDays: number,
  startFrom: Date = new Date(),
): dayjs.Dayjs {
  if (totalPaymentDays <= 0) return dayjs(startFrom).startOf("day");
  let counted = 0;
  let d = dayjs(startFrom).startOf("day");
  while (counted < totalPaymentDays) {
    const dow = d.day();
    if (dow === 0 || dow === 6) {
      d = d.add(1, "day");
      continue;
    }
    counted += 1;
    if (counted < totalPaymentDays) d = d.add(1, "day");
  }
  return d;
}

export function formatRtoEstimatedFinishId(d: dayjs.Dayjs): string {
  return d.format("dddd, D MMMM YYYY");
}
