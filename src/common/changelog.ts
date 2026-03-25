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
      {
        title: "RTO program details (multi-bike)",
        details: [
          "Jelajahi program lain: daftar dealer, jarak ke cabang terdekat, urut terdekat jika lokasi diizinkan.",
          "Halaman dealer: banner program, bagikan WhatsApp, pill cabang + km, Google Maps, jam buka, telepon & WhatsApp, foto dealer, daftar motor (Harian & min. gaji).",
          "Halaman motor: galeri sudut tampilan, kartu Harian (Rp untuk N hari) & Min. gaji, tenaga & spesifikasi, charging + jumlah stasiun terdekat, jadwal bayar + estimasi selesai, benefit, ajukan program & share WA.",
          "Estimasi lunas: hari kerja (luar Sabtu–Minggu), dihitung dari hari ini; beberapa motor per operator (mock).",
          "UI RTO dirapikan: kartu & judul section konsisten (alur Jelajahi → dealer → motor).",
        ],
      },
      {
        title: "Pengajuan RTO multi-langkah",
        details: [
          "Rute /rto-apply: enam langkah (identitas, pekerjaan & aset, keluarga & penjamin, riwayat kredit, dokumen, skor live).",
          "Skoring memperhatikan min. gaji program; draft disimpan di perangkat.",
          "Dari halaman motor: Ajukan membawa minSalary operator ke alur apply.",
        ],
      },
      {
        title: "Status & jadwal ambil RTO (mock)",
        details: [
          "/rto-status/:id: submitted, review, approved, need_documents, rejected; lanjut edit kembali ke apply.",
          "/rto-pickup/:id: pilih tanggal & slot → pickup_scheduled.",
        ],
      },
      {
        title: "Beranda — kartu pengajuan",
        details: [
          "Menampilkan aplikasi RTO terbaru yang masih berjalan; disembunyikan setelah pickup_done.",
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
      {
        title: "Rute select-rent-buy",
        details: [
          "Mengalihkan ke /rto-program-explore agar satu pintu masuk jelajahi program RTO.",
        ],
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
