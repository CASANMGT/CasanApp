import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Application,
  ApplicationForm,
  ApplicationStatus,
  PickupBooking,
  ScoreBreakdown,
} from "../../types/rtoApplication";
import { EMPTY_FORM } from "../../types/rtoApplication";

interface RtoApplicationState {
  draft: Partial<ApplicationForm>;
  selectedOperatorId: string | null;
  selectedBikeId: string | null;
  operatorName: string;
  bikeName: string;
  pricePerDay: number;
  minSalary: number;
  currentStep: number;
  applications: Application[];
  activeApplicationId: string | null;
}

const LS_KEY = "rto_application_state";

function loadPersistedState(): Partial<RtoApplicationState> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return {
      draft: parsed.draft,
      selectedOperatorId: parsed.selectedOperatorId,
      selectedBikeId: parsed.selectedBikeId,
      operatorName: parsed.operatorName ?? "",
      bikeName: parsed.bikeName ?? "",
      pricePerDay: parsed.pricePerDay ?? 0,
      minSalary: parsed.minSalary ?? 0,
      currentStep: parsed.currentStep,
      applications: parsed.applications ?? [],
      activeApplicationId: parsed.activeApplicationId,
    };
  } catch {
    return {};
  }
}

const persisted = loadPersistedState();

const initialState: RtoApplicationState = {
  draft: persisted.draft ?? {},
  selectedOperatorId: persisted.selectedOperatorId ?? null,
  selectedBikeId: persisted.selectedBikeId ?? null,
  operatorName: persisted.operatorName ?? "",
  bikeName: persisted.bikeName ?? "",
  pricePerDay: persisted.pricePerDay ?? 0,
  minSalary: persisted.minSalary ?? 0,
  currentStep: persisted.currentStep ?? -1,
  applications: persisted.applications ?? [],
  activeApplicationId: persisted.activeApplicationId ?? null,
};

function generateAppId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "CASAN-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const rtoApplicationSlice = createSlice({
  name: "rtoApplication",
  initialState,
  reducers: {
    startApplication(
      state,
      action: PayloadAction<{
        operatorId: string;
        bikeId: string;
        operatorName: string;
        bikeName: string;
        pricePerDay: number;
        minSalary?: number;
      }>,
    ) {
      const { operatorId, bikeId, operatorName, bikeName, pricePerDay, minSalary } =
        action.payload;
      state.selectedOperatorId = operatorId;
      state.selectedBikeId = bikeId;
      state.operatorName = operatorName;
      state.bikeName = bikeName;
      state.pricePerDay = pricePerDay;
      state.minSalary = minSalary ?? 0;
      state.currentStep = 1;
      if (!state.draft.fullName) {
        state.draft = { ...EMPTY_FORM };
      }
    },

    updateDraft(state, action: PayloadAction<Partial<ApplicationForm>>) {
      state.draft = { ...state.draft, ...action.payload };
    },

    goToStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },

    submitApplication(state, action: PayloadAction<ScoreBreakdown>) {
      const score = action.payload;
      const form = { ...EMPTY_FORM, ...state.draft } as ApplicationForm;
      const app: Application = {
        id: generateAppId(),
        operatorId: state.selectedOperatorId ?? "",
        bikeId: state.selectedBikeId ?? "",
        operatorName: state.operatorName,
        bikeName: state.bikeName,
        pricePerDay: state.pricePerDay,
        minSalary: state.minSalary > 0 ? state.minSalary : undefined,
        form,
        score,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };
      state.applications.push(app);
      state.activeApplicationId = app.id;
      state.draft = {};
      state.currentStep = -1;
    },

    updateApplicationStatus(
      state,
      action: PayloadAction<{
        id: string;
        status: ApplicationStatus;
        reviewerNote?: string;
        requestedDocIds?: string[] | null;
        rejectionReason?: string;
        rejectionCooldownUntil?: string;
        pickup?: PickupBooking | null;
      }>,
    ) {
      const app = state.applications.find((a) => a.id === action.payload.id);
      if (!app) return;
      app.status = action.payload.status;
      app.lastUpdatedAt = new Date().toISOString();
      if (action.payload.reviewerNote !== undefined)
        app.reviewerNote = action.payload.reviewerNote;
      if (action.payload.requestedDocIds !== undefined)
        app.requestedDocIds =
          action.payload.requestedDocIds === null
            ? undefined
            : action.payload.requestedDocIds;
      if (action.payload.rejectionReason !== undefined)
        app.rejectionReason = action.payload.rejectionReason;
      if (action.payload.rejectionCooldownUntil !== undefined)
        app.rejectionCooldownUntil = action.payload.rejectionCooldownUntil;
      if (action.payload.pickup !== undefined)
        app.pickup =
          action.payload.pickup === null ? undefined : action.payload.pickup;
    },

    resumeApplicationEdit(state, action: PayloadAction<string>) {
      const app = state.applications.find((a) => a.id === action.payload);
      if (!app) return;
      state.draft = { ...app.form };
      state.selectedOperatorId = app.operatorId;
      state.selectedBikeId = app.bikeId;
      state.operatorName = app.operatorName;
      state.bikeName = app.bikeName;
      state.pricePerDay = app.pricePerDay;
      state.minSalary = app.minSalary ?? 0;
      state.currentStep = 1;
      state.activeApplicationId = app.id;
    },

    resetDraft(state) {
      state.draft = {};
      state.selectedOperatorId = null;
      state.selectedBikeId = null;
      state.operatorName = "";
      state.bikeName = "";
      state.pricePerDay = 0;
      state.minSalary = 0;
      state.currentStep = -1;
    },
  },
});

export const {
  startApplication,
  updateDraft,
  goToStep,
  submitApplication,
  updateApplicationStatus,
  resumeApplicationEdit,
  resetDraft,
} = rtoApplicationSlice.actions;

export default rtoApplicationSlice.reducer;

/** Call in store.subscribe() to persist state to localStorage */
export function persistRtoApplication(
  state: ReturnType<typeof rtoApplicationSlice.reducer>,
) {
  try {
    const serializable = {
      draft: state.draft,
      selectedOperatorId: state.selectedOperatorId,
      selectedBikeId: state.selectedBikeId,
      operatorName: state.operatorName,
      bikeName: state.bikeName,
      pricePerDay: state.pricePerDay,
      minSalary: state.minSalary,
      currentStep: state.currentStep,
      applications: state.applications,
      activeApplicationId: state.activeApplicationId,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(serializable));
  } catch {
    /* storage full — silent */
  }
}
