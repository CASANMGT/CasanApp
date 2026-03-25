import {
  enumerateMonthsBetween,
  isClosedWeekday,
  localDayKey,
  mondayWeekdayPadding,
  sameDay,
  startOfDay,
} from "../../helpers/rtoPickupSchedule";

const WEEKDAYS_MON_FIRST = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] as const;

interface Props {
  rangeStart: Date;
  rangeEnd: Date;
  closedDays: readonly string[];
  picked: Date | null;
  onPick: (d: Date) => void;
}

function MonthGrid({
  year,
  monthIndex,
  rangeStart,
  rangeEnd,
  closedDays,
  picked,
  onPick,
}: {
  year: number;
  monthIndex: number;
  rangeStart: Date;
  rangeEnd: Date;
  closedDays: readonly string[];
  picked: Date | null;
  onPick: (d: Date) => void;
}) {
  const first = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const padBefore = mondayWeekdayPadding(first);

  const cells: ({ kind: "day"; date: Date } | { kind: "empty" })[] = [];
  for (let i = 0; i < padBefore; i++) {
    cells.push({ kind: "empty" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ kind: "day", date: new Date(year, monthIndex, d) });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ kind: "empty" });
  }

  const rs = rangeStart.getTime();
  const re = rangeEnd.getTime();

  return (
    <div className="space-y-3">
      <h3 className="text-center text-lg font-semibold capitalize tracking-tight text-gray-900">
        {first.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
      </h3>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {WEEKDAYS_MON_FIRST.map((w) => (
          <div
            key={w}
            className="pb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400"
          >
            {w}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (cell.kind === "empty") {
            return <div key={`e-${i}`} className="min-h-[44px]" />;
          }
          const { date } = cell;
          const t = startOfDay(date).getTime();
          const inRange = t >= rs && t <= re;
          const closed = isClosedWeekday(date, closedDays);
          const selectable = inRange && !closed;
          const selected = picked ? sameDay(date, picked) : false;

          return (
            <div key={localDayKey(date)} className="flex min-h-[44px] items-center justify-center p-0.5">
              <button
                type="button"
                disabled={!selectable}
                title={
                  closed
                    ? "Lokasi tutup"
                    : !inRange
                      ? "Di luar jendela pemesanan"
                      : `Pilih ${date.toLocaleDateString("id-ID")}`
                }
                onClick={() => {
                  if (!selectable) return;
                  onPick(date);
                }}
                className={[
                  "flex h-11 w-11 max-w-full items-center justify-center rounded-full text-sm font-semibold transition-all",
                  selected
                    ? "bg-[#4DB6AC] text-white shadow-md shadow-[#4DB6AC]/35 ring-2 ring-[#4DB6AC]/30"
                    : selectable
                      ? "text-gray-900 hover:bg-gray-100 active:scale-95"
                      : inRange && closed
                        ? "cursor-not-allowed text-gray-300 line-through decoration-gray-300"
                        : "cursor-default text-gray-200",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Kalender grid bergaya Calendly — bulan penuh, angka besar, Senin pertama.
 */
export default function PickupCalendlyCalendar({
  rangeStart,
  rangeEnd,
  closedDays,
  picked,
  onPick,
}: Props) {
  const rs = startOfDay(rangeStart);
  const re = startOfDay(rangeEnd);
  const months = enumerateMonthsBetween(rs, re);

  return (
    <div className="space-y-10 pb-2">
      {months.map(({ year, monthIndex }) => (
        <MonthGrid
          key={`${year}-${monthIndex}`}
          year={year}
          monthIndex={monthIndex}
          rangeStart={rs}
          rangeEnd={re}
          closedDays={closedDays}
          picked={picked}
          onPick={onPick}
        />
      ))}
    </div>
  );
}
