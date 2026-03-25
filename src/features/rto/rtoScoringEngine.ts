import type { ApplicationForm, ScoreBreakdown } from "../../types/rtoApplication";

/**
 * Pure scoring engine — 100 pts across 6 dimensions.
 * Matches PRD FR-09 thresholds.
 */
export function calculateScore(
  form: Partial<ApplicationForm>,
  minSalary: number,
): ScoreBreakdown {
  const identity = scoreIdentity(form);
  const income = scoreIncome(form, minSalary);
  const employment = scoreEmployment(form);
  const family = scoreFamily(form);
  const credit = scoreCredit(form);
  const documents = scoreDocuments(form);
  const total = identity + income + employment + family + credit + documents;

  return { identity, income, employment, family, credit, documents, total };
}

// ─── Identity (max 18) ──────────────────────────────────────────

function scoreIdentity(f: Partial<ApplicationForm>): number {
  let pts = 0;

  if ((f.fullName ?? "").trim().length >= 3) pts += 3;
  if (/^\d{16}$/.test(f.nik ?? "")) pts += 3;

  const age = f.birthDate ? getAge(f.birthDate) : 0;
  if (age >= 21 && age <= 55) pts += 3;
  else if (age >= 18 && age <= 60) pts += 1;

  if ((f.address ?? "").trim().length >= 5) pts += 2;
  if ((f.subdistrict ?? "").trim()) pts += 1;
  if ((f.city ?? "").trim()) pts += 1;
  if ((f.province ?? "").trim()) pts += 1;

  if (f.housingStatus === "own") pts += 2;
  else if (f.housingStatus === "family") pts += 1;

  const tenure = f.yearsAtAddress ?? "<1";
  if (tenure === "10+") pts += 2;
  else if (tenure === "5-10") pts += 1.5;
  else if (tenure === "2-5") pts += 1;
  else if (tenure === "1-2") pts += 0.5;

  return Math.min(18, Math.round(pts * 10) / 10);
}

// ─── Income (max 22) ────────────────────────────────────────────

function scoreIncome(f: Partial<ApplicationForm>, minSalary: number): number {
  let pts = 0;
  const total = (f.primaryIncome ?? 0) + (f.secondaryIncome ?? 0);

  if (total >= 7_000_000) pts += 10;
  else if (total >= 5_000_000) pts += 8;
  else if (total >= 3_000_000) pts += 6;
  else if (total >= 2_000_000) pts += 4;
  else if (total >= 1_000_000) pts += 2;

  if (minSalary > 0 && total >= minSalary) pts += 3;

  const outgoing = (f.monthlyExpenses ?? 0) + (f.monthlyInstallmentTotal ?? 0);
  const dsr = total > 0 ? (outgoing / total) * 100 : 100;
  if (dsr <= 30) pts += 5;
  else if (dsr <= 50) pts += 3;
  else if (dsr <= 70) pts += 1;
  else pts -= 2;

  const sav = f.savingsBalance ?? "0";
  if (sav === "5m") pts += 4;
  else if (sav === "3m") pts += 3;
  else if (sav === "1m") pts += 2;
  else if (sav === "<1m") pts += 1;

  return Math.min(22, Math.max(0, Math.round(pts * 10) / 10));
}

// ─── Employment (max 15) ────────────────────────────────────────

function scoreEmployment(f: Partial<ApplicationForm>): number {
  let pts = 0;
  const prof = (f.profession ?? "").toLowerCase();

  if (prof.includes("pns") || prof.includes("bumn")) pts += 14;
  else if (prof.includes("karyawan")) pts += 8;
  else if (prof.includes("kurir")) pts += 8;
  else if (prof.includes("ojol")) {
    pts += 7;
    const dur = f.ojolDuration ?? "";
    if (dur.includes("3+")) pts += 3;
    else if (dur.includes("2-3")) pts += 2;
    else if (dur.includes("1-2")) pts += 1;

    const rating = f.ojolRating ?? 0;
    if (rating >= 4.8) pts += 3;
    else if (rating >= 4.5) pts += 2;
    else if (rating >= 4.0) pts += 1;
  } else if (prof.includes("wiraswasta") || prof.includes("pedagang")) {
    pts += 7;
    const dur = f.businessDuration ?? f.ojolDuration ?? "";
    if (dur.includes("3+")) pts += 3;
    else if (dur.includes("2-3")) pts += 2;
    else if (dur.includes("1-2")) pts += 1;
  } else if (prof.includes("freelancer") || prof.includes("buruh") || prof.includes("harian")) {
    pts += 7;
  } else if (prof) {
    pts += 3;
  }

  const assets = f.assets;
  if (assets) {
    let assetCount = 0;
    if (assets.tanah) assetCount++;
    if (assets.bangunan) assetCount++;
    if (assets.kendaraan) assetCount++;
    if (assets.usaha) assetCount++;
    pts += Math.min(3, assetCount);
  }

  return Math.min(15, pts);
}

