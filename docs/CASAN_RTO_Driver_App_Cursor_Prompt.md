# CASAN RTO Driver Application — Cursor Agent Prompt

**Project:** PT CASAN Energi Indonesia  
**Stack:** React + TypeScript + Vite (or Next.js App Router)  
**UI:** Tailwind CSS + shadcn/ui  
**State:** Zustand  
**Backend (mock-first):** JSON + localStorage, then swap to REST API  
**Language:** Bahasa Indonesia (all UI copy), English (code)

---

## Context for the Agent

You are building the **CASAN RTO Driver Application** — a mobile-first web app that lets motorcycle EV drivers in Jabodetabek apply for a Rent-to-Own (RTO) or Rental program through a CASAN dealer partner (Tangkas Motors / Maka Motors / United Motors). The app handles the complete application lifecycle:

1. Driver fills multi-step application form with creditworthiness scoring
2. Application is submitted and enters a review queue
3. Driver polls/watches their application status in real-time
4. Three possible outcomes: **Approved → schedule pickup**, **Needs More Documents → resubmit**, **Rejected → apply again after 30 days**
5. If approved, driver books a physical pickup slot at the dealer location

The design system follows a **dark IDE / Cursor-style aesthetic** — `#0d0d0f` background, `#00e5c3` teal accent, Geist + Geist Mono fonts, translucent borders, monospace stat readouts.

---

## Part 1 — Data Models

```typescript
// types/index.ts

export type DealerId = 'tangkas' | 'maka' | 'united'
export type ProgramType = 'RTO' | 'Rent'
export type ApplicationStatus =
  | 'draft'           // being filled, not submitted
  | 'submitted'       // submitted, awaiting review
  | 'under_review'    // CASAN/dealer is actively reviewing
  | 'need_documents'  // reviewer requested more docs
  | 'approved'        // approved, waiting for pickup scheduling
  | 'pickup_scheduled'// approved + pickup date booked
  | 'pickup_done'     // bike handed over, active RTO contract begins
  | 'rejected'        // declined, cooldown 30 days

export interface Dealer {
  id: DealerId
  name: string
  icon: string
  area: string
  address: string
  lat: number
  lng: number
  color: string
  brands: string[]
  pickupHours: string   // e.g. "09:00–17:00"
  pickupDays: string[]  // e.g. ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
}

export interface Program {
  id: string           // e.g. 'P-TK-RTO'
  dealerId: DealerId
  name: string
  type: ProgramType
  dailyRate: number    // IDR/day
  minIncome: number    // IDR/month minimum
  graceDays: number
  icon: string
  bgColor: string
  accentColor: string
  model: string        // e.g. 'Zeeho Cyber S'
  imageUrl: string
  tagline: string
  specs: Array<{ icon: string; label: string; value: string }>
  perks: string[]
  casanFeePerDay: number
}

export interface DocumentRequirement {
  id: string
  name: string
  description: string
  required: boolean    // true = wajib, false = optional/boost
  boostPoints: number  // 0 if required, >0 if boost doc
  icon: string
  category: 'identity' | 'financial' | 'boost'
}

export interface UploadedDocument {
  docId: string
  fileName: string
  fileSize: number
  uploadedAt: string   // ISO
  status: 'uploaded' | 'verified' | 'rejected'
  rejectionReason?: string
}

export interface CreditEntry {
  id: string
  institution: string
  type: string         // e.g. 'KPR', 'Kendaraan', 'KTA'
  monthlyInstallment: number
  remainingMonths: number
  status: 'lancar' | 'macet' | 'lunas'
  onTime: boolean
}

export interface ApplicationForm {
  // Identity
  fullName: string
  nik: string          // 16 digits
  birthPlace: string
  birthDate: string    // ISO date
  gender: 'L' | 'P'
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  phone: string
  emergencyContact: { name: string; phone: string; relation: string }

  // Address
  address: string
  subdistrict: string  // kecamatan
  city: string
  province: string
  lat?: number
  lng?: number
  housingStatus: 'own' | 'rent' | 'family' | 'gov' | 'other'
  yearsAtAddress: '<1' | '1-2' | '2-5' | '5-10' | '10+'

  // Income
  primaryIncome: number       // IDR/month
  secondaryIncome: number     // IDR/month (optional)
  monthlyExpenses: number     // IDR/month
  savingsBalance: '0' | '<1m' | '1m' | '3m' | '5m'

  // Employment
  profession: string          // enum key
  ojolPlatform?: string       // if profession=ojol
  ojolDuration?: string       // e.g. '1-2', '2-3', '3+'
  ojolRating?: number         // 1.0–5.0
  businessDuration?: string   // for wiraswasta
  employerName?: string
  employerPhone?: string

  // Assets — which the driver owns
  assets: {
    tanah: boolean; tanah_value?: number
    bangunan: boolean; bangunan_value?: number
    kendaraan: boolean; kendaraan_value?: number
    tabungan_aset: boolean; tabungan_value?: number
    usaha: boolean; usaha_value?: number
  }

  // Guarantor
  guarantorType: 'none' | 'parent' | 'sibling' | 'spouse' | 'employer' | 'other'
  guarantor?: {
    name: string; phone: string; nik: string
    relation: string; income: number; address: string
  }

  // Family
  spouseIncome?: number
  dependents: Array<{ name: string; age: number; type: string }>

  // Credit history
  hasPriorCredit: boolean
  slikScore?: 'col1' | 'col2' | 'col3' | 'col4' | 'col5'
  creditEntries: CreditEntry[]
  monthlyInstallmentTotal: number  // sum of all active installments

  // Documents
  uploadedDocs: UploadedDocument[]
}

export interface ScoreBreakdown {
  identity: number      // max 18
  income: number        // max 22
  employment: number    // max 15
  family: number        // max 12
  credit: number        // max 18
  documents: number     // max 15
  total: number         // max 100
}

export interface Application {
  id: string                    // e.g. 'CASAN-A7F3K2'
  dealerId: DealerId
  programId: string
  form: ApplicationForm
  score: ScoreBreakdown
  status: ApplicationStatus
  submittedAt: string           // ISO
  lastUpdatedAt: string         // ISO
  reviewerNote?: string         // from dealer/CASAN reviewer
  requestedDocIds?: string[]    // if status = need_documents
  rejectionReason?: string      // if status = rejected
  rejectionCooldownUntil?: string // ISO — 30 days after rejection
  pickup?: PickupBooking
}

export interface PickupBooking {
  dealerId: DealerId
  date: string         // YYYY-MM-DD
  timeSlot: string     // e.g. '09:00'
  dealerName: string
  dealerAddress: string
  dealerLat: number
  dealerLng: number
  confirmedAt: string
  status: 'scheduled' | 'completed' | 'cancelled'
  handoverSteps: HandoverStep[]
}

export interface HandoverStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'active' | 'done'
  completedAt?: string
}

export interface TimeSlot {
  time: string         // e.g. '09:00'
  available: boolean
  spotsRemaining: number
}
```

