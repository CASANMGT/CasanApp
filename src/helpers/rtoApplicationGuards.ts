import type { Application, ApplicationStatus } from "../types/rtoApplication";

/** Statuses that mean the user still “has” a program on this account (only one allowed). */
export const RTO_ACTIVE_PROGRAM_STATUSES: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "need_documents",
  "approved",
  "pickup_scheduled",
  "pickup_done",
];

export function getActiveRtoProgram(applications: Application[]): Application | undefined {
  return applications.find((a) => RTO_ACTIVE_PROGRAM_STATUSES.includes(a.status));
}

/** Latest post-rejection cooldown end among rejected apps still inside the window. */
export function getLatestRejectionCooldownUntil(applications: Application[]): Date | null {
  const now = Date.now();
  let max = 0;
  for (const a of applications) {
    if (a.status !== "rejected" || !a.rejectionCooldownUntil) continue;
    const t = new Date(a.rejectionCooldownUntil).getTime();
    if (t > now) max = Math.max(max, t);
  }
  return max > 0 ? new Date(max) : null;
}

export type RtoApplyGateResult =
  | { ok: true }
  | { ok: false; reason: "cooldown"; cooldownUntil: Date }
  | { ok: false; reason: "active_other_program"; blocking: Application }
  | { ok: false; reason: "same_program_use_status"; applicationId: string };

/**
 * Rules when opening the apply flow from program browse (not resume-edit from status).
 * - After rejection: no new application until `rejectionCooldownUntil` (e.g. 30 days).
 * - One active program per account; cannot open a second program while another is in the pipeline.
 * - Same program still in progress: use status page, not a new form.
 */
export function gateRtoApplicationFromProgramBrowse(
  applications: Application[],
  target: { operatorId: string; bikeId: string },
  options: { bypassForResume: boolean },
): RtoApplyGateResult {
  if (options.bypassForResume) return { ok: true };

  const cooldownUntil = getLatestRejectionCooldownUntil(applications);
  if (cooldownUntil) {
    return { ok: false, reason: "cooldown", cooldownUntil };
  }

  const active = getActiveRtoProgram(applications);
  if (active) {
    const same =
      active.operatorId === target.operatorId && active.bikeId === target.bikeId;
    if (same) {
      return { ok: false, reason: "same_program_use_status", applicationId: active.id };
    }
    return { ok: false, reason: "active_other_program", blocking: active };
  }

  return { ok: true };
}

export function formatRtoCooldownDeadlineId(d: Date): string {
  try {
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d.toISOString();
  }
}
