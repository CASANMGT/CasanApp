# CASAN — Frontend

React + TypeScript + Vite client for the CASAN app (charging, Rent to Own, rental, profile, etc.).

---

## RTO application status (`/rto-status/:applicationId`)

Halaman status pengajuan Rent to Own setelah kirim form (demo: review otomatis di Redux).

| Route | Perilaku singkat |
|-------|------------------|
| `/rto-status/:id` | Status aplikasi: ringkasan, skor (jika sudah ada keputusan), aksi per status, alur proses, program. |
| `/rto-status/latest` | Mengambil aplikasi terakhir di daftar. |
| `/rto-pickup/:id` | Jadwal ambil motor → `pickup_scheduled`. |

**Tema warna (semantic, bukan teal seragam):**

- **Netral (submitted / under_review):** abu-biru slate — menunggu, bukan hasil akhir.
- **Aksi (need_documents):** amber — perlu tindakan pengguna.
- **Positif (approved / pickup_scheduled / pickup_done):** hijau — disetujui & lanjut.
- **Negatif (rejected):** rose/merah — tidak dilanjutkan.

Latar halaman memakai **gradient vertikal** yang konsisten sepanjang scroll; kartu konten putih dengan border netral.

**UX utama:**

- **Menunggu review:** kartu “Menunggu keputusan” dengan indikator pulse (tanpa breakdown skor penuh).
- **Skor:** setelah ada keputusan, kartu skor + keputusan pengajuan tepat di bawah ringkasan status.
- **Alur proses:** bilah horizontal (4 langkah) menggantikan stepper vertikal panjang.
- **Pickup:** peta + alamat; foto cabang di **bottom sheet**; checklist dokumen di modal.
- **Program:** **sticky footer** mini (thumbnail, nama, harga, tombol Detail) tetap terlihat saat scroll.
- **Ditolak:** CTA utama hijau “Jelajahi program lainnya”; share & support sebagai sekunder.

Kode utama: `src/pages/RTOStatus/index.tsx`.

---

## Changelog

| Where | Purpose |
|--------|---------|
| **[CHANGELOG.md](./CHANGELOG.md)** | Full project history (Keep a Changelog). |
| **`src/common/changelog.ts`** (`APP_CHANGELOG`) | In-app “What’s new” / release notes in the app. |

Keep these in sync when you ship user-facing changes.

### Unreleased (highlights)

**Added**

- **Home — 3-card navigation:** Isi Daya (charging only), Rent to Own (RTO + jelajahi), Rent (sewa + filters).
- **Tab styling:** Active tab border + dot; background tint per tab.
- **RTO tab:** Mock program list + pagination + Ajukan.
- **Rent tab:** Mock rental cards.
- **RTO program details:** Jelajahi → dealer list (distance / nearest sort) → **dealer** (banner, WA share, branches + km, Maps, hours, call/WA, photos, motor list) → **motor** (gallery, Harian & min gaji, specs, charging + stations, jadwal bayar + estimated finish, benefits, apply + WA). Multi-bike mock data per operator; weekend-excluded payment estimate from “today”.
- **RTO multi-step apply:** `/rto-apply` (6 langkah + skor live, gate min. gaji, persist).
- **RTO status & pickup:** `/rto-status/:id` (mock review, need docs / rejected / approved, lanjut edit), `/rto-pickup/:id` (jadwal ambil).
- **RTO status UX (polish):** tema warna per status, timeline horizontal, kartu menunggu keputusan, foto cabang di sheet, footer program sticky, CTA hijau saat ditolak — lihat [CHANGELOG.md](./CHANGELOG.md) bagian Unreleased.
- **Home:** kartu aplikasi RTO terbaru (sembunyi jika `pickup_done`).

**Changed**

- Home is tab-driven; RTO status blocks only on Rent to Own tab when user has active RTO.

**Fixed**

- Rent tab: `rupiah` import restored (no crash).
- `/select-rent-buy` → redirect ke `/rto-program-explore`.

---

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc/blob/main/packages/plugin-react-swc/README.md) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    react,
  },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