---

## Part 2 — Static Reference Data

```typescript
// data/dealers.ts
export const DEALERS: Record<DealerId, Dealer> = {
  tangkas: {
    id: 'tangkas',
    name: 'Tangkas Motors',
    icon: '⚡',
    area: 'Jakarta Pusat',
    address: 'Jl. Bungur Besar No. 17, Kemayoran, Jakarta Pusat',
    lat: -6.1635,
    lng: 106.8546,
    color: '#7C3AED',
    brands: ['Zeeho'],
    pickupHours: '09:00–17:00',
    pickupDays: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  },
  maka: {
    id: 'maka',
    name: 'Maka Motors',
    icon: '🟢',
    area: 'Jakarta Selatan',
    address: 'Jl. Fatmawati Raya No. 56, Cilandak, Jakarta Selatan',
    lat: -6.2922,
    lng: 106.7948,
    color: '#16A34A',
    brands: ['Maka Cavalry'],
    pickupHours: '08:00–16:00',
    pickupDays: ['Senin','Selasa','Rabu','Kamis','Jumat'],
  },
  united: {
    id: 'united',
    name: 'United Motors',
    icon: '🟠',
    area: 'Jakarta Timur',
    address: 'Jl. Raya Bekasi No. 88, Cakung, Jakarta Timur',
    lat: -6.2118,
    lng: 106.9216,
    color: '#EA580C',
    brands: ['United TX1800', 'United MX1200'],
    pickupHours: '09:00–18:00',
    pickupDays: ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  },
}

// data/programs.ts — 6 programs as defined in v12 codebase
// (see ALL_PROGS in casan-driver-app-v12.html for full spec)

// data/documents.ts
export const DOCUMENT_REQUIREMENTS: DocumentRequirement[] = [
  // Identity — all wajib
  { id:'ktp',      name:'KTP Asli',                   description:'KTP aktif sesuai domisili',     required:true,  boostPoints:0, icon:'🪪', category:'identity'  },
  { id:'kk',       name:'Kartu Keluarga',              description:'KK terbaru (tahun ini)',        required:true,  boostPoints:0, icon:'👨‍👩‍👧', category:'identity'  },
  { id:'sim',      name:'SIM C Aktif',                 description:'SIM C motor, belum kadaluarsa', required:true,  boostPoints:0, icon:'🪪', category:'identity'  },
  { id:'selfie',   name:'Selfie + KTP',                description:'Foto memegang KTP di depan muka', required:true, boostPoints:0, icon:'🤳', category:'identity' },
  // Financial — wajib
  { id:'slip',     name:'Slip Gaji / Screenshot Income', description:'3 bulan terakhir',            required:true,  boostPoints:0, icon:'💰', category:'financial' },
  { id:'rekening', name:'Rekening Koran',              description:'Mutasi rekening 3 bulan',       required:true,  boostPoints:0, icon:'🏦', category:'financial' },
  // Optional
  { id:'sktm',     name:'Surat Keterangan Kerja',      description:'Dari platform / perusahaan',   required:false, boostPoints:0, icon:'📄', category:'financial' },
  { id:'npwp',     name:'NPWP',                        description:'Jika sudah punya',              required:false, boostPoints:0, icon:'📋', category:'financial' },
  // Boost docs
  { id:'tabungan', name:'Bukti Tabungan > Rp 1 Jt',   description:'Screenshot saldo tabungan',     required:false, boostPoints:4, icon:'💳', category:'boost'    },
  { id:'bpjs_tk',  name:'BPJS Ketenagakerjaan',       description:'Kartu BPJS aktif',              required:false, boostPoints:3, icon:'🛡️', category:'boost'    },
  { id:'ref_ojol', name:'Screenshot Rating OJOL ≥4.5', description:'Rating minimal 4.5 bintang',   required:false, boostPoints:2, icon:'⭐', category:'boost'    },
  { id:'gu_ktp',   name:'KTP Penjamin',               description:'KTP orang yang menjamin',       required:false, boostPoints:5, icon:'👤', category:'boost'    },
  { id:'sertif',   name:'Sertifikat / BPKB Kendaraan', description:'Aset sebagai jaminan tambahan', required:false, boostPoints:3, icon:'📜', category:'boost'    },
]
```

---

## Part 3 — Scoring Engine

