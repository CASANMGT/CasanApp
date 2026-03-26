/** Mock data for Rent to Own program explore (replace with API when available). */

export type RTOExploreBike = {
  id: string;
  name: string;
  year: string;
  tag?: string;
  watt: string;
  batteryWh: string;
  rangeKm: string;
  volt: string;
  amp: string;
  speed: string;
  weight: string;
  tire: string;
  chargeTime: string;
  pricePerDay: number;
  minPayment: number;
  /** Hari bayar (Sen–Jum); Sabtu–Minggu tidak dihitung */
  totalPaymentDays: number;
  /** Short line for list pills */
  specLine: string;
  /** Motorbike listing / detail thumbnail */
  photoUrl?: string;
  /** Gallery on bike detail (different angles) */
  gallery?: { src: string; label: string }[];
};

export type RTOExploreReview = {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
};

/** Cabang / outlet under one operator */
export type RTOExploreBranch = {
  id: string;
  label: string;
  address: string;
  phone?: string;
  /** Koordinat untuk jarak & urutan terdekat */
  lat?: number;
  lng?: number;
  /** Lines like "Sel–Min 08:00–20:00" or "Senin libur" */
  scheduleLines: string[];
};

export type RTOExploreOpeningHours = {
  /** e.g. "Selasa–Minggu" or "Setiap hari" */
  openDaysLabel: string;
  timeRange: string;
  /** Hari libur tetap, e.g. ["Senin"] or ["Minggu"] */
  closedDays?: string[];
};

export type RTOExploreOperator = {
  id: string;
  initial: string;
  name: string;
  area: string;
  rating: number;
  reviewCount: number;
  distanceKm: string;
  address: string;
  phone: string;
  hours: string;
  programName: string;
  minSalary: number;
  bikes: RTOExploreBike[];
  benefits: string[];
  /** Wide banner for RTO program (hero) */
  programBanner?: string;
  /** Dealership / outlet photos */
  dealershipPhotos?: string[];
  /** Jam buka terstruktur (libur Senin / Minggu, dll.) */
  openingHours?: RTOExploreOpeningHours;
  /** Beberapa cabang; cabang pertama = lokasi utama (address) jika tidak diisi */
  branches?: RTOExploreBranch[];
  /** Ulasan mock untuk popout */
  mockReviews?: RTOExploreReview[];
  /** Lokasi utama (satu cabang / fallback jarak) */
  lat?: number;
  lng?: number;
};

const EARTH_RADIUS_KM = 6371;

/** Acuan jarak perkiraan bila GPS tidak tersedia (Monas / pusat Jakarta) */
export const RTO_ESTIMATE_DISTANCE_ORIGIN = {
  lat: -6.175392,
  lng: 106.827153,
} as const;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function getBranchLatLng(
  branch: RTOExploreBranch,
  op: RTOExploreOperator,
): [number, number] | null {
  if (typeof branch.lat === "number" && typeof branch.lng === "number") {
    return [branch.lat, branch.lng];
  }
  if (typeof op.lat === "number" && typeof op.lng === "number") {
    return [op.lat, op.lng];
  }
  return null;
}

/** Jarak ke cabang terdekat (km), null jika tidak ada koordinat */
export function nearestBranchDistanceKm(
  op: RTOExploreOperator,
  userLat: number,
  userLng: number,
): number | null {
  const list = getOperatorBranches(op);
  let best: number | null = null;
  for (const b of list) {
    const c = getBranchLatLng(b, op);
    if (!c) continue;
    const d = haversineKm(userLat, userLng, c[0], c[1]);
    if (best === null || d < best) best = d;
  }
  return best;
}

export function formatRtoDistanceKm(km: number): string {
  if (!Number.isFinite(km)) return "—";
  if (km < 10) return km.toFixed(1);
  return String(Math.round(km));
}

export type RTOExploreBranchWithDistance = RTOExploreBranch & { distanceKm: number };

