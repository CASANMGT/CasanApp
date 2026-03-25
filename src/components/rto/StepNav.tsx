const STEP_LABELS = [
  "Data Diri",
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
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto px-4 py-3 scrollbar-none"
      role="tablist"
      aria-label="Langkah formulir"
    >
      {STEP_LABELS.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;

        return (
          <button
            key={step}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onStepTap?.(step)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-[#4DB6AC] text-white shadow-sm"
                : isDone
                  ? "bg-[#4DB6AC]/10 text-[#4DB6AC]"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                isActive
                  ? "bg-white/25 text-white"
                  : isDone
                    ? "bg-[#4DB6AC]/20 text-[#4DB6AC]"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : step}
            </span>
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StepNav;