// ─── Family (max 12) ────────────────────────────────────────────

function scoreFamily(f: Partial<ApplicationForm>): number {
  let pts = 0;

  const gt = f.guarantorType ?? "none";
  if (gt !== "none") {
    pts += 4;
    const gIncome = f.guarantor?.income ?? 0;
    if (gIncome >= 5_000_000) pts += 2;
    else if (gIncome >= 3_000_000) pts += 1;

    const rel = (f.guarantor?.relation ?? "").trim();
    if (rel.length >= 10) {
      pts += 1;
    }
  }

  if (f.maritalStatus === "married") {
    pts += 1;
    const spouseInc = f.spouseIncome ?? 0;
    if (spouseInc >= 3_000_000) pts += 2;
    else if (spouseInc >= 1_000_000) pts += 1;
  }

  const depCount = f.dependents?.length ?? 0;
  if (depCount === 0) pts += 3;
  else if (depCount <= 2) pts += 2;
  else if (depCount <= 4) pts += 1;
  else pts -= 1;

  return Math.min(12, Math.max(0, pts));
}

// ─── Credit (max 18) ────────────────────────────────────────────

function scoreCredit(f: Partial<ApplicationForm>): number {
  let pts = 0;

  if (!f.hasPriorCredit) {
    return 14;
  }

  const slik = f.slikScore ?? "col1";
  if (slik === "col1") pts += 12;
  else if (slik === "col2") pts += 8;
  else if (slik === "col3") pts += 4;
  else if (slik === "col4") pts += 1;

  const entries = f.creditEntries ?? [];
  const lunasCount = entries.filter((e) => e.status === "lunas").length;
  const macetCount = entries.filter((e) => e.status === "macet").length;
  const onTimeCount = entries.filter((e) => e.onTime).length;

  pts += Math.min(2, lunasCount);
  pts -= macetCount * 2;
  pts += Math.min(2, Math.floor(onTimeCount / 2));

  const totalInstallment = entries.reduce((s, e) => s + e.monthlyInstallment, 0);
  const totalIncome = (f.primaryIncome ?? 0) + (f.secondaryIncome ?? 0);
  if (totalIncome > 0) {
    const creditDsr = (totalInstallment / totalIncome) * 100;
    if (creditDsr <= 20) pts += 2;
    else if (creditDsr <= 40) pts += 1;
  }

  return Math.min(18, Math.max(0, pts));
}

// ─── Documents (max 15) ─────────────────────────────────────────

const REQUIRED_DOC_IDS = ["ktp", "selfie_ktp", "sim"];
const BOOST_DOC_IDS = ["kk", "slip_gaji", "slik"];
const GUARANTOR_DOC_IDS = ["ktp_penjamin", "slip_gaji_penjamin"];

function scoreDocuments(f: Partial<ApplicationForm>): number {
  let pts = 0;
  const uploaded = (f.uploadedDocs ?? []).map((d) => d.docId);

  const reqUploaded = REQUIRED_DOC_IDS.filter((id) => uploaded.includes(id)).length;
  pts += Math.round((reqUploaded / REQUIRED_DOC_IDS.length) * 10);

  const boostUploaded = BOOST_DOC_IDS.filter((id) => uploaded.includes(id)).length;
  pts += boostUploaded * 1.5;

  if ((f.guarantorType ?? "none") !== "none") {
    const gUploaded = GUARANTOR_DOC_IDS.filter((id) => uploaded.includes(id)).length;
    pts += Math.round((gUploaded / GUARANTOR_DOC_IDS.length) * 3);
  }

  return Math.min(15, Math.round(pts * 10) / 10);
}

// ─── Helpers ────────────────────────────────────────────────────

function getAge(birthDate: string): number {
  const d = new Date(birthDate);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
