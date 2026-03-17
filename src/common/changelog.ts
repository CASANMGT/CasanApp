export type ChangelogSection = "added" | "changed" | "fixed";

export type ChangelogEntry = {
  title: string;
  details?: string[];
};

export type ChangelogRelease = {
  version: string;
  date?: string;
  added?: ChangelogEntry[];
  changed?: ChangelogEntry[];
  fixed?: ChangelogEntry[];
};

export const APP_CHANGELOG: ChangelogRelease[] = [
  {
    version: "Unreleased",
    added: [
      {
        title: "Home: 3-card top navigation",
        details: [
          "Isi Daya — Charging: shows Stasiun terdekat and charging station list only.",
          "Rent to Own — Active RTO program (if logged in), Jelajahi motor lainnya with program list and pagination.",
          "Rent — Sewa motor listrik: filter pills (Semua, Harian, Mingguan, Bulanan) and rental listings with Sewa →.",
        ],
      },
      {
        title: "Tab styling",
        details: [
          "Active tab has colored border and dot indicator; inactive tabs are dimmed.",
          "Background gradient changes by tab (green / orange / blue).",
        ],
      },
      {
        title: "Program list (RTO tab)",
        details: [
          "Hardcoded program catalog when API is unavailable (Sponge, RTO Januari, Testing Endi, etc.).",
          "Lihat program lainnya → pagination and Ajukan → per program.",
        ],
      },
      {
        title: "Rent tab",
        details: [
          "Mock rental cards (Maka Motors R1, United T1800, Uwinfly C70) with price and Sewa → button.",
        ],
      },
    ],
    changed: [
      {
        title: "Home content is now tab-driven",
        details: [
          "Isi Daya shows only charging stations.",
          "RTO Status and Ongoing sections appear only in the Rent to Own tab when the user has an active RTO.",
        ],
      },
    ],
    fixed: [
      {
        title: "Rent tab",
        details: ["Restored rupiah import for price formatting so the Rent tab no longer crashes."],
      },
    ],
  },
  {
    version: "0.0.0",
    date: "Initial",
    added: [
      {
        title: "Base app",
        details: ["Splash, login, home, charging, sessions, profile, and related flows."],
      },
    ],
  },
];
