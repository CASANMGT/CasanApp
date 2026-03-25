import { useEffect, useRef } from "react";
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
import {
  formatRtoCooldownDeadlineId,
  gateRtoApplicationFromProgramBrowse,
} from "../../helpers";
import type { RtoApplyGateResult } from "../../helpers";
import StepNav, { RTO_APPLY_STEP_LABELS } from "../../components/rto/StepNav";
import { rtoApplyPageBg, rtoCard } from "../RTOProgramExplore/rtoUi";
import Step1Identity from "./Step1Identity";
import Step2Employment from "./Step2Employment";
import Step3Family from "./Step3Family";
import Step4Credit from "./Step4Credit";
import Step5Documents from "./Step5Documents";
import Step6Score from "./Step6Score";

interface LocationState {
  operatorId?: string;
  bikeId?: string;
  operatorName?: string;
  bikeName?: string;
  pricePerDay?: number;
  minSalary?: number;
  /** Set when continuing edit from status — skips one-program / cooldown gates */
  __resume?: boolean;
}

export default function RTOApply() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navState = location.state as LocationState | null;

  const { currentStep, selectedOperatorId, operatorName, bikeName, pricePerDay, applications } =
    useSelector((s: RootState) => s.rtoApplication);

  const resumeFromStatus = Boolean(navState?.__resume);
  const browseGate: RtoApplyGateResult | null =
    navState?.operatorId && navState?.bikeId && !resumeFromStatus
      ? gateRtoApplicationFromProgramBrowse(
          applications,
          { operatorId: navState.operatorId, bikeId: navState.bikeId },
          { bypassForResume: false },
        )
      : null;

  const rtoHydratedRef = useRef(false);

  useEffect(() => {
    if (!browseGate || browseGate.ok) return;
    if (browseGate.reason !== "same_program_use_status") return;
    navigate(`/rto-status/${browseGate.applicationId}`, { replace: true });
  }, [browseGate, navigate]);

  // Hydrate from navigation state once (resume or gated-ok browse)
  useEffect(() => {
    if (rtoHydratedRef.current) return;
    if (!navState?.operatorId || !navState?.bikeId) return;
    if (!resumeFromStatus) {
      const gate = gateRtoApplicationFromProgramBrowse(
        applications,
        { operatorId: navState.operatorId, bikeId: navState.bikeId },
        { bypassForResume: false },
      );
      if (!gate.ok) return;
    }
    rtoHydratedRef.current = true;
    dispatch(
      startApplication({
        operatorId: navState.operatorId,
        bikeId: navState.bikeId,
        operatorName: navState.operatorName ?? "",
        bikeName: navState.bikeName ?? "",
        pricePerDay: navState.pricePerDay ?? 0,
        minSalary: navState.minSalary ?? 0,
      }),
    );
    setSearchParams({ step: "1" }, { replace: true });
  }, [applications, dispatch, navState, resumeFromStatus, setSearchParams]);

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

  const shareWaHref =
    navState?.operatorName && navState?.bikeName
      ? `https://wa.me/?text=${encodeURIComponent(
          `Cek program RTO "${navState.operatorName}"!\n\n🛵 ${navState.bikeName}\n\nInfo & ajukan lewat app CASAN — Rent to Own.`,
        )}`
      : null;

  if (browseGate && !browseGate.ok && browseGate.reason === "same_program_use_status") {
    return (
      <div className={`flex min-h-svh flex-col items-center justify-center px-6 text-center ${rtoApplyPageBg}`}>
        <div className={`${rtoCard} px-8 py-10`}>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary10 text-2xl">
            ⏳
          </div>
          <p className="text-sm font-medium text-gray-700">Mengalihkan ke status pengajuan…</p>
        </div>
      </div>
    );
  }

  if (browseGate && !browseGate.ok) {
    const g = browseGate;
    return (
      <div className={`flex min-h-svh flex-col ${rtoApplyPageBg}`}>
        <header className="bg-gradient-to-br from-[#4DB6AC] via-[#45a89e] to-[#3a9a90] px-4 pb-12 pt-10 text-white shadow-lg shadow-[#4DB6AC]/15 rounded-b-[28px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/18 backdrop-blur-sm transition-colors hover:bg-white/28"
            aria-label="Kembali"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="mt-6 text-xl font-bold leading-tight">
            {g.reason === "cooldown" && "Belum bisa mengajukan"}
            {g.reason === "active_other_program" && "Satu pengajuan aktif"}
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/88">
            {g.reason === "cooldown" && "Program ini memerlukan jeda sebelum pengajuan baru."}
            {g.reason === "active_other_program" && "Selesaikan pengajuan yang berjalan terlebih dahulu."}
          </p>
        </header>
        <div className="mx-auto -mt-8 w-full max-w-lg flex-1 px-4 pb-10">
          <div className={`${rtoCard} p-6`}>
            {g.reason === "cooldown" && (
              <p className="text-sm leading-relaxed text-gray-600">
                Pengajuan RTO baru bisa dilakukan lagi setelah{" "}
                <span className="font-semibold text-gray-900">
                  {formatRtoCooldownDeadlineId(g.cooldownUntil)}
                </span>
                . Kamu tetap bisa melihat katalog atau membagikan program ke teman.
              </p>
            )}
            {g.reason === "active_other_program" && (
              <p className="text-sm leading-relaxed text-gray-600">
                <span className="font-semibold text-gray-900">{g.blocking.bikeName}</span>{" "}
                ({g.blocking.operatorName}) masih aktif di akunmu.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3">
              {shareWaHref && (
                <a
                  href={shareWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-md shadow-green/20"
                >
                  Bagikan ke teman (WhatsApp)
                </a>
              )}
              <button
                type="button"
                onClick={() =>
                  g.reason === "active_other_program"
                    ? navigate(`/rto-status/${g.blocking.id}`)
                    : navigate("/rto-program-explore")
                }
                className="w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/25"
              >
                {g.reason === "active_other_program" ? "Lihat status pengajuan" : "Kembali jelajahi program"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no operator selected and no nav state, redirect back
  if (!selectedOperatorId && !navState?.operatorId) {
    return (
      <div className={`flex min-h-svh flex-col ${rtoApplyPageBg}`}>
        <header className="bg-gradient-to-br from-[#4DB6AC] via-[#45a89e] to-[#3a9a90] rounded-b-[28px] px-4 pb-14 pt-10 text-center shadow-lg shadow-[#4DB6AC]/20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/18 text-3xl backdrop-blur-md">
            📋
          </div>
          <h1 className="mt-5 text-lg font-bold text-white">Belum ada program dipilih</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-white/85">
            Mulai dari halaman jelajahi program untuk memilih motor dan dealer.
          </p>
        </header>
        <div className="mx-auto -mt-10 w-full max-w-lg px-4">
          <div className={`${rtoCard} p-6 text-center`}>
            <button
              type="button"
              onClick={() => navigate("/rto-program-explore")}
              className="w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4DB6AC]/30"
            >
              Jelajahi program RTO
            </button>
            <button
              type="button"
              onClick={() => navigate("/home/index")}
              className="mt-3 w-full py-2 text-sm font-semibold text-gray-500"
            >
              Kembali ke beranda
            </button>
          </div>
        </div>
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
  const stepTitle = RTO_APPLY_STEP_LABELS[step - 1] ?? RTO_APPLY_STEP_LABELS[0];

  return (
    <div className={`flex min-h-svh flex-col ${rtoApplyPageBg}`}>
      <div className="sticky top-0 z-40">
        <header className="bg-gradient-to-br from-[#4DB6AC] via-[#45a89e] to-[#3a9a90] px-4 pb-6 pt-9 shadow-md shadow-[#4DB6AC]/20 sm:rounded-b-[26px]">
          <div className="mx-auto flex max-w-lg items-start gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition-colors hover:bg-white/28"
              aria-label="Kembali"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">Pengajuan RTO</p>
              <h1 className="mt-1 text-[20px] font-bold leading-snug tracking-tight text-white">{stepTitle}</h1>
              {(operatorName || bikeName) && (
                <p className="mt-2 truncate text-xs text-white/88">
                  <span className="font-semibold">{operatorName}</span>
                  {bikeName && (
                    <>
                      <span className="text-white/50"> · </span>
                      {bikeName}
                    </>
                  )}
                  {pricePerDay > 0 && (
                    <>
                      <span className="text-white/50"> · </span>
                      Rp {pricePerDay.toLocaleString("id-ID")}/hari
                    </>
                  )}
                </p>
              )}
              <span className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25">
                Langkah {step} dari 6
              </span>
            </div>
          </div>
        </header>
        <div className="mx-auto w-full max-w-lg -mt-1">
          <StepNav currentStep={step} onStepTap={handleStepTap} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-lg">
          {step === 1 && <Step1Identity />}
          {step === 2 && <Step2Employment />}
          {step === 3 && <Step3Family />}
          {step === 4 && <Step4Credit />}
          {step === 5 && <Step5Documents />}
          {step === 6 && <Step6Score onBack={handleBack} />}
        </div>
      </div>
    </div>
  );
}
