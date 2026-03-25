export const RTO_APPLY_STEP_LABELS = [
  "Data diri",
  "Pekerjaan",
  "Keluarga",
  "Kredit",
  "Dokumen",
  "Skor",
];

interface Props {
  currentStep: number;
  onStepTap?: (step: number) => void;
}

const StepNav: React.FC<Props> = ({ currentStep, onStepTap }) => {
  const total = RTO_APPLY_STEP_LABELS.length;
  const pct = Math.min(100, Math.max(0, (currentStep / total) * 100));

  return (
    <div className="border-b border-gray-100/90 bg-white/98 backdrop-blur-md">
      <div
        className="h-0.5 bg-gray-100"
        aria-hidden
      >
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-[#4DB6AC] to-primary70 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Grid on narrow screens = all 6 steps visible (2×3); flex wrap on wider = no clipped steps */}
      <div
        className="grid grid-cols-3 gap-x-1 gap-y-2 px-2 py-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-2 sm:px-3"
        role="tablist"
        aria-label="Langkah formulir"
      >
        {RTO_APPLY_STEP_LABELS.map((label, i) => {
          const step = i + 1;
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          const isFuture = step > currentStep;

          return (
            <button
              key={step}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isFuture}
              disabled={isFuture}
              title={
                isFuture
                  ? `Selesaikan langkah ${currentStep} dulu`
                  : `Langkah ${step}: ${label}`
              }
              onClick={() => {
                if (isFuture) return;
                onStepTap?.(step);
              }}
              className={`flex min-w-0 w-full sm:w-auto sm:shrink-0 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-semibold leading-tight transition-all sm:px-2.5 sm:text-[11px] ${
                isFuture
                  ? "cursor-not-allowed bg-gray-100/60 text-gray-300 opacity-70"
                  : isActive
                    ? "bg-[#4DB6AC] text-white shadow-md shadow-[#4DB6AC]/25"
                    : isDone
                      ? "bg-[#4DB6AC]/12 text-[#2d8a7d] ring-1 ring-[#4DB6AC]/20"
                      : "bg-gray-100/90 text-gray-400"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-white/25 text-white"
                    : isDone
                      ? "bg-white text-[#327478]"
                      : "bg-gray-200/80 text-gray-400"
                }`}
              >
                {isDone ? "✓" : step}
              </span>
              <span className="min-w-0 truncate text-left sm:max-w-[6.5rem]">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepNav;
