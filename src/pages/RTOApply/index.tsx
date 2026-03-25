import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  startApplication,
  goToStep,
} from "../../features/rto/rtoApplicationSlice";
import StepNav from "../../components/rto/StepNav";
import Step1Identity from "./Step1Identity";
import Step6Score from "./Step6Score";

interface LocationState {
  operatorId?: string;
  bikeId?: string;
  operatorName?: string;
  bikeName?: string;
  pricePerDay?: number;
}

export default function RTOApply() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navState = location.state as LocationState | null;

  const { currentStep, selectedOperatorId, operatorName, bikeName, pricePerDay } =
    useSelector((s: RootState) => s.rtoApplication);

  // Hydrate from navigation state on first mount
  useEffect(() => {
    if (navState?.operatorId && navState?.bikeId) {
      dispatch(
        startApplication({
          operatorId: navState.operatorId,
          bikeId: navState.bikeId,
          operatorName: navState.operatorName ?? "",
          bikeName: navState.bikeName ?? "",
          pricePerDay: navState.pricePerDay ?? 0,
        }),
      );
      setSearchParams({ step: "1" }, { replace: true });
    }
  }, []);

  // Sync URL ?step param -> Redux on browser back/forward
  useEffect(() => {
    const urlStep = searchParams.get("step");
    if (urlStep) {
      const n = Number(urlStep);
      if (n >= 1 && n <= 6 && n !== currentStep) {
        dispatch(goToStep(n));
      }
    }
  }, [searchParams]);

  // Sync Redux step -> URL
  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 6) {
      const urlStep = searchParams.get("step");
      if (String(currentStep) !== urlStep) {
        setSearchParams({ step: String(currentStep) }, { replace: true });
      }
    }
  }, [currentStep]);

  // If no operator selected and no nav state, redirect back
  if (!selectedOperatorId && !navState?.operatorId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Belum ada program dipilih
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Pilih program RTO terlebih dahulu dari halaman jelajahi program.
        </p>
        <button
          type="button"
          onClick={() => navigate("/rto-program-explore")}
          className="rounded-2xl bg-[#4DB6AC] px-6 py-3 text-sm font-bold text-white shadow-lg"
        >
          Jelajahi Program
        </button>
      </div>
    );
  }

  const handleStepTap = (step: number) => {
    dispatch(goToStep(step));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      dispatch(goToStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(goToStep(currentStep - 1));
    } else {
      navigate(-1);
    }
  };

  const step = currentStep >= 1 ? currentStep : 1;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">
              Ajukan Program RTO
            </h1>
            {operatorName && (
              <p className="text-[11px] text-gray-400 truncate">
                {operatorName} &middot; {bikeName}
                {pricePerDay > 0 && (
                  <> &middot; Rp {pricePerDay.toLocaleString("id-ID")}/hari</>
                )}
              </p>
            )}
          </div>
        </div>
        <StepNav currentStep={step} onStepTap={handleStepTap} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {step === 1 && <Step1Identity />}
        {step >= 2 && step <= 5 && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="text-4xl mb-3">🚧</div>
            <p className="text-sm font-semibold text-gray-500">
              Langkah {step} — Segera hadir
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Lanjut ke langkah 6 untuk submit
            </p>
          </div>
        )}
        {step === 6 && <Step6Score onBack={handleBack} />}
      </div>
    </div>
  );
}
