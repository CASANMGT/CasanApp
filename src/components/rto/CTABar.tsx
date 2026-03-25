interface Props {
  primaryLabel: string;
  onPrimary: () => void;
  onBack?: () => void;
  backLabel?: string;
  disabled?: boolean;
}

const CTABar: React.FC<Props> = ({
  primaryLabel,
  onPrimary,
  onBack,
  backLabel = "Kembali",
  disabled = false,
}) => {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 flex justify-center">
      <div className="pointer-events-auto w-full max-w-lg border-t border-gray-200/90 bg-white/95 p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md rounded-t-2xl safe-area-pb">
        <div className="mx-auto flex max-w-lg gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-12 items-center justify-center rounded-2xl border-2 border-gray-200 px-5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              {backLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onPrimary}
            disabled={disabled}
            className="min-h-12 flex-1 rounded-2xl bg-[#4DB6AC] text-base font-bold text-white shadow-lg shadow-[#4DB6AC]/30 transition-transform active:scale-[0.99] hover:bg-[#45a89e] disabled:opacity-50 disabled:shadow-none"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTABar;
