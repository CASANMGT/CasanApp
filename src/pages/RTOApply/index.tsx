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
import StepNav from "../../components/rto/StepNav";
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <p className="text-sm text-gray-600">Mengalihkan ke halaman status pengajuan…</p>
      </div>
    );
  }

  if (browseGate && !browseGate.ok) {
    const g = browseGate;
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <div className="sticky top-0 z-30 border-b border-gray-100 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
            aria-label="Kembali"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-8">
          <h1 className="text-lg font-bold text-gray-900">
            {g.reason === "cooldown" && "Belum bisa mengajukan program ini"}
            {g.reason === "active_other_program" && "Satu akun, satu pengajuan aktif"}
          </h1>
          {g.reason === "cooldown" && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Pengajuan RTO baru bisa dilakukan lagi setelah{" "}
              <span className="font-semibold text-gray-900">
                {formatRtoCooldownDeadlineId(g.cooldownUntil)}
              </span>
              . Kamu bisa melihat katalog program atau membagikan info ke teman.
            </p>
          )}
          {g.reason === "active_other_program" && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Selesaikan dulu pengajuan yang sedang berjalan:{" "}
              <span className="font-semibold text-gray-900">
                {g.blocking.bikeName}
              </span>{" "}
              ({g.blocking.operatorName}). Tidak bisa membuka form pengajuan kedua untuk program lain
              dalam akun yang sama.
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3">
            {shareWaHref && (
              <a
                href={shareWaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white"
              >
                Bagikan program ke teman (WhatsApp)
              </a>
            )}
            <button
              type="button"
              onClick={() =>
                g.reason === "active_other_program"
                  ? navigate(`/rto-status/${g.blocking.id}`)
                  : navigate("/rto-program-explore")
              }
              className="w-full rounded-2xl bg-[#4DB6AC] py-3.5 text-sm font-bold text-white shadow-lg"
            >
              {g.reason === "active_other_program" ? "Lihat status pengajuan" : "Kembali ke jelajahi"}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        {step === 2 && <Step2Employment />}
        {step === 3 && <Step3Family />}
        {step === 4 && <Step4Credit />}
        {step === 5 && <Step5Documents />}
        {step === 6 && <Step6Score onBack={handleBack} />}
      </div>
    </div>
  );
}
