# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **RTO status screen — UX & visual system** (`/rto-status/:applicationId`):
  - Semantic color families per status (slate pending, amber action-needed, green positive outcomes, rose rejected); page background uses full-height vertical gradients; content cards stay white with neutral borders.
  - **Pending (`submitted`, `under_review`):** “Menunggu keputusan” card with pulsing indicator instead of full score breakdown before a decision exists.
  - **Score + credit decision** shown directly under the summary card once a decision applies (not for rejected — score lives inside rejection summary).
  - **Process flow:** compact **horizontal** 4-step tracker with connectors and active-state pulse (replaces tall vertical stepper).
  - **Pickup scheduled:** map row, **photo gallery** in a **bottom sheet**, document checklist in existing modal; paired “Foto (n)” / “Dokumen (n)” actions.
  - **Sticky program footer:** fixed bottom bar with bike thumb, title, price, and **Detail** CTA on all statuses.
  - **Rejected:** primary CTA “Jelajahi program lainnya” as solid green; share/support secondary.
- **Home: 3-card top navigation** — Service cards below search bar to switch between:
  - **Isi Daya** — Charging: shows "Stasiun terdekat" and charging station list only (no RTO/Ongoing in this tab).
  - **Rent to Own** — Shows active RTO program (if logged in), "Jelajahi motor lainnya" with program list and pagination.
  - **Rent** — Sewa motor listrik: filter pills (Semua, Harian, Mingguan, Bulanan) and mock rental listings with "Sewa →".
- **Tab styling** — Active tab has colored border and dot indicator; inactive tabs are dimmed. Background gradient changes by tab (green / orange / blue).
- **Program list (RTO tab)** — Hardcoded program catalog when API is unavailable (Sponge, RTO Januari, Testing Endi, etc.) with "Lihat program lainnya →" pagination and "Ajukan →" per program.
- **Rent tab** — Mock rental cards (Maka Motors R1, United T1800, Uwinfly C70) with price and "Sewa →" button.
- **RTO program details (multi-bike)** — **Jelajahi program lain** → dealer → motor:
  - Dealer list: nearest-branch distance, sort by location when GPS is available.
  - **Dealer**: program banner, WhatsApp share, branch pills + km, Google Maps, hours, call/WhatsApp, dealership photos, motor list (Harian & min. salary).
  - **Motor**: angle gallery, Harian (Rp for N days) & min. salary cards, specs & charging + nearby station count, payment schedule + estimated completion, benefits, apply + WhatsApp share.
  - Completion estimate: weekdays only (excludes Sat–Sun), anchored to “today”; mock data with multiple bikes per operator.
  - RTO screens: shared card/section styling for a cleaner flow.
- **RTO multi-step application** — `/rto-apply` (query `?step=`) with six steps: identitas, pekerjaan & aset, keluarga & penjamin, riwayat kredit, unggah dokumen, **skor live** dari mesin scoring (memperhatikan **min. gaji program**). Draft + status tersimpan di `localStorage`; mulai dari halaman motor dengan `minSalary` operator.
- **RTO status (mock review)** — `/rto-status/:applicationId`: alur `submitted` → `under_review` → `approved` / `need_documents` / `rejected`; panel permintaan dokumen, penolakan, persetujuan; **Edit** melanjutkan ke `/rto-apply` dengan data draft.
- **Jadwal ambil motor** — `/rto-pickup/:applicationId`: strip tanggal + slot waktu → `pickup_scheduled` dan detail booking.
- **Beranda — kartu pengajuan** — Kartu “Aplikasi pengajuan” untuk aplikasi RTO terbaru yang masih berjalan (disembunyikan jika status `pickup_done`).

### Changed

- Home content is now tab-driven: Isi Daya shows only charging stations; RTO and Rent show their own content.
- RTO Status and Ongoing sections are hidden in the Isi Daya tab; they appear only in the Rent to Own tab when the user has an active RTO.
- **RTO status:** score section position unified (below summary for all non-rejected flows); demo review banner for pending states uses neutral slate styling; pickup location card simplified before opening photo sheet.

### Fixed

- Rent tab no longer crashes (restored `rupiah` import for price formatting).
- **Ruta lama Sewa/Beli** — `/select-rent-buy` mengalihkan ke `/rto-program-explore` (alur RTO resmi).

---

## [0.0.0] – Initial

- Base app (splash, login, home, charging, sessions, profile, etc.).
