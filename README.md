# CASAN — Frontend

React + TypeScript + Vite client for the CASAN app (charging, Rent to Own, rental, profile, etc.).

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