```typescript
// lib/scoring.ts

/**
 * CASAN RTO Creditworthiness Scoring Engine
 * Total: 100 points across 6 dimensions
 * Thresholds:
 *   >= 80 → AUTO-APPROVED
 *   60–79 → APPROVED (manual review 24h)
 *   41–59 → MANUAL REVIEW (1–3 business days)
 *   21–40 → CONDITIONAL (needs guarantor + more docs)
 *   < 21  → DECLINED
 */

export function calculateScore(form: ApplicationForm): ScoreBreakdown {
  const s = { identity:0, income:0, employment:0, family:0, credit:0, documents:0 }
  const max = { identity:18, income:22, employment:15, family:12, credit:18, documents:15 }

  // ── 1. IDENTITY (max 18) ──────────────────────────────────────
  // Name present
  if (form.fullName.trim().length > 2)          s.identity += 3
  // Valid NIK (16 digits)
  if (/^\d{16}$/.test(form.nik))               s.identity += 3
  // Age 21–55 optimal, 18–20 partial
  const age = calcAge(form.birthDate)
  if (age >= 21 && age <= 55)                   s.identity += 4
  else if (age >= 18)                           s.identity += 2
  // Address filled
  if (form.subdistrict && form.city)            s.identity += 2
  if (form.address.length > 4)                  s.identity += 2
  // Housing stability
  const housingPts = { own:4, family:3, gov:3, rent:2, other:1 }
  s.identity += housingPts[form.housingStatus] ?? 1
  // Years at address (tenure bonus)
  const tenurePts = { '10+':2, '5-10':2, '2-5':1, '1-2':0, '<1':0 }
  s.identity += tenurePts[form.yearsAtAddress] ?? 0
  // Emergency contact
  if (form.emergencyContact.name && form.emergencyContact.phone)  s.identity += 1

  // ── 2. INCOME (max 22) ───────────────────────────────────────
  const totalIncome = form.primaryIncome + form.secondaryIncome
  const totalExpenses = form.monthlyExpenses + form.monthlyInstallmentTotal
  // Raw income score
  if (totalIncome >= 7_000_000)     s.income = 22
  else if (totalIncome >= 5_000_000) s.income = 18
  else if (totalIncome >= 3_500_000) s.income = 14
  else if (totalIncome >= 2_500_000) s.income = 10
  else if (totalIncome >= 2_000_000) s.income = 6
  else if (totalIncome > 0)         s.income = 2
  // DSR penalty (Debt Service Ratio = total obligations / income)
  if (totalIncome > 0 && totalExpenses > 0) {
    const dsr = totalExpenses / totalIncome
    if (dsr > 0.70)       s.income = Math.max(0, s.income - 5)
    else if (dsr > 0.50)  s.income = Math.max(0, s.income - 2)
  }
  // Savings bonus
  const savingsPts = { '5m':2, '3m':1, '1m':0, '<1m':0, '0':0 }
  s.income += savingsPts[form.savingsBalance] ?? 0

  // ── 3. EMPLOYMENT (max 15) ───────────────────────────────────
  const prof = form.profession
  if (['pns','tni'].includes(prof))                      s.employment = 14
  else if (['karyawan_tetap','pensiun'].includes(prof))   s.employment = 11
  else if (prof === 'ojol') {
    s.employment += 7
    const durPts: Record<string, number> = { '3+':5, '2-3':4, '1-2':3, '6-12':2, '<6':1 }
    s.employment += durPts[form.ojolDuration ?? ''] ?? 0
    const rating = form.ojolRating ?? 0
    if (rating >= 4.8)      s.employment += 3
    else if (rating >= 4.5) s.employment += 2
    else if (rating >= 4.0) s.employment += 1
  }
  else if (['karyawan_kontrak','kurir'].includes(prof))  s.employment = 8
  else if (['wiraswasta','pedagang','warung'].includes(prof)) {
    s.employment = 7
    const bdPts: Record<string, number> = { '3+':5, '1-3':3, '<1':1 }
    s.employment += bdPts[form.businessDuration ?? ''] ?? 0
  }
  else if (['tukang','supir','security','freelance'].includes(prof)) s.employment = 7
  else if (['petani','nelayan','peternak'].includes(prof))           s.employment = 6
  else s.employment = 3
  // Asset ownership bonus (up to +2)
  const assetCount = Object.values(form.assets).filter(Boolean).length
  s.employment += Math.min(2, Math.floor(assetCount / 2))

  // ── 4. FAMILY (max 12) ──────────────────────────────────────
  if (form.guarantorType !== 'none' && form.guarantor) {
    const guTypePts: Record<string, number> = { parent:6, sibling:6, employer:6, spouse:5, other:5 }
    s.family += guTypePts[form.guarantorType] ?? 4
    if (form.guarantor.income >= 3_000_000)      s.family += 3
    else if (form.guarantor.income >= 2_000_000) s.family += 2
    else if (form.guarantor.income > 0)          s.family += 1
    if (form.guarantor.name && form.guarantor.phone) s.family += 2
  }
  if (form.maritalStatus === 'married') {
    s.family += 2
    if (form.spouseIncome && form.spouseIncome > 0) s.family += 1
  }
  // Dependent penalty (too many dependents = cash drain risk)
  const deps = form.dependents.length
  if (deps <= 2)      s.family += 1
  else if (deps >= 5) s.family = Math.max(0, s.family - 2)

  // ── 5. CREDIT (max 18) ──────────────────────────────────────
  if (!form.hasPriorCredit) {
    s.credit = 8   // no history = neutral-positive for first-time
  } else {
    const slikPts: Record<string, number> = { col1:12, col2:4, col3:0, col4:0, col5:0 }
    s.credit += slikPts[form.slikScore ?? 'col1'] ?? 6
    for (const entry of form.creditEntries) {
      if (entry.status === 'lunas')        s.credit += 2
      else if (entry.status === 'macet')   s.credit = Math.max(0, s.credit - 4)
      if (entry.onTime)                    s.credit += 1
      else                                 s.credit = Math.max(0, s.credit - 2)
    }
    // DSR from installments
    if (totalIncome > 0 && form.monthlyInstallmentTotal / totalIncome > 0.4) {
      s.credit = Math.max(0, s.credit - 4)
    }
  }
  // Savings crossover boost for credit dimension
  s.credit += savingsPts[form.savingsBalance] ?? 0

  // ── 6. DOCUMENTS (max 15) ────────────────────────────────────
  const requiredDocs = DOCUMENT_REQUIREMENTS.filter(d => d.required)
  const uploadedIds = form.uploadedDocs
    .filter(d => d.status === 'uploaded' || d.status === 'verified')
    .map(d => d.docId)
  const completedRequired = requiredDocs.filter(d => uploadedIds.includes(d.id)).length
  s.documents = Math.round((completedRequired / requiredDocs.length) * 10)
  // Boost docs
  for (const doc of DOCUMENT_REQUIREMENTS.filter(d => !d.required)) {
    if (uploadedIds.includes(doc.id)) s.documents += doc.boostPoints * 0.5
  }
  // Program selected
  if (form /* programId selected */) s.documents += 1

  // ── Cap each dimension at its max ───────────────────────────
  for (const key of Object.keys(max) as Array<keyof typeof max>) {
    s[key] = Math.min(max[key], Math.round(s[key]))
  }

  const total = Object.values(s).reduce((a, b) => a + b, 0)
  return { ...s, total }
}

export function getScoreDecision(total: number): {
  label: string; labelId: string; color: string; bgColor: string; eta: string
} {
  if (total >= 80) return {
    label: 'AUTO-APPROVED', labelId: 'Disetujui Otomatis 🎉',
    color: '#22c55e', bgColor: 'rgba(34,197,94,.08)',
    eta: 'Motor siap diserahkan dalam 1–2 hari kerja'
  }
  if (total >= 60) return {
    label: 'APPROVED', labelId: 'Disetujui ✅',
    color: '#00e5c3', bgColor: 'rgba(0,229,195,.08)',
    eta: 'Dealer menghubungi via WhatsApp dalam 24 jam'
  }
  if (total >= 41) return {
    label: 'UNDER REVIEW', labelId: 'Sedang Direview 🔍',
    color: '#60a5fa', bgColor: 'rgba(96,165,250,.08)',
    eta: 'Analisis manual 1–3 hari kerja'
  }
  if (total >= 21) return {
    label: 'CONDITIONAL', labelId: 'Perlu Penjamin ⚠️',
    color: '#fbbf24', bgColor: 'rgba(251,191,36,.08)',
    eta: 'Lengkapi penjamin dan dokumen tambahan'
  }
  return {
    label: 'DECLINED', labelId: 'Tidak Disetujui ❌',
    color: '#f87171', bgColor: 'rgba(248,113,113,.08)',
    eta: 'Bisa mendaftar kembali setelah 30 hari'
  }
}
```

