export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "need_documents"
  | "approved"
  | "pickup_scheduled"
  | "pickup_done"
  | "rejected";

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface UploadedDocument {
  docId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: "uploaded" | "verified" | "rejected";
  rejectionReason?: string;
}

export interface CreditEntry {
  id: string;
  institution: string;
  type: string;
  monthlyInstallment: number;
  remainingMonths: number;
  status: "lancar" | "macet" | "lunas";
  onTime: boolean;
}

export interface Dependent {
  name: string;
  age: number;
  type: string;
}

export interface Guarantor {
  name: string;
  phone: string;
  nik: string;
  relation: string;
  income: number;
  address: string;
}

export interface Assets {
  tanah: boolean;
  tanah_value?: number;
  bangunan: boolean;
  bangunan_value?: number;
  kendaraan: boolean;
  kendaraan_value?: number;
  tabungan_aset: boolean;
  tabungan_value?: number;
  usaha: boolean;
  usaha_value?: number;
}

export type Gender = "L" | "P";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type HousingStatus = "own" | "rent" | "family" | "gov" | "other";
export type YearsAtAddress = "<1" | "1-2" | "2-5" | "5-10" | "10+";
export type SavingsBalance = "0" | "<1m" | "1m" | "3m" | "5m";
export type SlikScore = "col1" | "col2" | "col3" | "col4" | "col5";
export type GuarantorType =
  | "none"
  | "parent"
  | "sibling"
  | "spouse"
  | "employer"
  | "other";

export interface ApplicationForm {
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  phone: string;
  emergencyContact: EmergencyContact;

  address: string;
  subdistrict: string;
  city: string;
  province: string;
  lat?: number;
  lng?: number;
  housingStatus: HousingStatus;
  yearsAtAddress: YearsAtAddress;

  primaryIncome: number;
  secondaryIncome: number;
  monthlyExpenses: number;
  savingsBalance: SavingsBalance;

  profession: string;
  ojolPlatform?: string;
  ojolDuration?: string;
  ojolRating?: number;
  businessDuration?: string;
  employerName?: string;
  employerPhone?: string;

  assets: Assets;

  guarantorType: GuarantorType;
  guarantor?: Guarantor;

  spouseIncome?: number;
  dependents: Dependent[];

  hasPriorCredit: boolean;
  slikScore?: SlikScore;
  creditEntries: CreditEntry[];
  monthlyInstallmentTotal: number;

  uploadedDocs: UploadedDocument[];
}

export interface ScoreBreakdown {
  identity: number;
  income: number;
  employment: number;
  family: number;
  credit: number;
  documents: number;
  total: number;
}

export interface PickupBooking {
  date: string;
  timeSlot: string;
  dealerName: string;
  dealerAddress: string;
  confirmedAt: string;
  status: "scheduled" | "completed" | "cancelled";
}

/** Bukti unggahan saat memenuhi permintaan dokumen tambahan (demo: nama berkas saja). */
export interface SupplementaryDocUpload {
  docId: string;
  fileName: string;
  submittedAt: string;
}

export interface Application {
  id: string;
  operatorId: string;
  bikeId: string;
  operatorName: string;
  bikeName: string;
  pricePerDay: number;
  /** Program min monthly salary — synced from operator at apply time */
  minSalary?: number;
  form: ApplicationForm;
  score: ScoreBreakdown;
  status: ApplicationStatus;
  submittedAt: string;
  lastUpdatedAt: string;
  reviewerNote?: string;
  requestedDocIds?: string[];
  /** Riwayat berkas yang dikirim dari halaman status (need_documents). */
  supplementarySubmissions?: SupplementaryDocUpload[];
  rejectionReason?: string;
  rejectionCooldownUntil?: string;
  pickup?: PickupBooking;
}

export const EMPTY_FORM: ApplicationForm = {
  fullName: "",
  nik: "",
  birthPlace: "",
  birthDate: "",
  gender: "L",
  maritalStatus: "single",
  phone: "",
  emergencyContact: { name: "", phone: "", relation: "" },
  address: "",
  subdistrict: "",
  city: "",
  province: "",
  housingStatus: "rent",
  yearsAtAddress: "<1",
  primaryIncome: 0,
  secondaryIncome: 0,
  monthlyExpenses: 0,
  savingsBalance: "0",
  profession: "",
  assets: {
    tanah: false,
    bangunan: false,
    kendaraan: false,
    tabungan_aset: false,
    usaha: false,
  },
  guarantorType: "none",
  dependents: [],
  hasPriorCredit: false,
  creditEntries: [],
  monthlyInstallmentTotal: 0,
  uploadedDocs: [],
};
