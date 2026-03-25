# PRD: RTO Application Form

**Product**: CASAN Driver App — Rent-to-Own Application  
**Author**: Product & Engineering  
**Status**: Draft  
**Date**: 17 March 2026  
**Version**: 1.0

---

## 1. Overview

### 1.1 Problem Statement

CASAN's driver app currently lets users browse RTO programs (explore operators, view bike details, compare prices) but has no way for a driver to actually **apply** for a program. The "Ajukan Program Ini" button on the bike detail page navigates to a placeholder screen (`/select-rent-buy`) with hardcoded dummy cards and no functionality.

Drivers who want to apply must contact dealers manually via WhatsApp, go through an offline paper-based process, and wait for callbacks with no visibility into their application status. This creates:

- **High drop-off**: Drivers who browse programs but cannot apply in-app leave the funnel
- **No creditworthiness signal**: Dealers receive applications with no structured data to assess risk
- **Opaque process**: Drivers have no visibility into whether their application is being reviewed, approved, or rejected
- **Manual coordination**: Pickup scheduling is done over WhatsApp, leading to no-shows and double-bookings

### 1.2 Solution

Add an in-app **multi-step application form** with a **real-time creditworthiness scoring engine** that:

1. Captures structured driver data across 6 categories (identity, employment, family, credit history, documents)
2. Calculates a live score (0-100) as the driver fills the form — no hard validation blocks
3. Submits to a review queue with score-based routing (auto-approve, manual review, conditional, declined)
4. Provides a status tracker so drivers can see exactly where their application stands
5. Enables approved drivers to schedule a physical pickup at the dealer location

### 1.3 Scope

- **In scope**: RTO programs only (Rent-to-Own motor listrik)
- **Out of scope**: Rental programs (these have their own separate flow), admin/dealer review dashboard, payment processing, real backend API integration (mock-first approach with localStorage)
- **Target users**: EV motorcycle drivers in Jabodetabek applying through CASAN dealer partners

---

## 2. User Journey

### 2.1 Current State (as-is)

```
Home (RTO tab) -> Jelajahi Program -> Operator Detail -> Bike Detail -> [Dead End]
```

The "Ajukan Program Ini" button goes to a placeholder with no functionality.

### 2.2 Target State (to-be)

```
Home (RTO tab) -> Jelajahi Program -> Operator Detail -> Bike Detail
  -> "Ajukan Program Ini"
  -> Application Form (6 steps)
  -> Submit
  -> Status Tracker (submitted / need_docs / approved / rejected)
  -> [If approved] Pickup Scheduler -> Handover
```

### 2.3 Entry Point

The driver arrives at the application form **from the bike detail page** (`RTOMotorbikeProgram`). The selected operator and bike are passed via navigation state. There is no separate dealer/program selection screen — the existing browse flow already handles this.

---

## 3. Functional Requirements

### 3.1 Application Form

#### FR-01: 6-Step Multi-Step Form

The application form is divided into 6 sequential steps. Each step is a separate screen with a step indicator at the top and a fixed CTA bar at the bottom.

| Step | Title | Purpose |
|------|-------|---------|
| 1 | Data Diri | Identity, address, housing status |
| 2 | Pekerjaan & Penghasilan | Employment, income, expenses, assets |
| 3 | Keluarga & Penjamin | Guarantor, spouse, dependents |
| 4 | Riwayat Kredit | Credit history, SLIK score, active loans |
| 5 | Dokumen | Upload required and optional documents |
| 6 | Review Skor | Live score display, breakdown, submit |

#### FR-02: Step 1 — Data Diri

Fields:
- Nama Lengkap (text, required for scoring)
- NIK (16 digits, live validation indicator)
- Tempat Lahir (text/datalist)
- Tanggal Lahir (date picker, shows live age calculation: "Usia: 28 tahun")
- Jenis Kelamin (pill selector: Laki-laki / Perempuan)
- Status Nikah (select: Belum Menikah / Menikah / Cerai Hidup / Cerai Mati)
- No HP WhatsApp (tel input)
- Kontak Darurat: Nama, No HP, Hubungan