---

## Part 4 — Application State Machine & Store

```typescript
// store/applicationStore.ts  (Zustand)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ApplicationStore {
  // Current in-progress application
  draft: Partial<ApplicationForm>
  selectedDealerId: DealerId | null
  selectedProgramId: string | null
  currentStep: number   // -1 = welcome, 1–5 = form steps, 6 = score review

  // Submitted applications (persisted)
  applications: Application[]
  activeApplicationId: string | null  // which one driver is tracking

  // Actions — form navigation
  setDealer: (id: DealerId) => void
  setProgram: (id: string) => void
  updateDraft: (patch: Partial<ApplicationForm>) => void
  goToStep: (step: number) => void
  resetDraft: () => void

  // Actions — lifecycle
  submitApplication: () => Application
  updateApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    meta?: {
      reviewerNote?: string
      requestedDocIds?: string[]
      rejectionReason?: string
    }
  ) => void
  uploadAdditionalDoc: (appId: string, doc: UploadedDocument) => void
  resubmitApplication: (appId: string) => void
  bookPickup: (appId: string, booking: Omit<PickupBooking, 'status' | 'handoverSteps'>) => void
  completeHandoverStep: (appId: string, stepId: string) => void
  applyAgain: (fromAppId: string) => void   // after rejection, reset with dealer/program pre-filled
}
```

---

## Part 5 — Screen Architecture

Build these screens as separate route-level components. All routes are under a single-page layout with a bottom nav on mobile.

### Screen 1: `/` — Welcome & Program Selection
```
┌──────────────────────────────────────┐
│ CASAN                         09:41 │  ← sticky status bar
│──────────────────────────────────────│
│                                      │
│  ⚡ Selamat datang                   │
│  MULAI DAFTAR                        │
│  MOTOR LISTRIK                       │
│  ✓ Semua Profesi ✓ Proses Cepat      │
│                                      │
│  ── Pilih Mitra Dealer ──            │
│  ┌─────┐ ┌─────┐ ┌─────┐           │
│  │ ⚡  │ │ 🟢  │ │ 🟠  │           │
│  │Tang-│ │Maka │ │Unit-│           │
│  │kas  │ │Moto-│ │ed   │           │
│  └─────┘ └─────┘ └─────┘           │
│                                      │
│  ── Pilih Program ──                 │
│  ┌────────────────────────┐ [ℹ]     │
│  │ ⚡ Zeeho RTO           │         │
│  │ Tangkas · Grace 7d     │ [RTO]   │
│  │                  Rp 38k/hari │    │
│  └────────────────────────┘         │
│  ┌────────────────────────┐ [ℹ]     │
│  │ 🔵 Tangkas Rental      │         │
│  └────────────────────────┘         │
│                                      │
│  ✅ Siap mulai! Tangkas · Zeeho RTO  │
│                                      │
│  [    Mulai Isi Formulir →         ] │
└──────────────────────────────────────┘
```

**Behavior:**
- Tapping dealer card filters program list to that dealer's programs
- Tapping a program card selects it (whole card = tap target)
- ℹ icon opens bottom-sheet detail modal (specs, price, perks, monthly simulation)
- Bottom CTA says "Mulai Daftar →" → "Pilih Program Dulu →" → "Mulai Isi Formulir →" as state changes
- If driver has an active application, show an "Lihat Status Aplikasi" banner at top

---

### Screen 2: `/apply` — Multi-Step Application Form

6 steps, displayed one at a time. Step nav bar sticky at top showing completion.

