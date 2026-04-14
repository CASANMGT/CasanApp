# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Changed

- Home content is now tab-driven: Isi Daya shows only charging stations; RTO and Rent show their own content.
- RTO Status and Ongoing sections are hidden in the Isi Daya tab; they appear only in the Rent to Own tab when the user has an active RTO.

### Fixed

- Rent tab no longer crashes (restored `rupiah` import for price formatting).

---

## [0.0.0] – Initial

- Base app (splash, login, home, charging, sessions, profile, etc.).