export function branchesSortedByDistance(
  op: RTOExploreOperator,
  userLat: number | null,
  userLng: number | null,
): RTOExploreBranchWithDistance[] {
  const branches = getOperatorBranches(op);
  const withD = branches.map((b) => {
    if (userLat == null || userLng == null) {
      return { ...b, distanceKm: Number.NaN };
    }
    const c = getBranchLatLng(b, op);
    const distanceKm = c ? haversineKm(userLat, userLng, c[0], c[1]) : Number.NaN;
    return { ...b, distanceKm };
  });
  return withD.sort((a, b) => {
    const na = Number.isNaN(a.distanceKm);
    const nb = Number.isNaN(b.distanceKm);
    if (na && nb) return 0;
    if (na) return 1;
    if (nb) return -1;
    return a.distanceKm - b.distanceKm;
  });
}

export function sortExploreOperatorsNearestFirst(
  operators: RTOExploreOperator[],
  userLat: number | null,
  userLng: number | null,
): RTOExploreOperator[] {
  const fallback = (op: RTOExploreOperator) =>
    parseFloat(String(op.distanceKm).replace(",", ".")) || 999;
  return [...operators].sort((a, b) => {
    if (userLat != null && userLng != null) {
      const da = nearestBranchDistanceKm(a, userLat, userLng);
      const db = nearestBranchDistanceKm(b, userLat, userLng);
      if (da != null && db != null) return da - db;
      if (da != null) return -1;
      if (db != null) return 1;
    }
    return fallback(a) - fallback(b);
  });
}

export function getOperatorBranches(op: RTOExploreOperator): RTOExploreBranch[] {
  if (op.branches?.length) return op.branches;
  const opening =
    op.openingHours ??
    ({
      openDaysLabel: "Setiap hari",
      timeRange: op.hours.includes("WIB") ? op.hours : `${op.hours} WIB`,
    } satisfies RTOExploreOpeningHours);
  return [
    {
      id: "main",
      label: "Cabang utama",
      address: op.address,
      phone: op.phone,
      lat: op.lat,
      lng: op.lng,
      scheduleLines: [
        `${opening.openDaysLabel}: ${opening.timeRange}`,
        ...(opening.closedDays?.length
          ? [`Libur: ${opening.closedDays.join(", ")}`]
          : []),
      ],
    },
  ];
}

export function getOperatorOpeningDisplay(op: RTOExploreOperator): RTOExploreOpeningHours {
  return (
    op.openingHours ?? {
      openDaysLabel: "Setiap hari",
      timeRange: op.hours.includes("WIB") ? op.hours : `${op.hours} WIB`,
    }
  );
}

export function getOperatorMockReviews(op: RTOExploreOperator): RTOExploreReview[] {
  if (op.mockReviews?.length) return op.mockReviews;
  const n = Math.min(op.reviewCount, 5);
  const samples = [
    "Prosesnya cepat, staff ramah. Motor sesuai foto.",
    "Program RTO jelas, cicilan harian masuk akal.",
    "Lokasi mudah dicari, parkir agak sempit tapi OK.",
    "Respon WhatsApp cepat. Recommended.",
    "Sudah 2 bulan pakai motor, servis rutin enak.",
  ];
  return Array.from({ length: Math.max(3, n) }, (_, i) => ({
    id: `r-${op.id}-${i}`,
    name: `Pengguna ${i + 1}`,
    rating: 4 + (i % 2),
    date: `${10 + i} Feb 2025`,
    text: samples[i % samples.length],
  }));
}

/** Fallback visuals when operator has no custom assets */
export function defaultProgramBanner(_operatorId: string): string {
  return "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=960&h=360&fit=crop&q=75&auto=format";
}

export function defaultDealershipPhotos(_operatorId: string): string[] {
  return [
    `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&q=75&auto=format`,
    `https://images.unsplash.com/photo-1566024287286-457247b70310?w=400&h=300&fit=crop&q=75&auto=format`,
    `https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=75&auto=format`,
  ];
}

export function defaultBikePhoto(_bikeId: string): string {
  return "https://images.unsplash.com/photo-1605558347022-1ff8a6ff16f7?w=320&h=320&fit=crop&q=75&auto=format";
}

