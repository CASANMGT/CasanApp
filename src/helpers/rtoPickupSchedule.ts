import type { RTOExploreOpeningHours } from "../data/rtoProgramExplore";

/** Nama hari dalam bahasa Indonesia — indeks = Date.getDay() */
export const ID_WEEKDAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
] as const;

export function getIndonesianWeekdayName(d: Date): string {
  return ID_WEEKDAY_NAMES[d.getDay()];
}

/** Tanggal lokal YYYY-MM-DD */
export function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function sameDay(a: Date, b: Date | null): boolean {
  if (!b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Senin = kolom pertama (0). */
export function mondayWeekdayPadding(firstOfMonth: Date): number {
  const js = firstOfMonth.getDay();
  return js === 0 ? 6 : js - 1;
}

export function enumerateMonthsBetween(
  rangeStart: Date,
  rangeEnd: Date,
): { year: number; monthIndex: number }[] {
  const out: { year: number; monthIndex: number }[] = [];
  let y = rangeStart.getFullYear();
  let m = rangeStart.getMonth();
  const endY = rangeEnd.getFullYear();
  const endM = rangeEnd.getMonth();
  while (y < endY || (y === endY && m <= endM)) {
    out.push({ year: y, monthIndex: m });
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return out;
}

/**
 * `count` hari kalender berturut-turut mulai besok (hari ini + 1).
 */
export function upcomingCalendarDays(count: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() + 1);
  const out: Date[] = [];
  for (let i = 0; i < count; i++) {
    out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function isClosedWeekday(d: Date, closedDays: readonly string[]): boolean {
  if (!closedDays.length) return false;
  const name = getIndonesianWeekdayName(d);
  return closedDays.some((c) => c.trim().toLowerCase() === name.toLowerCase());
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function minutesToHHMM(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function slotLabelToMinutes(slot: string): number {
  const m = slot.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return Number.NaN;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (!Number.isFinite(h) || !Number.isFinite(min)) return Number.NaN;
  return h * 60 + min;
}

/** Makan siang: 11:00 s.d. sebelum 13:00 (1 siang). */
function isLunchHandoverBlackout(slot: string): boolean {
  const mins = slotLabelToMinutes(slot);
  if (Number.isNaN(mins)) return true;
  return mins >= 11 * 60 && mins < 13 * 60;
}

/** Makan malam: dari 18:00 sampai tutup (slot ≥ 18:00 dikecualikan). */
function isDinnerHandoverBlackout(slot: string): boolean {
  const mins = slotLabelToMinutes(slot);
  if (Number.isNaN(mins)) return true;
  return mins >= 18 * 60;
}

/**
 * Hapus slot di jendela istirahat dealer: makan siang & malam.
 */
export function filterHandoverBlackoutSlots(slots: string[]): string[] {
  return slots.filter((s) => !isLunchHandoverBlackout(s) && !isDinnerHandoverBlackout(s));
}

/**
 * Ambil rentang buka–tutup dari teks seperti "08:00–20:00 WIB" atau "08:00 - 19:00".
 */
export function parseOpeningTimeRange(
  timeRange: string,
): { startMin: number; endMin: number } | null {
  const cleaned = timeRange.replace(/\s*WIB\s*$/i, "").trim();
  const m = cleaned.match(
    /(\d{1,2}):(\d{2})\s*[\-–—]\s*(\d{1,2}):(\d{2})/,
  );
  if (!m) return null;
  const h1 = parseInt(m[1], 10);
  const min1 = parseInt(m[2], 10);
  const h2 = parseInt(m[3], 10);
  const min2 = parseInt(m[4], 10);
  if (
    [h1, min1, h2, min2].some((x) => !Number.isFinite(x)) ||
    h1 > 23 ||
    h2 > 23 ||
    min1 > 59 ||
    min2 > 59
  ) {
    return null;
  }
  const startMin = h1 * 60 + min1;
  const endMin = h2 * 60 + min2;
  if (endMin <= startMin) return null;
  return { startMin, endMin };
}

/**
 * Slot tiap jam mulai dari jam buka (dibundel ke jam penuh berikutnya jika buka :30)
 * sampai sebelum jam tutup (slot terakhir &lt; tutup).
 */
export function buildHourlyPickupSlots(opening: RTOExploreOpeningHours): string[] {
  const parsed = parseOpeningTimeRange(opening.timeRange);
  if (!parsed) return [];

  let t = Math.ceil(parsed.startMin / 60) * 60;
  const slots: string[] = [];
  while (t < parsed.endMin) {
    slots.push(minutesToHHMM(t));
    t += 60;
  }
  return filterHandoverBlackoutSlots(slots);
}

/** Fallback bila jam buka operator tidak ter-parse; tetap difilter istirahat. */
export const DEFAULT_PICKUP_TIME_SLOTS = filterHandoverBlackoutSlots([
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
]);