Address section:
- Alamat Lengkap (text, later enhanced with OSM Nominatim autocomplete + Leaflet map pin)
- Kecamatan (text)
- Kota / Kabupaten (text)
- Provinsi (text)
- Status Hunian (pill: Milik Sendiri / Kontrak / Keluarga / Dinas / Lainnya)
- Lama Tinggal (pill: <1 tahun / 1-2 tahun / 2-5 tahun / 5-10 tahun / 10+ tahun)

#### FR-03: Step 2 — Pekerjaan & Penghasilan

Fields:
- Profesi (select dropdown with 17 options):
  - Driver Ojek Online (Gojek/Grab/Maxim)
  - Driver Ojol < 6 bulan
  - Kurir (J&T/SiCepat/Ninja)
  - Karyawan Tetap
  - Karyawan Kontrak
  - PNS / ASN
  - TNI / Polri
  - Pensiunan
  - Wiraswasta / Pedagang
  - Pedagang Pasar
  - Pemilik Warung / UMKM
  - Tukang / Jasa
  - Supir / Transporter
  - Satpam / Security
  - Freelancer
  - Petani / Nelayan / Peternak
  - Lainnya

- Conditional fields based on profession:
  - **Ojol**: Platform (Gojek/Grab/Maxim/Semua), Durasi berkendara, Rating (1-5 star widget)
  - **Wiraswasta/Pedagang/Warung**: Nama Usaha, Durasi Usaha, Alamat Usaha
  - **Karyawan/PNS/TNI**: Nama Instansi/Perusahaan, No HP Instansi

- Penghasilan Utama per Bulan (Rp input with dot formatting)
- Penghasilan Tambahan per Bulan (optional, Rp input)
- Pengeluaran Rutin per Bulan (Rp input)
- DSR (Debt Service Ratio) displayed inline: "Rasio beban: XX%" with color indicator (green/amber/red)
- Saldo Tabungan Saat Ini (pill: Tidak ada / < Rp 1 Jt / Rp 1-3 Jt / Rp 3-5 Jt / > Rp 5 Jt)

- Aset yang dimiliki (toggleable cards with value input when enabled):
  - Tanah / Properti
  - Bangunan / Rumah
  - Kendaraan Bermotor
  - Tabungan / Deposito
  - Usaha / Toko

#### FR-04: Step 3 — Keluarga & Penjamin

Fields:
- Tipe Penjamin (pill: Tidak Ada / Orang Tua / Saudara / Pasangan / Atasan / Lainnya)
  - If selected: Nama, NIK, No HP, Hubungan, Penghasilan per Bulan, Alamat
- Pasangan (shown only if maritalStatus = "Menikah"):
  - Nama Pasangan, Pekerjaan Pasangan, Penghasilan Pasangan
- Tanggungan (repeatable rows, add/remove):
  - Nama, Usia, Jenis (Anak / Orang Tua / Saudara / Lainnya)
  - Warning displayed if > 4 tanggungan: "Banyak tanggungan dapat mempengaruhi skor"

#### FR-05: Step 4 — Riwayat Kredit

Fields:
- "Apakah pernah punya kredit/pinjaman?" (pill: Ya / Tidak)
  - If **Tidak**: Show positive notice "Tidak ada riwayat kredit = skor netral positif"
  - If **Ya**:
    - Skor SLIK / Kolektibilitas (pill: Kol 1 through Kol 5 with descriptions)
    - Credit entries (repeatable rows):
      - Nama Lembaga, Jenis Kredit (KPR/Kendaraan/KTA/etc.), Cicilan per Bulan (Rp), Sisa Bulan, Status (Lunas/Aktif/Macet), Tepat Waktu (Ya/Tidak)
    - Total cicilan aktif auto-calculated
    - DSR impact displayed

#### FR-06: Step 5 — Dokumen

13 documents organized in 4 groups:

**Wajib — Identitas (4)**:
- KTP Asli
- Kartu Keluarga
- SIM C Aktif
- Selfie + KTP

**Wajib — Keuangan (2)**:
- Slip Gaji / Screenshot Income (3 bulan terakhir)
- Rekening Koran (mutasi 3 bulan)

**Opsional (2)**:
- Surat Keterangan Kerja
- NPWP