/** Fallback multi-angle gallery for bike detail */
export function getBikeGallery(bike: RTOExploreBike): { src: string; label: string }[] {
  if (bike.gallery?.length) return bike.gallery;
  const side = bike.photoUrl ?? defaultBikePhoto(bike.id);
  return [
    { src: side, label: "Samping" },
    {
      src: "https://images.unsplash.com/photo-1622185135507-1d1a12cf8238?w=800&h=500&fit=crop&q=75&auto=format",
      label: "Depan",
    },
    {
      src: "https://images.unsplash.com/photo-1568772585407-936830833a14?w=800&h=500&fit=crop&q=75&auto=format",
      label: "Belakang",
    },
  ];
}

export const RTO_EXPLORE_OPERATORS: RTOExploreOperator[] = [
  {
    id: "sponge",
    initial: "S",
    name: "Casan Untd",
    area: "Jakarta Selatan",
    rating: 4.2,
    reviewCount: 15,
    distanceKm: "2.5",
    address: "Jl. Senopati No. 8, Jakarta Selatan",
    phone: "0812-9000-0100",
    hours: "08:00–20:00",
    programName: "Sponge",
    minSalary: 2_000_000,
    programBanner:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=960&h=360&fit=crop&q=80&auto=format",
    dealershipPhotos: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=480&h=360&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1566024287286-457247b70310?w=480&h=360&fit=crop&q=80&auto=format",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=480&h=360&fit=crop&q=80&auto=format",
    ],
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    openingHours: {
      openDaysLabel: "Selasa–Minggu",
      timeRange: "08:00–20:00 WIB",
      closedDays: ["Senin"],
    },
    branches: [
      {
        id: "senopati",
        label: "Cabang Senopati",
        address: "Jl. Senopati No. 8, Jakarta Selatan",
        phone: "0812-9000-0100",
        scheduleLines: [
          "Selasa–Minggu 08:00–20:00 WIB",
          "Senin libur",
        ],
        lat: -6.2277,
        lng: 106.8087,
      },
      {
        id: "kemang",
        label: "Cabang Kemang",
        address: "Jl. Kemang Raya No. 42, Jakarta Selatan",
        phone: "0812-9000-0101",
        scheduleLines: [
          "Setiap hari 09:00–21:00 WIB",
        ],
        lat: -6.2608,
        lng: 106.8144,
      },
      {
        id: "bsd",
        label: "Cabang BSD",
        address: "Jl. BSD Raya Utama, Tangerang Selatan",
        scheduleLines: [
          "Senin–Sabtu 10:00–19:00 WIB",
          "Minggu libur",
        ],
        lat: -6.2984,
        lng: 106.6759,
      },
    ],
    mockReviews: [
      {
        id: "r1",
        name: "Budi S.",
        rating: 5,
        date: "2 Mar 2025",
        text: "Program Sponge jelas, motor Casan E1 mulus. Staff jelasin cicilan sabar.",
      },
      {
        id: "r2",
        name: "Dewi L.",
        rating: 4,
        date: "28 Feb 2025",
        text: "Cabang Senopati rapi. Hanya parkir agak sempit jam sibuk.",
      },
      {
        id: "r3",
        name: "Raka M.",
        rating: 5,
        date: "15 Feb 2025",
        text: "WhatsApp cepat balas. Proses RTO 2 hari selesai.",
      },
      {
        id: "r4",
        name: "Sinta K.",
        rating: 4,
        date: "8 Feb 2025",
        text: "Sudah 3 bulan pakai, servis rutin enak dijadwalkan.",
      },
    ],
    bikes: [
      {
        id: "casan-e1",
        name: "Casan E1",
        year: "2024",
        watt: "1.500 W",
        batteryWh: "960 Wh",
        rangeKm: "35 km",
        volt: "48V",
        amp: "20A",
        speed: "45km/h",
        weight: "78kg",
        tire: '12"',
        chargeTime: "4-5j",
        pricePerDay: 15_000,
        minPayment: 2_000_000,
        totalPaymentDays: 300,
        specLine: "1500W • 35km • 48V/20A",
        photoUrl:
          "https://images.unsplash.com/photo-1605558347022-1ff8a6ff16f7?w=400&h=400&fit=crop&q=80&auto=format",
        gallery: [
          {
            src: "https://images.unsplash.com/photo-1605558347022-1ff8a6ff16f7?w=900&h=560&fit=crop&q=80&auto=format",
            label: "Samping",
          },
          {
            src: "https://images.unsplash.com/photo-1622185135507-1d1a12cf8238?w=900&h=560&fit=crop&q=80&auto=format",
            label: "Depan",
          },
          {
            src: "https://images.unsplash.com/photo-1568772585407-936830833a14?w=900&h=560&fit=crop&q=80&auto=format",
            label: "Belakang",
          },
        ],
      },
    ],
  },
  {
    id: "tangkas",
    initial: "T",
    name: "Tangkas Motors",
    area: "Ciputat, Tangsel",
    rating: 4.4,
    reviewCount: 38,
    distanceKm: "1.8",
    address: "Jl. Ciputat Raya No. 45, Ciputat",
    phone: "0812-5555-0101",
    hours: "08:00-19:00",
    programName: "Tangkas RTO",
    minSalary: 2_200_000,
    openingHours: {
      openDaysLabel: "Senin–Sabtu",
      timeRange: "08:00–19:00 WIB",
      closedDays: ["Minggu"],
    },
    branches: [
      {
        id: "ciputat",
        label: "Ciputat (utama)",
        address: "Jl. Ciputat Raya No. 45, Ciputat",
        phone: "0812-5555-0101",
        scheduleLines: ["Senin–Sabtu 08:00–19:00 WIB", "Minggu libur"],
        lat: -6.3075,
        lng: 106.755,
      },
      {
        id: "pamulang",
        label: "Cabang Pamulang",
        address: "Jl. Surya Kencana, Pamulang",
        scheduleLines: ["Senin–Jumat 09:00–18:00 WIB", "Sabtu 09:00–14:00", "Minggu libur"],
        lat: -6.3438,
        lng: 106.7342,
      },
    ],
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "tangkas-e100",
        name: "Tangkas E100",
        year: "2024",
        watt: "2.500 W",
        batteryWh: "1.200 Wh",
        rangeKm: "45 km",
        volt: "60V",
        amp: "20A",
        speed: "55km/h",
        weight: "88kg",
        tire: '12"',
        chargeTime: "4-5j",
        pricePerDay: 18_000,
        minPayment: 1_800_000,
        totalPaymentDays: 276,
        specLine: "2500W • 45km • 60V/20A",
      },
    ],
  },
  {
    id: "maka",
    initial: "M",
    name: "Maka Motors",
    area: "BSD, Tangsel",
    rating: 4.8,
    reviewCount: 142,
    distanceKm: "2.1",
    address: "Jl. Pahlawan Seribu, BSD City",
    phone: "0812-1234-5678",
    hours: "08:00-20:00",
    programName: "Go Green",
    minSalary: 3_000_000,
    lat: -6.3012,
    lng: 106.6532,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "maka-r1",
        name: "Maka R1",
        year: "2024",
        watt: "3.500 W",
        batteryWh: "1.440 Wh",
        rangeKm: "60 km",
        volt: "72V",
        amp: "20A",
        speed: "65km/h",
        weight: "95kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 25_000,
        minPayment: 3_000_000,
        totalPaymentDays: 312,
        specLine: "3500W • 60km • 72V/20A",
      },
      {
        id: "maka-s2",
        name: "Maka S2 Pro",
        year: "2024",
        tag: "DUAL",
        watt: "3.500 W",
        batteryWh: "2.160 Wh",
        rangeKm: "85 km",
        volt: "72V",
        amp: "30A",
        speed: "70km/h",
        weight: "102kg",
        tire: '14"',
        chargeTime: "2-3j",
        pricePerDay: 35_000,
        minPayment: 4_500_000,
        totalPaymentDays: 300,
        specLine: "3500W • 85km • 72V/30A",
      },
    ],
  },
  {
    id: "united",
    initial: "U",
    name: "United Motors",
    area: "Serpong",
    rating: 4.6,
    reviewCount: 98,
    distanceKm: "3.4",
    address: "Jl. Raya Serpong KM 7, Serpong",
    phone: "0812-7777-8899",
    hours: "09:00-21:00",
    programName: "United RTO Plus",
    minSalary: 2_500_000,
    lat: -6.285,
    lng: 106.668,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "united-t1800",
        name: "United T1800",
        year: "2024",
        watt: "2.700 W",
        batteryWh: "1.296 Wh",
        rangeKm: "45 km",
        volt: "60V",
        amp: "20A",
        speed: "60km/h",
        weight: "92kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 20_000,
        minPayment: 2_500_000,
        totalPaymentDays: 252,
        specLine: "2.7kW • 45km • 60V/20A",
      },
      {
        id: "united-t2200",
        name: "United T2200",
        year: "2024",
        watt: "3.200 W",
        batteryWh: "1.536 Wh",
        rangeKm: "55 km",
        volt: "72V",
        amp: "24A",
        speed: "62km/h",
        weight: "94kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 28_000,
        minPayment: 3_200_000,
        totalPaymentDays: 288,
        specLine: "3.2kW • 55km • 72V/24A",
      },
    ],
  },
  /** —— Home card programs (1:1 with “Lihat RTO program lainnya”) —— */
  {
    id: "rto-januari",
    initial: "R",
    name: "Rental Pulau Seribu",
    area: "Kepulauan Seribu",
    rating: 4.5,
    reviewCount: 32,
    distanceKm: "5.0",
    address: "Dermaga Marina Ancol, Jakarta Utara (cabang Kep. Seribu)",
    phone: "0812-3100-2200",
    hours: "07:00–18:00",
    programName: "RTO Januari",
    minSalary: 2_500_000,
    lat: -6.125,
    lng: 106.848,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "volta-s1",
        name: "Volta S1",
        year: "2024",
        watt: "2.000 W",
        batteryWh: "1.080 Wh",
        rangeKm: "40 km",
        volt: "60V",
        amp: "18A",
        speed: "50km/h",
        weight: "82kg",
        tire: '12"',
        chargeTime: "4-5j",
        pricePerDay: 22_000,
        minPayment: 2_500_000,
        totalPaymentDays: 300,
        specLine: "2000W • 40km • 60V/18A",
      },
    ],
  },
  {
    id: "testing-endi",
    initial: "T",
    name: "Zeho Main Dealer, Casan",
    area: "Tangerang",
    rating: 4.0,
    reviewCount: 8,
    distanceKm: "3.2",
    address: "Jl. BSD Raya Utama No. 12, Tangerang",
    phone: "0812-4400-3300",
    hours: "09:00–19:00",
    programName: "Testing Endi",
    minSalary: 2_200_000,
    lat: -6.298,
    lng: 106.676,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "zeho-ze100",
        name: "Zeho ZE100",
        year: "2024",
        watt: "1.800 W",
        batteryWh: "1.008 Wh",
        rangeKm: "38 km",
        volt: "48V",
        amp: "20A",
        speed: "48km/h",
        weight: "76kg",
        tire: '12"',
        chargeTime: "4-5j",
        pricePerDay: 18_000,
        minPayment: 2_200_000,
        totalPaymentDays: 264,
        specLine: "1800W • 38km • 48V/20A",
      },
    ],
  },
  {
    id: "slasher-casan-energi",
    initial: "S",
    name: "PT Casan Energi",
    area: "BSD, Tangsel",
    rating: 4.7,
    reviewCount: 64,
    distanceKm: "1.9",
    address: "Jl. Letjen Sutoyo, BSD Sektor 14, Tangerang Selatan",
    phone: "0812-5500-6600",
    hours: "08:00–20:00",
    programName: "Slinging Slasher",
    minSalary: 3_000_000,
    lat: -6.295,
    lng: 106.68,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "smoot-x1-casan",
        name: "Smoot X1",
        year: "2024",
        watt: "3.200 W",
        batteryWh: "1.512 Wh",
        rangeKm: "55 km",
        volt: "72V",
        amp: "22A",
        speed: "62km/h",
        weight: "93kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 30_000,
        minPayment: 3_000_000,
        totalPaymentDays: 294,
        specLine: "3.2kW • 55km • 72V/22A",
      },
    ],
  },
  {
    id: "the-hash",
    initial: "T",
    name: "Casan Untd",
    area: "Depok",
    rating: 4.3,
    reviewCount: 22,
    distanceKm: "4.1",
    address: "Jl. Margonda Raya No. 88, Depok",
    phone: "0812-7700-8800",
    hours: "08:30–19:30",
    programName: "The Hash",
    minSalary: 2_800_000,
    lat: -6.372,
    lng: 106.831,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "volta-r2",
        name: "Volta R2",
        year: "2024",
        watt: "2.800 W",
        batteryWh: "1.224 Wh",
        rangeKm: "50 km",
        volt: "60V",
        amp: "22A",
        speed: "58km/h",
        weight: "90kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 26_000,
        minPayment: 2_800_000,
        totalPaymentDays: 282,
        specLine: "2.8kW • 50km • 60V/22A",
      },
    ],
  },
  {
    id: "tebengan123",
    initial: "S",
    name: "Tebengan123",
    area: "Bekasi",
    rating: 3.9,
    reviewCount: 11,
    distanceKm: "6.3",
    address: "Jl. Ahmad Yani, Bekasi Selatan",
    phone: "0812-9900-1100",
    hours: "09:00–18:00",
    programName: "Slinging Slasher",
    minSalary: 2_000_000,
    lat: -6.238,
    lng: 107.002,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "tebengan-t1",
        name: "Tebengan T1",
        year: "2024",
        watt: "1.200 W",
        batteryWh: "864 Wh",
        rangeKm: "32 km",
        volt: "48V",
        amp: "18A",
        speed: "42km/h",
        weight: "72kg",
        tire: '12"',
        chargeTime: "5-6j",
        pricePerDay: 14_000,
        minPayment: 2_000_000,
        totalPaymentDays: 240,
        specLine: "1200W • 32km • 48V/18A",
      },
    ],
  },
  {
    id: "united-rto-1111",
    initial: "U",
    name: "United E-Bike Jakarta Barat",
    area: "Jakarta Barat",
    rating: 4.6,
    reviewCount: 98,
    distanceKm: "3.4",
    address: "Jl. Puri Indah Raya Blok U2, Jakarta Barat",
    phone: "0813-5678-1234",
    hours: "08:30–19:30",
    programName: "United RTO 11.11",
    minSalary: 2_500_000,
    lat: -6.184,
    lng: 106.738,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "united-t1800-jb",
        name: "United T1800",
        year: "2024",
        watt: "2.700 W",
        batteryWh: "1.080 Wh",
        rangeKm: "45 km",
        volt: "60V",
        amp: "18A",
        speed: "55km/h",
        weight: "85kg",
        tire: '12"',
        chargeTime: "2-3j",
        pricePerDay: 20_000,
        minPayment: 2_500_000,
        totalPaymentDays: 270,
        specLine: "2700W • 45km • 60V/18A",
      },
      {
        id: "united-t2200-jb",
        name: "United T2200",
        year: "2025",
        watt: "3.500 W",
        batteryWh: "1.536 Wh",
        rangeKm: "65 km",
        volt: "72V",
        amp: "25A",
        speed: "65km/h",
        weight: "94kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 28_000,
        minPayment: 3_500_000,
        totalPaymentDays: 306,
        specLine: "3500W • 65km • 72V/25A",
      },
    ],
  },
  {
    id: "tes-051-smoot",
    initial: "T",
    name: "Smoot Alsut",
    area: "Alsut, Tangsel",
    rating: 4.1,
    reviewCount: 19,
    distanceKm: "2.8",
    address: "Jl. Alam Sutera Boulevard No. 5, Tangerang Selatan",
    phone: "0812-2100-5100",
    hours: "08:00–20:00",
    programName: "Tes 051",
    minSalary: 2_300_000,
    lat: -6.222,
    lng: 106.652,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "smoot-s2-tes051",
        name: "Smoot S2",
        year: "2024",
        watt: "2.400 W",
        batteryWh: "1.152 Wh",
        rangeKm: "48 km",
        volt: "60V",
        amp: "20A",
        speed: "52km/h",
        weight: "86kg",
        tire: '12"',
        chargeTime: "4j",
        pricePerDay: 21_000,
        minPayment: 2_300_000,
        totalPaymentDays: 276,
        specLine: "2400W • 48km • 60V/20A",
      },
    ],
  },
  {
    id: "november-desember",
    initial: "N",
    name: "Smoot Alsut, Smoot ID",
    area: "Alsut, Tangsel",
    rating: 4.4,
    reviewCount: 45,
    distanceKm: "2.8",
    address: "Jl. Jalur Sutera Barat Kav. 20, Alam Sutera",
    phone: "0812-1100-9900",
    hours: "08:00–21:00",
    programName: "November Desember",
    minSalary: 2_500_000,
    lat: -6.22,
    lng: 106.655,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "smoot-s2-nd",
        name: "Smoot S2",
        year: "2024",
        watt: "2.400 W",
        batteryWh: "1.152 Wh",
        rangeKm: "48 km",
        volt: "60V",
        amp: "20A",
        speed: "52km/h",
        weight: "86kg",
        tire: '12"',
        chargeTime: "4j",
        pricePerDay: 21_000,
        minPayment: 2_300_000,
        totalPaymentDays: 270,
        specLine: "2400W • 48km • 60V/20A",
      },
      {
        id: "smoot-x1-nd",
        name: "Smoot X1",
        year: "2024",
        watt: "3.000 W",
        batteryWh: "1.440 Wh",
        rangeKm: "52 km",
        volt: "72V",
        amp: "20A",
        speed: "60km/h",
        weight: "91kg",
        tire: '14"',
        chargeTime: "3-4j",
        pricePerDay: 27_000,
        minPayment: 2_800_000,
        totalPaymentDays: 288,
        specLine: "3kW • 52km • 72V/20A",
      },
      {
        id: "smoot-pro-nd",
        name: "Smoot Pro",
        year: "2024",
        tag: "PRO",
        watt: "3.500 W",
        batteryWh: "1.728 Wh",
        rangeKm: "60 km",
        volt: "72V",
        amp: "26A",
        speed: "65km/h",
        weight: "96kg",
        tire: '14"',
        chargeTime: "3j",
        pricePerDay: 32_000,
        minPayment: 3_200_000,
        totalPaymentDays: 318,
        specLine: "3.5kW • 60km • 72V/26A",
      },
    ],
  },
  {
    id: "tes2-smoot",
    initial: "T",
    name: "Smoot Alsut",
    area: "Alsut, Tangsel",
    rating: 4.0,
    reviewCount: 5,
    distanceKm: "2.9",
    address: "Jl. Alam Sutera Boulevard No. 12A, Tangerang Selatan",
    phone: "0812-2200-1400",
    hours: "09:00–19:00",
    programName: "Tes2",
    minSalary: 2_200_000,
    lat: -6.223,
    lng: 106.648,
    benefits: [
      "Jaket CASAN gratis",
      "Ban 1 pasang (6bln)",
      "Asuransi kecelakaan 12bln",
      "Servis tiap 3 bulan",
      "Home charger 10A",
      "Charging SPKL gratis 30 hari",
    ],
    bikes: [
      {
        id: "smoot-s2-tes2",
        name: "Smoot S2",
        year: "2024",
        watt: "2.400 W",
        batteryWh: "1.152 Wh",
        rangeKm: "48 km",
        volt: "60V",
        amp: "20A",
        speed: "52km/h",
        weight: "86kg",
        tire: '12"',
        chargeTime: "4j",
        pricePerDay: 19_000,
        minPayment: 2_200_000,
        totalPaymentDays: 258,
        specLine: "2400W • 48km • 60V/20A",
      },
    ],
  },
];

export function getOperatorById(id: string): RTOExploreOperator | undefined {
  return RTO_EXPLORE_OPERATORS.find((o) => o.id === id);
}

export function getBikeById(bikeId: string): { operator: RTOExploreOperator; bike: RTOExploreBike } | undefined {
  for (const op of RTO_EXPLORE_OPERATORS) {
    const bike = op.bikes.find((b) => b.id === bikeId);
    if (bike) return { operator: op, bike };
  }
  return undefined;
}