#### Step 1 — Data Diri (Identity)
Fields:
- Nama Lengkap (text)
- NIK 16 digit (number, validate live: show ✓ or ✗)
- Tempat Lahir (datalist from 150 Indonesian cities)
- Tanggal Lahir (date picker → live age display "Usia: 28 tahun")
- Jenis Kelamin (pill: L / P)
- Status Nikah (select → if "Menikah" shows spouse income field)
- No HP WhatsApp (tel)
- Kontak Darurat: Nama, HP, Hubungan

Alamat section:
- Cari Alamat (OSM Nominatim autocomplete, min 4 chars, debounce 500ms)
- If address found → show small Leaflet map with pin
- Kecamatan, Kota/Kabupaten (auto-filled from OSM response, editable)
- Status Hunian (pill: Milik Sendiri / Kontrak / Keluarga / Dinas / Lainnya)
- Lama Tinggal (pill: <1th / 1-2th / 2-5th / 5-10th / 10th+)

#### Step 2 — Pekerjaan & Penghasilan (Employment)
Fields:
- Profesi (select — enum below)
  - `ojol`: Driver Ojek Online (Gojek/Grab/Maxim)
  - `ojol_new`: Driver Ojol < 6 bulan
  - `kurir`: Kurir (J&T/SiCepat/Ninja)
  - `karyawan_tetap`: Karyawan Tetap
  - `karyawan_kontrak`: Karyawan Kontrak
  - `pns`: PNS / ASN
  - `tni`: TNI / Polri
  - `pensiun`: Pensiunan
  - `wiraswasta`: Wiraswasta / Pedagang
  - `pedagang`: Pedagang Pasar
  - `warung`: Pemilik Warung / UMKM
  - `tukang`: Tukang / Jasa
  - `supir`: Supir / Transporter
  - `security`: Satpam / Security
  - `freelance`: Freelancer
  - `petani`: Petani / Nelayan / Peternak
  - `lainnya`: Lainnya

- Conditional fields shown based on profession:
  - ojol → Platform (Gojek/Grab/Maxim/Semua), Durasi (dropdown), Rating (star widget 1–5)
  - wiraswasta/pedagang/warung → Nama Usaha, Durasi Usaha, Alamat Usaha
  - karyawan/pns/tni → Nama Instansi/Perusahaan, HP Instansi

- Penghasilan Utama/Bulan (Rp input, dot-formatted)
- Penghasilan Tambahan/Bulan (optional)
- Pengeluaran Rutin/Bulan (Rp)
- DSR calculator shown inline: "Rasio beban: XX% — [kuning/hijau/merah]"
- Saldo Tabungan Saat Ini (pill: Tidak ada / < Rp 1 Jt / Rp 1–3 Jt / Rp 3–5 Jt / > Rp 5 Jt)

Aset section (big tap cards, each toggleable with value input when on):
- 🏗 Tanah / Properti
- 🏠 Bangunan / Rumah
- 🚗 Kendaraan Bermotor
- 💰 Tabungan / Deposito
- 🏪 Usaha / Toko

#### Step 3 — Keluarga & Penjamin (Family)
Fields:
- Penjamin (pill: Tidak Ada / Orang Tua / Saudara / Pasangan / Atasan / Lainnya)
  - If selected → Nama, NIK, HP, Hubungan, Penghasilan/Bulan, Alamat Penjamin
- Pasangan (shown if maritalStatus = married):
  - Nama Pasangan, Pekerjaan Pasangan, Penghasilan Pasangan
- Tanggungan (add multiple rows):
  - Nama, Usia, Jenis (Anak / Orang Tua / Saudara / Lainnya)
  - Warning shown if > 4 tanggungan: "Banyak tanggungan mempengaruhi skor"

#### Step 4 — Riwayat Kredit (Credit History)
Fields:
- "Apakah pernah punya kredit/pinjaman?" (pill: Ya / Tidak)
  - If Tidak → show positive notice "Tidak ada riwayat kredit = skor netral positif"
  - If Ya:
    - SLIK Score (pill: Kolektibilitas 1–5, with descriptions)
    - Add credit entries (repeatable):
      - Nama Lembaga, Jenis Kredit, Cicilan/Bulan, Sisa Bulan, Status (Lunas/Aktif/Macet), Tepat Waktu (Ya/Tidak)
    - Total cicilan aktif auto-calculated, shown as DSR impact

#### Step 5 — Dokumen (Document Upload)
Show all 13 documents in 3 groups:
- **Wajib — Identitas** (KTP, KK, SIM C, Selfie+KTP)
- **Wajib — Keuangan** (Slip Gaji, Rekening Koran)
- **Opsional** (SKTM, NPWP)
- **Boost Skor** (+N poin each) (Tabungan, BPJS TK, Rating OJOL, KTP Penjamin, BPKB)