**Boost Skor (5)** — each shows point value badge:
- Bukti Tabungan > Rp 1 Jt (+4 pts)
- BPJS Ketenagakerjaan (+3 pts)
- Screenshot Rating OJOL >= 4.5 (+2 pts)
- KTP Penjamin (+5 pts)
- Sertifikat / BPKB Kendaraan (+3 pts)

Each document: tap to open file picker (accept image/*, PDF), show filename + file size after upload, green border + checkmark when uploaded. Missing required documents highlighted in amber.

#### FR-07: Step 6 — Review Skor

Displays:
- Large score number (X/100) with color-coded decision label
- Decision text and estimated timeline (e.g., "Dealer hubungi via WhatsApp dalam 24 jam")
- Per-dimension breakdown bars (Identity, Income, Employment, Family, Credit, Documents — each showing current/max)
- Warning for missing required documents with specific names
- Selected program recap (operator name, bike model, daily rate)
- "Submit Aplikasi" CTA — always enabled regardless of score or completeness

#### FR-08: Form Navigation

- Driver can navigate forward and backward between steps freely
- No hard validation blocks — advancing with missing fields is allowed (score reflects the impact)
- Browser back button goes to the previous step (not out of the form)
- All form data persists in local storage — closing and reopening the app resumes where the driver left off
- Score recalculates live on every field change (debounced 300ms)

### 3.2 Creditworthiness Scoring Engine

#### FR-09: Scoring Dimensions

Total: 100 points across 6 dimensions:

| Dimension | Max Points | Key Factors |
|-----------|-----------|-------------|
| Identity | 18 | Name, NIK validity, age (21-55 optimal), address completeness, housing stability, tenure |
| Income | 22 | Total income brackets (Rp 2M-7M+), DSR penalty (>50% or >70%), savings bonus |
| Employment | 15 | Profession type (PNS highest, ojol mid-tier with duration/rating bonuses), asset ownership |
| Family | 12 | Guarantor type + income, marital status, spouse income, dependent count penalty |
| Credit | 18 | SLIK score (Kol 1 = 12pts), credit entry status (lunas bonus, macet penalty), on-time payment, DSR from installments |
| Documents | 15 | Required doc completion (proportional), boost doc bonuses (half points), program selection |

#### FR-10: Score Decision Thresholds

| Score Range | Decision | Label (ID) | Action |
|-------------|----------|------------|--------|
| >= 80 | AUTO-APPROVED | Disetujui Otomatis | Motor ready 1-2 business days |
| 60-79 | APPROVED | Disetujui | Dealer contacts via WhatsApp within 24 hours |
| 41-59 | UNDER REVIEW | Sedang Direview | Manual analysis 1-3 business days |
| 21-40 | CONDITIONAL | Perlu Penjamin | Complete guarantor + additional documents |
| < 21 | DECLINED | Tidak Disetujui | Can reapply after 30 days |

### 3.3 Application Submission

#### FR-11: Submit Action

- Generates unique application ID (format: `CASAN-XXXXXX`)
- Records: dealer info, program info, complete form data, calculated score, timestamp
- Sets status to `submitted`
- Navigates to status tracker screen
- Triggers mock review simulation (see FR-13)

### 3.4 Status Tracker

#### FR-12: Application Status States

```
draft -> submitted -> under_review -> approved -> pickup_scheduled -> pickup_done
                                   -> need_documents -> submitted (resubmit)
                                   -> rejected
```

#### FR-13: Mock Review Simulation

After submission, the system simulates a review process:

| Score | Delay | Outcome |
|-------|-------|---------|
| >= 60 | 5 seconds | `approved` |
| 41-59 | 4 seconds | `need_documents` (with specific doc requests and reviewer note) |
| < 41 | 3 seconds | `rejected` (with reason and 30-day cooldown) |

Status is polled every 30 seconds (or via mock setTimeout for demo).

#### FR-14: Status — Submitted / Under Review

Displays:
- Application ID
- Status timeline (4 steps: Terkirim, Sedang Direview, Keputusan, Ambil Motor) with animated pulse on current step
- Score summary
- Selected program info
- "Edit & Lengkapi Aplikasi" — reopens form in edit mode, pre-filled with existing data
- "Hubungi Dealer via WhatsApp" — opens WhatsApp with dealer number
- Estimated timeline based on score decision

#### FR-15: Status — Need Documents

Displays:
- Reviewer note explaining what is needed
- Only the specific documents requested (from `requestedDocIds`)
- Inline upload for each requested document
- "Upload & Kirim Ulang" — resubmits application, sets status back to `submitted`
- "Hubungi Dealer WhatsApp"

#### FR-16: Status — Approved

Displays:
- Congratulations message
- Score and decision
- Next steps checklist:
  1. Jadwalkan ambil motor
  2. Bawa dokumen asli
  3. Tanda tangan kontrak
  4. Motor langsung bisa dibawa
- "Atur Jadwal Ambil Motor" CTA — navigates to pickup scheduler
- "Hubungi Dealer WhatsApp"

#### FR-17: Status — Rejected

Displays:
- Rejection reason from reviewer
- Score comparison (driver's score vs. program minimum)
- Tips to improve score (specific suggestions with point values, e.g., "Tambahkan penjamin (+6 pts)")
- Countdown timer to reapply eligibility (30 days from rejection)
- "Daftar Ulang Setelah 30 Hari" — disabled until cooldown expires; when active, opens form pre-filled with previous data
- "Pilih Program Lebih Terjangkau" — navigates back to program browse
- "Hubungi CASAN Support"

### 3.5 Pickup Scheduler

#### FR-18: Pickup Calendar

Accessible only when status is `approved` or `pickup_scheduled`.

Displays:
- Dealer location card (name, address, operating hours)
- "Buka di Google Maps" link
- Calendar grid (current month):
  - Past dates greyed and disabled
  - Non-operating days greyed (respects dealer schedule)
  - 14-day booking window
- Time slot selection (hourly pills based on dealer operating hours):
  - Available slots show remaining capacity
  - Full slots marked as "PENUH" and disabled
  - Max 3 pickups per slot
- Booking summary (selected date, time, dealer info)
- "Bawa Dokumen Ini" checklist (KTP Asli, Kartu Keluarga Asli, SIM C Aktif, DP jika berlaku)
- "Konfirmasi Jadwal" CTA

#### FR-19: Pickup Confirmation and Handover

After confirming:
- Status changes to `pickup_scheduled`
- Shows confirmation with full booking details
- Handover timeline with 6 steps (simulated progression):
  1. Verifikasi Dokumen
  2. Penandatanganan Kontrak RTO
  3. Pemeriksaan Unit Motor
  4. Serah Terima Kunci & STNK
  5. Aktivasi GPS Tracker CASAN
  6. Onboarding Aplikasi CASAN
- "Buka di Google Maps"
- "Hubungi Dealer WhatsApp"
- "Ubah Jadwal" — allows rescheduling

### 3.6 Data Persistence

#### FR-20: Local Storage

- Form draft auto-saves to `localStorage` on every field change
- Submitted applications persist across browser sessions
- Closing and reopening the app resumes the form where the driver left off
- Document file objects (images/PDFs) are stored in memory only (not serialized)

---

## 4. Non-Functional Requirements

### 4.1 Performance

- **NFR-01**: Form step transitions must feel instant (< 100ms)
- **NFR-02**: Score recalculation must complete within 50ms (pure function, no network)
- **NFR-03**: Address autocomplete results must appear within 1 second of typing (when implemented)

### 4.2 Mobile-First Design

- **NFR-04**: All layouts optimized for 375px, 390px, and 430px viewport widths
- **NFR-05**: All interactive elements (buttons, pills, cards) minimum 44x44px touch target
- **NFR-06**: Font size minimum 11px
- **NFR-07**: Bottom CTA bar always within thumb reach with safe-area padding
- **NFR-08**: Form inputs use `inputMode="numeric"` for currency fields to trigger numeric keyboard

### 4.3 Accessibility

- **NFR-09**: Step indicator uses ARIA roles (`role="tablist"`, `aria-selected`)
- **NFR-10**: Progress bars use `role="progressbar"` with `aria-valuenow/min/max`
- **NFR-11**: All form fields have associated labels
- **NFR-12**: Color is not the sole indicator of state (icons/text accompany color changes)

### 4.4 Localization

- **NFR-13**: All UI copy in Bahasa Indonesia
- **NFR-14**: Currency formatted as Indonesian: `Rp 1.500.000` (dot thousands separator)
- **NFR-15**: Dates formatted in Indonesian: `Rabu, 12 Maret 2025`
- **NFR-16**: Code and variable names in English

### 4.5 Security

- **NFR-17**: All application routes require authentication (wrapped in `ProtectedRoute`)
- **NFR-18**: No sensitive data (NIK, financial info) logged to console in production
- **NFR-19**: Document uploads accept only image/* and application/pdf

### 4.6 Design System

Use the existing app's light theme with teal accent:
- Primary accent: `#4DB6AC`
- Card background: white with subtle shadow
- Text: standard Tailwind gray scale
- Consistent with existing RTO browse flow styling (`rtoCard`, `rtoSectionTitle` tokens)

---

## 5. Technical Architecture

### 5.1 Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React 18 + Vite | Existing |
| Routing | React Router 7 | Existing; new routes added |
| State | Redux Toolkit | Existing; new slice for application form |
| Styling | Tailwind CSS | Existing; reuse design tokens |
| Maps | Leaflet + OpenStreetMap | Existing; reuse Map molecule |
| File Upload | Firebase Storage | Existing `uploadImageToFirebase()` helper |
| Persistence | localStorage | For form draft and application data |

### 5.2 State Management

New Redux slice (`rtoApplicationSlice`) with shape:

```
{
  draft: Partial<ApplicationForm>     -- current form data
  selectedDealerId: string | null     -- from RTOExploreOperator
  selectedBikeId: string | null       -- from RTOExploreBike
  currentStep: number                 -- -1=not started, 1-6=form steps
  applications: Application[]         -- submitted applications
  activeApplicationId: string | null  -- which one driver is tracking
}
```

Persisted to `localStorage` key `rto_application_state`.

### 5.3 Routing

| Route | Screen | Auth |
|-------|--------|------|
| `/rto-apply` | Application form (step managed via `?step=N` URL param) | Required |
| `/rto-status/:applicationId` | Status tracker (routes to sub-screen by status) | Required |
| `/rto-pickup/:applicationId` | Pickup scheduler | Required |

Browser back button navigates between form steps naturally via URL params.

### 5.4 Data Flow

```
RTOMotorbikeProgram
  |
  | navigate('/rto-apply', { state: { operatorId, bikeId } })
  v
RTOApply (index.tsx)
  |
  | reads operator + bike from existing rtoProgramExplore data
  | renders Step1-Step6 based on ?step param
  | Redux draft updates on every field change
  | Score recalculates via useEffect + debounce
  v
Submit -> creates Application object -> stores in Redux + localStorage
  |
  | navigate('/rto-status/:id')
  v
RTOStatus (index.tsx)
  |
  | reads application by ID from Redux
  | renders sub-screen based on application.status
  | mock lifecycle transitions via setTimeout
  v
[If approved] -> navigate('/rto-pickup/:id')
  |
  v
RTOPickup -> book slot -> PickupConfirmed -> handover timeline
```

---

## 6. Implementation Strategy

### 6.1 Vertical Slices

The feature is built in 6 vertical slices, each producing a testable end-to-end increment:

| Slice | Deliverable | Files |
|-------|------------|-------|
| 1 | Minimal form (2 steps) + submit + status screen | ~10 new, 4 modified |
| 2 | All 6 form steps + input components | ~10 new, 2 modified |
| 3 | Full scoring engine + live display | ~4 new, 2 modified |
| 4 | Status sub-screens + mock transitions | ~6 new, 1 modified |
| 5 | Pickup scheduler + handover timeline | ~3 new, 1 modified |
| 6 | Polish (address autocomplete, edge cases, changelog) | ~2 new, 3 modified |

### 6.2 Existing Component Reuse

| Component | Source | Used In |
|-----------|--------|---------|
| `UploadImage` | `components/atoms/UploadImage.tsx` | Step 5 document upload |
| `CountdownTimer` | `components/atoms/CountdownTimer.tsx` | Rejected status cooldown |
| `Map` (Leaflet) | `components/molecules/Map/` | Address pin preview |
| `openWhatsApp()` | `helpers/linking.ts` | All status screens |
| `openGoogleMaps()` | `helpers/linking.ts` | Pickup scheduler |
| `uploadImageToFirebase()` | `helpers/uploadImage.ts` | Document upload to cloud |
| `Input`, `Dropdown`, `Button` | `components/atoms/` | Form fields |
| `Header2` | `components/atoms/Header2.tsx` | Screen headers |

---

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Form completion rate | > 60% of started applications are submitted | `applications.length / draft starts` |
| Average completion time | < 15 minutes for full 6-step form | Time from step 1 entry to submit |
| Score distribution | Bell curve centered around 50-60 | Score histogram of submitted applications |
| Status check frequency | > 2 status checks per submitted application | Status screen page views per application |
| Pickup scheduling rate | > 80% of approved applications schedule pickup | `pickup_scheduled / approved` |

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Drivers abandon long form | High drop-off | No hard validation — drivers can submit incomplete forms; score reflects impact. Draft auto-saves. |
| Mock lifecycle confuses users | Users think app is real | Clear "demo" or "simulasi" labels on mock transitions (can be toggled for production) |
| localStorage data loss | Driver loses form progress | localStorage is reliable on mobile browsers; warn if storage is full |
| Score algorithm needs tuning | Unfair approvals/rejections | Scoring engine is a pure function — easy to adjust thresholds without UI changes |
| Address autocomplete rate limits | OSM Nominatim blocks requests | Debounce at 500ms, min 4 chars; plain text fallback always available |

---

## 9. Future Considerations (Out of Scope)

- **Real backend API**: Replace localStorage with REST API (`POST /api/applications`, `GET /api/applications/:id`, etc.)
- **Admin/dealer review dashboard**: Web portal for dealers to review, approve, request documents
- **Push notifications**: Notify driver when status changes (via Firebase Cloud Messaging)
- **Rental program support**: Extend application form to support Rent programs
- **E-signature**: Digital contract signing within the app
- **Payment integration**: DP (down payment) collection at application or pickup
- **Document verification**: OCR for KTP/SIM validation
- **Credit bureau integration**: Real SLIK/BI checking score from OJK

---

## 10. Appendix

### A. Application Status State Machine

```
                                 +--> need_documents --+
                                 |                     |
draft --> submitted --> under_review --> approved --> pickup_scheduled --> pickup_done
                                 |
                                 +--> rejected
```

- `need_documents` -> `submitted` (via resubmit)
- `rejected` -> `draft` (via apply again after 30-day cooldown, pre-filled)

### B. Document Requirements Matrix

| ID | Document | Category | Required | Boost Points |
|----|----------|----------|----------|-------------|
| ktp | KTP Asli | Identity | Yes | 0 |
| kk | Kartu Keluarga | Identity | Yes | 0 |
| sim | SIM C Aktif | Identity | Yes | 0 |
| selfie | Selfie + KTP | Identity | Yes | 0 |
| slip | Slip Gaji / Screenshot Income | Financial | Yes | 0 |
| rekening | Rekening Koran | Financial | Yes | 0 |
| sktm | Surat Keterangan Kerja | Financial | No | 0 |
| npwp | NPWP | Financial | No | 0 |
| tabungan | Bukti Tabungan > Rp 1 Jt | Boost | No | 4 |
| bpjs_tk | BPJS Ketenagakerjaan | Boost | No | 3 |
| ref_ojol | Screenshot Rating OJOL >= 4.5 | Boost | No | 2 |
| gu_ktp | KTP Penjamin | Boost | No | 5 |
| sertif | Sertifikat / BPKB Kendaraan | Boost | No | 3 |

### C. Profession Scoring Weight

| Profession | Base Score (out of 15) |
|-----------|----------------------|
| PNS / ASN, TNI / Polri | 14 |
| Karyawan Tetap, Pensiunan | 11 |
| Karyawan Kontrak, Kurir | 8 |
| Driver Ojol | 7 + duration bonus (1-5) + rating bonus (1-3) |
| Wiraswasta / Pedagang / Warung | 7 + business duration bonus (1-5) |
| Tukang / Supir / Security / Freelance | 7 |
| Petani / Nelayan / Peternak | 6 |
| Lainnya | 3 |

### D. Handover Steps (Pickup)

1. Verifikasi Dokumen
2. Penandatanganan Kontrak RTO
3. Pemeriksaan Unit Motor
4. Serah Terima Kunci & STNK
5. Aktivasi GPS Tracker CASAN
6. Onboarding Aplikasi CASAN