Each document card:
- Tap → open file picker (accept: image/*, application/pdf)
- Show filename + file size after upload
- Checked state: green border + ✓ checkmark
- Boost docs show "+4 pts" badge

Missing required docs highlighted in amber at bottom.

#### Step 6 — Review Skor (Live Score)
The score is calculated live throughout the form but this step makes it the focus.

Layout:
```
┌──────────────────────────────────────┐
│  ● LIVE SCORING                      │
│                                      │
│       72                             │
│      /100                            │
│  Layak Disetujui ✅                  │
│  ██████████████████░░░░░░   72%      │
│  [APPROVED]                          │
│  Dealer hubungi 24 jam               │
│                                      │
│  ─── Breakdown per Dimensi ───       │
│  Identitas    ██████████  16/18      │
│  Penghasilan  █████████   18/22      │
│  Pekerjaan    ████████    11/15      │
│  Keluarga     ████        5/12       │
│  Kredit       █████████   12/18      │
│  Dokumen      ██████████  10/15      │
│                                      │
│  ⚠ 2 Dokumen wajib belum lengkap    │
│  • Slip Gaji / Screenshot Income     │
│  • Rekening Koran                    │
│                                      │
│  ─── Program Dipilih ───             │
│  ⚡ Zeeho RTO · Tangkas · Rp 38k/hr │
│                                      │
│  [      Submit Aplikasi →          ] │
└──────────────────────────────────────┘
```

Score recalculates on every form field change (`useEffect` + debounce 300ms).
Submit button is always enabled (driver can submit even with missing docs, score reflects it).

---

### Screen 3: `/status/:applicationId` — Application Status Tracker

This is the key screen drivers return to after submitting.

#### Sub-state A: `submitted` / `under_review`
```
┌──────────────────────────────────────┐
│ ← Kembali                            │
│                                      │
│         🕐                           │
│  CASAN-A7F3K2                        │
│  Aplikasi Sedang Diproses            │
│  Kami sedang memeriksa data kamu.    │
│                                      │
│  ┌─ Status Timeline ──────────────┐  │
│  │ ✅ Terkirim         10 Mar 09:22│  │
│  │ ⟳  Sedang Direview  ...       │  │
│  │ ○  Keputusan        —          │  │
│  │ ○  Ambil Motor      —          │  │
│  └──────────────────────────────┘   │
│                                      │
│  Skor Kamu                           │
│  72/100  Layak Disetujui             │
│                                      │
│  Program: Zeeho RTO · Tangkas        │
│  Rp 38.000/hari · Grace 7 hari       │
│                                      │
│  [📱 Hubungi Dealer via WhatsApp]    │
│  [✏️  Edit & Lengkapi Aplikasi]      │
│                                      │
│  Estimasi: Dealer hubungi 24 jam     │
└──────────────────────────────────────┘
```

**Behavior:**
- Poll for status change every 30 seconds (or use optimistic mock)
- Show animated pulsing indicator on current step
- "Edit & Lengkapi Aplikasi" → opens full form in edit mode, pre-filled

#### Sub-state B: `need_documents`
```
┌──────────────────────────────────────┐
│  📋                                  │
│  Dokumen Tambahan Diperlukan         │
│  CASAN-A7F3K2                        │
│                                      │
│  Catatan Reviewer:                   │
│  ┌─────────────────────────────────┐ │
│  │ "Mohon lengkapi slip gaji 3     │ │
│  │  bulan terakhir dan foto KTP    │ │
│  │  yang lebih jelas."             │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Dokumen yang diminta:               │
│  ┌──────────────────────────────┐   │
│  │ 💰 Slip Gaji        [Upload] │   │
│  │ 🪪 Selfie + KTP     ✅ Done  │   │
│  └──────────────────────────────┘   │
│                                      │
│  [   Upload & Kirim Ulang →        ] │
│  [   Hubungi Dealer WhatsApp       ] │
└──────────────────────────────────────┘
```

**Behavior:**
- Show only the specific docs requested by reviewer (`requestedDocIds`)
- Upload inline without going back to full form
- "Upload & Kirim Ulang" sets status back to `submitted`
- Application re-enters review queue with updated docs

#### Sub-state C: `approved` (not yet scheduled)
```
┌──────────────────────────────────────┐
│         🎉                           │
│  SELAMAT! Aplikasi Disetujui!        │
│  CASAN-A7F3K2                        │
│                                      │
│  Skor: 72/100 · APPROVED             │
│                                      │
│  ┌─ Yang perlu dilakukan ─────────┐  │
│  │ 1. Jadwalkan ambil motor       │  │
│  │ 2. Bawa dokumen asli           │  │
│  │ 3. Tanda tangan kontrak        │  │
│  │ 4. Motor langsung bisa dibawa  │  │
│  └────────────────────────────────┘ │
│                                      │
│  [  🗓 Atur Jadwal Ambil Motor →   ] │
│  [  📱 Hubungi Dealer WhatsApp     ] │
└──────────────────────────────────────┘
```

#### Sub-state D: `rejected`
```
┌──────────────────────────────────────┐
│         ❌                           │
│  Aplikasi Tidak Disetujui            │
│  CASAN-A7F3K2                        │
│                                      │
│  Alasan:                             │
│  ┌─────────────────────────────────┐ │
│  │ "Skor kredit di bawah batas     │ │
│  │  minimum program yang dipilih.  │ │
│  │  Disarankan melengkapi penjamin │ │
│  │  dan menunggu 30 hari."         │ │
│  └─────────────────────────────────┘ │
│                                      │
│  Skor Kamu: 34/100                   │
│  Skor minimum program: 41            │
│                                      │
│  Bisa mendaftar ulang:               │
│  ⏱ 28 hari 14 jam lagi              │
│  (9 April 2025)                      │
│                                      │
│  Tips meningkatkan skor:             │
│  • Tambahkan penjamin (+6 pts)       │
│  • Upload BPJS Ketenagakerjaan (+3)  │
│  • Perbaiki riwayat kredit (+8)      │
│                                      │
│  [  Daftar Ulang Setelah 30 Hari  ] │  ← disabled + countdown
│  [  Pilih Program Lebih Terjangkau ] │
│  [  📱 Hubungi CASAN Support       ] │
└──────────────────────────────────────┘
```

**Behavior:**
- "Daftar Ulang" button is disabled + shows countdown timer until cooldown expires
- When countdown reaches 0: button becomes active
- "Pilih Program Lebih Terjangkau" pre-selects lower `dailyRate` program and opens welcome screen
- "Apply Again" pre-fills the form with previous data so driver only edits what changed

---

### Screen 4: `/pickup/:applicationId` — Pickup Scheduler

Only accessible when `status === 'approved'` or `status === 'pickup_scheduled'`.

```
┌──────────────────────────────────────┐
│ ← Kembali ke Status                  │
│                                      │
│  🛵 Atur Jadwal Ambil Motor          │
│  CASAN-A7F3K2 · Zeeho Cyber S        │
│                                      │
│  ─── Lokasi Dealer ───               │
│  ┌─────────────────────────────────┐ │
│  │  📍 Tangkas Motors              │ │
│  │  Jl. Bungur Besar No.17         │ │
│  │  Kemayoran, Jakarta Pusat       │ │
│  │  ─────────────────────────────  │ │
│  │  [      MAP PREVIEW         ]   │ │
│  │  09:00–17:00 · Sen–Sab          │ │
│  └─────────────────────────────────┘ │
│  [🗺 Buka di Google Maps]            │
│                                      │
│  ─── Pilih Tanggal ───               │
│  ◀ Maret 2025 ▶                      │
│  Min Sen Sel Rab Kam Jum Sab         │
│   —   3   4   5   6   7   8          │
│   9  10  11 [12] 13  14  15          │
│  16  17  18  19  20  21  22          │
│  Merah = tidak tersedia              │
│  Teal  = tersedia                    │
│                                      │
│  ─── Pilih Jam (12 Maret) ───        │
│  [09:00] [10:00] [11:00]             │
│  [13:00] [14:00] [15:00] PENUH       │
│  [16:00]                             │
│                                      │
│  ─── Ringkasan ───                   │
│  📅 Rabu, 12 Maret 2025              │
│  🕐 10:00 WIB                        │
│  📍 Tangkas Motors, Kemayoran        │
│                                      │
│  ─── Bawa Dokumen Ini ───            │
│  • KTP Asli                          │
│  • Kartu Keluarga Asli               │
│  • SIM C Aktif                       │
│  • DP (jika berlaku)                 │
│                                      │
│  [    ✅ Konfirmasi Jadwal →        ] │
└──────────────────────────────────────┘
```

**Behavior:**
- Calendar built with pure CSS/HTML (no library needed)
- Past dates greyed out + unclickable
- Non-operating days greyed (e.g. Sunday for Tangkas)
- Each slot has capacity (max 3 pickups per slot)
- Mock slot availability data — generate realistically (some full, some available)
- Confirming creates a `PickupBooking` object and sets status to `pickup_scheduled`
- Confirmation page shown after booking with all details

#### Screen 4b: Already Scheduled — Reschedule or View
```
┌──────────────────────────────────────┐
│  ✅ Jadwal Pickup Terkonfirmasi!     │
│                                      │
│  📅 Rabu, 12 Maret 2025 · 10:00 WIB │
│  📍 Tangkas Motors, Kemayoran        │
│     Jl. Bungur Besar No. 17          │
│                                      │
│  ─── Proses Serah Terima ───         │
│  ✅ Verifikasi Dokumen               │
│  ✅ Penandatanganan Kontrak          │
│  ⟳  Pemeriksaan Motor (aktif)        │
│  ○  Serah Terima Kunci               │
│  ○  Aktivasi GPS Tracker             │
│                                      │
│  [🗺 Buka di Google Maps]            │
│  [📱 Hubungi Dealer WhatsApp]        │
│  [📅 Ubah Jadwal]                    │
└──────────────────────────────────────┘
```

**Handover steps** (hardcoded, simulated progression):
1. Verifikasi Dokumen
2. Penandatanganan Kontrak RTO
3. Pemeriksaan Unit Motor
4. Serah Terima Kunci & STNK
5. Aktivasi GPS Tracker CASAN
6. Onboarding Aplikasi CASAN

---

## Part 6 — Component Library

Build these reusable components:

```
components/
├── ui/
│   ├── ProgramCard.tsx          — program selection card (whole tappable, ℹ detail)
│   ├── ProgramDetailSheet.tsx   — bottom sheet with specs, monthly sim, perks
│   ├── DealerCard.tsx           — dealer grid card
│   ├── ScoreCard.tsx            — live score display (big number + bar)
│   ├── ScoreBreakdownTable.tsx  — per-dimension bars
│   ├── StatusTimeline.tsx       — application lifecycle dots
│   ├── DocumentItem.tsx         — single doc row with upload state
│   ├── DocumentUploadGroup.tsx  — grouped doc section
│   ├── CreditEntry.tsx          — repeatable credit history row
│   ├── DependentRow.tsx         — repeatable dependent row
│   ├── AssetCard.tsx            — big tap card for asset type
│   ├── PillGroup.tsx            — multi-option pill selector
│   ├── RpInput.tsx              — Rp-formatted number input (dot separator)
│   ├── StarRating.tsx           — interactive star widget
│   ├── DSRMeter.tsx             — debt service ratio bar + color zones
│   ├── PickupCalendar.tsx       — date picker with slot availability
│   ├── TimeSlotGrid.tsx         — time slot selection
│   ├── HandoverTimeline.tsx     — pickup progress steps
│   ├── AddressAutocomplete.tsx  — OSM Nominatim search + Leaflet map
│   ├── CountdownTimer.tsx       — rejection cooldown countdown
│   └── NoticeBox.tsx            — info/warning/success notice strip
├── layout/
│   ├── PhoneShell.tsx           — max-w-430 centered shell with grid texture
│   ├── StatusBar.tsx            — sticky top bar (clock + signal)
│   ├── StepNav.tsx              — scrollable step indicator
│   └── CTABar.tsx               — fixed bottom CTA with back button
└── screens/
    ├── WelcomeScreen.tsx
    ├── ApplicationForm/
    │   ├── Step1Identity.tsx
    │   ├── Step2Employment.tsx
    │   ├── Step3Family.tsx
    │   ├── Step4Credit.tsx
    │   ├── Step5Documents.tsx
    │   └── Step6Score.tsx
    ├── StatusScreen.tsx
    ├── NeedDocumentsScreen.tsx
    ├── ApprovedScreen.tsx
    ├── RejectedScreen.tsx
    └── PickupScreen.tsx
```

---

## Part 7 — Mock Data & Simulation

```typescript
// lib/mockApplicationLifecycle.ts

/**
 * Simulates status transitions for demo purposes.
 * In production replace with API polling (GET /applications/:id/status).
 *
 * After submitApplication():
 * - Score >= 80 → after 3s → status: 'approved'
 * - Score 60–79 → after 5s → status: 'approved'
 * - Score 41–59 → after 4s → status: 'need_documents'
 *                            with requestedDocIds: ['slip', 'rekening']
 *                            reviewerNote: "Mohon lengkapi slip gaji 3 bulan terakhir..."
 * - Score < 41  → after 3s → status: 'rejected'
 *                            rejectionReason: "Skor kredit di bawah batas minimum..."
 *                            rejectionCooldownUntil: now + 30 days
 */

export function simulateReview(appId: string, score: number, store: ApplicationStore) {
  const delay = score >= 60 ? 4000 : 3000
  setTimeout(() => {
    if (score >= 60) {
      store.updateApplicationStatus(appId, 'approved')
    } else if (score >= 41) {
      store.updateApplicationStatus(appId, 'need_documents', {
        reviewerNote: 'Mohon lengkapi slip gaji 3 bulan terakhir dan foto KTP yang lebih jelas.',
        requestedDocIds: ['slip', 'selfie'],
      })
    } else {
      store.updateApplicationStatus(appId, 'rejected', {
        rejectionReason: 'Skor kredit di bawah batas minimum program yang dipilih. Disarankan melengkapi penjamin dan menunggu 30 hari.',
      })
    }
  }, delay)
}

// Mock pickup slots — for each date, generate 8 hourly slots from 09:00
export function getMockSlots(date: string, dealerId: DealerId): TimeSlot[] {
  const dealer = DEALERS[dealerId]
  const hours = dealer.pickupHours  // e.g. "09:00–17:00"
  // Parse hours, generate slots, randomly mark some as full
  const slots: TimeSlot[] = []
  for (let h = 9; h <= 16; h++) {
    const time = `${String(h).padStart(2,'0')}:00`
    const spots = Math.floor(Math.random() * 4)  // 0–3 remaining
    slots.push({ time, available: spots > 0, spotsRemaining: spots })
  }
  return slots
}
```

---

## Part 8 — API Contract (for future backend integration)

```typescript
// When ready to connect real backend, implement these endpoints:

// POST /api/applications
// Body: { dealerId, programId, form: ApplicationForm }
// Returns: Application (with status: 'submitted')

// GET /api/applications/:id
// Returns: Application (poll every 30s for status changes)

// PATCH /api/applications/:id/documents
// Body: { docs: UploadedDocument[] }
// Used for: need_documents resubmission

// POST /api/applications/:id/pickup
// Body: { date: string, timeSlot: string }
// Returns: PickupBooking

// GET /api/applications/:id/pickup/availability?date=YYYY-MM-DD
// Returns: TimeSlot[]

// File uploads:
// POST /api/upload
// Body: FormData with file
// Returns: { url: string, fileName: string, fileSize: number }
```

---

## Part 9 — Implementation Notes for the Agent

### Starting order
Build in this sequence to unblock each other:
1. `types/index.ts` — all types first
2. `data/` — dealers, programs, documents static data
3. `lib/scoring.ts` — pure function, easiest to test
4. `store/applicationStore.ts` — Zustand with localStorage persist
5. `PhoneShell` + `StatusBar` + `StepNav` + `CTABar` layout shells
6. `WelcomeScreen` with dealer + program selection
7. `Step1Identity` through `Step6Score` one at a time
8. `StatusScreen` with all 4 sub-states
9. `PickupScreen` with calendar + time slots
10. Wire `lib/mockApplicationLifecycle.ts` to simulate transitions

### Key UX rules
- Score recalculates live on every input change — never block on it
- Form does NOT validate required fields before advancing steps — just show score impact
- Driver can always go back to any step without losing data
- "Buat Aplikasi Baru" after rejection pre-fills form with previous data to minimize re-entry
- All Rp amounts use Indonesian dot notation: `Rp 1.500.000` (use `toLocaleString('id-ID')`)
- All dates display in Indonesian: `Rabu, 12 Maret 2025`
- Phone number format: `+62 812-3456-7890`

### Accessibility & Mobile
- All tap targets minimum 44×44px
- Font sizes minimum 11px
- Bottom CTA always within thumb reach
- Form inputs use `inputMode="numeric"` for Rp fields
- Address autocomplete debounced at 500ms, minimum 4 chars

### Design tokens (match CASAN v12 aesthetics exactly)
```css
--bg: #0d0d0f;     /* page background */
--bg2: #17171b;    /* card background */
--bg3: #1c1c21;    /* input background */
--ac: #00e5c3;     /* CASAN teal accent */
--t1: #f0f0f2;     /* primary text */
--t2: #a0a0b0;     /* secondary text */
--t3: #606070;     /* muted text / labels */
--b1: rgba(255,255,255,.08);  /* card borders */
--gn: #22c55e;     /* success green */
--rd: #f87171;     /* error red */
--am: #fbbf24;     /* warning amber */
font-family: 'Geist', sans-serif;
font-mono: 'Geist Mono', monospace;
```

---

## Deliverable Checklist for the Agent

- [ ] All TypeScript types defined with no `any`
- [ ] Scoring engine produces correct output for all 5 threshold bands
- [ ] Welcome screen: dealer + program selection works, ℹ detail sheet works
- [ ] All 6 form steps render, score updates live
- [ ] Submission transitions status to `submitted` → simulates review
- [ ] Status screen shows correct UI for all 4 sub-states (review/need_docs/approved/rejected)
- [ ] Need-documents: upload inline, resubmit works
- [ ] Rejection: countdown timer works, apply-again pre-fills form
- [ ] Pickup calendar: correct days blocked, slots load, confirmation works
- [ ] Handover timeline shown after pickup scheduled
- [ ] `localStorage` persistence — refresh page keeps state
- [ ] Mobile layout correct at 375px, 390px, 430px viewports
- [ ] All copy in Bahasa Indonesia

---

*CASAN RTO Driver Application — Cursor Agent Prompt v1.0*  
*PT CASAN Energi Indonesia · March 2026*
