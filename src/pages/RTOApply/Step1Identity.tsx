import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { updateDraft, goToStep } from "../../features/rto/rtoApplicationSlice";
import type {
  Gender,
  MaritalStatus,
  HousingStatus,
  YearsAtAddress,
} from "../../types/rtoApplication";
import { INDONESIAN_CITIES, RELATION_OPTIONS } from "../../data/rtoIndonesianCities";
import CTABar from "../../components/rto/CTABar";
import { SectionHeading } from "../../components/rto/FormFields";

// ─── Pill selector ──────────────────────────────────────────────
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];

const MARITAL_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Belum Menikah" },
  { value: "married", label: "Menikah" },
  { value: "divorced", label: "Cerai Hidup" },
  { value: "widowed", label: "Cerai Mati" },
];

const HOUSING_OPTIONS: { value: HousingStatus; label: string }[] = [
  { value: "own", label: "Milik Sendiri" },
  { value: "rent", label: "Kontrak" },
  { value: "family", label: "Keluarga" },
  { value: "gov", label: "Dinas" },
  { value: "other", label: "Lainnya" },
];

const TENURE_OPTIONS: { value: YearsAtAddress; label: string }[] = [
  { value: "<1", label: "<1 th" },
  { value: "1-2", label: "1-2 th" },
  { value: "2-5", label: "2-5 th" },
  { value: "5-10", label: "5-10 th" },
  { value: "10+", label: "10+ th" },
];

// ─── Reusable field components ──────────────────────────────────

function PillSelector<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            value === opt.value
              ? "bg-[#4DB6AC] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 transition-colors"
    />
  );
}

// ─── Autocomplete input ─────────────────────────────────────────

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered =
    query.length >= 1
      ? suggestions.filter((s) =>
          s.toLowerCase().includes(query.toLowerCase()),
        ).slice(0, 8)
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 1 && setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 transition-colors"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {filtered.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-[#4DB6AC]/5 transition-colors"
                onClick={() => {
                  onChange(item);
                  setQuery(item);
                  setOpen(false);
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Dropdown select ────────────────────────────────────────────

function DropdownSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10 ${
        !value ? "text-gray-400" : "text-gray-900"
      }`}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ─── 3-dropdown date picker (Day / Month / Year) ────────────────

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function daysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

function DateDropdowns({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parsedInit = value ? new Date(value) : null;
  const [dd, setDd] = useState(parsedInit ? parsedInit.getDate() : 0);
  const [mm, setMm] = useState(parsedInit ? parsedInit.getMonth() + 1 : 0);
  const [yy, setYy] = useState(parsedInit ? parsedInit.getFullYear() : 0);

  useEffect(() => {
    if (!value) return;
    const p = new Date(value);
    if (!isNaN(p.getTime())) {
      setDd(p.getDate());
      setMm(p.getMonth() + 1);
      setYy(p.getFullYear());
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 80; y--) years.push(y);

  const maxDay = daysInMonth(mm, yy || currentYear);
  const days: number[] = [];
  for (let d = 1; d <= maxDay; d++) days.push(d);

  const emit = (d: number, m: number, y: number) => {
    if (d && m && y) {
      const clamped = Math.min(d, daysInMonth(m, y));
      const iso = `${y}-${String(m).padStart(2, "0")}-${String(clamped).padStart(2, "0")}`;
      onChange(iso);
    }
  };

  const handleDay = (v: number) => { setDd(v); emit(v, mm, yy); };
  const handleMonth = (v: number) => { setMm(v); emit(dd, v, yy); };
  const handleYear = (v: number) => { setYy(v); emit(dd, mm, v); };

  const selectCls = (filled: boolean) =>
    `w-full rounded-xl border border-gray-200 bg-white px-2.5 py-3 text-sm transition-colors focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:10px] bg-[right_8px_center] bg-no-repeat pr-6 ${filled ? "text-gray-900" : "text-gray-400"}`;

  const age =
    dd && mm && yy
      ? Math.floor(
          (Date.now() - new Date(yy, mm - 1, dd).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        )
      : null;

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        <select
          value={dd || ""}
          onChange={(e) => handleDay(Number(e.target.value))}
          className={selectCls(dd > 0)}
        >
          <option value="">Tgl</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={mm || ""}
          onChange={(e) => handleMonth(Number(e.target.value))}
          className={selectCls(mm > 0)}
        >
          <option value="">Bulan</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={i + 1} value={i + 1}>{name}</option>
          ))}
        </select>

        <select
          value={yy || ""}
          onChange={(e) => handleYear(Number(e.target.value))}
          className={selectCls(yy > 0)}
        >
          <option value="">Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {age !== null && age > 0 && (
        <p className="mt-1.5 text-xs font-semibold text-gray-500">
          Usia: {age} tahun
          {age >= 21 && age <= 55 ? (
            <span className="ml-1.5 text-green">&#10003; usia optimal</span>
          ) : (
            <span className="ml-1.5 text-red">&#10007; di luar 21-55 tahun</span>
          )}
        </p>
      )}
    </div>
  );
}

// ─── OSM Nominatim address autocomplete ─────────────────────────

interface NominatimResult {
  display_name: string;
  address: {
    suburb?: string;
    village?: string;
    city_district?: string;
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  lat: string;
  lon: string;
}

function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (result: {
    address: string;
    subdistrict: string;
    city: string;
    province: string;
    lat: number;
    lng: number;
  }) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback((q: string) => {
    if (q.length < 4) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=id&limit=5&q=${encodeURIComponent(q)}`,
      { headers: { "Accept-Language": "id" } },
    )
      .then((r) => r.json())
      .then((data: NominatimResult[]) => {
        setResults(data);
        setOpen(data.length > 0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (v: string) => {
    setQuery(v);
    onChange(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(v), 500);
  };

  const handlePick = (r: NominatimResult) => {
    const addr = r.address;
    const subdistrict =
      addr.suburb || addr.village || addr.city_district || "";
    const city = addr.city || addr.town || addr.county || "";
    const province = addr.state || "";

    setQuery(r.display_name.split(",").slice(0, 3).join(",").trim());
    onChange(r.display_name.split(",").slice(0, 3).join(",").trim());
    setOpen(false);
    onSelect({
      address: r.display_name.split(",").slice(0, 3).join(",").trim(),
      subdistrict,
      city,
      province,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
    });
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Ketik alamat (min. 4 huruf untuk pencarian)..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 placeholder:text-gray-300 focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#4DB6AC]" />
          </div>
        )}
        {!loading && query.length >= 4 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            🔍
          </span>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map((r, i) => (
            <li key={i}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-[#4DB6AC]/5 transition-colors border-b border-gray-50 last:border-0"
                onClick={() => handlePick(r)}
              >
                <span className="font-medium text-gray-900">
                  {r.display_name.split(",").slice(0, 2).join(",")}
                </span>
                <span className="text-gray-400">
                  {r.display_name.split(",").slice(2).join(",")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────

export default function Step1Identity() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const draft = useSelector((s: RootState) => s.rtoApplication.draft);

  const update = (patch: Record<string, unknown>) => {
    dispatch(updateDraft(patch));
  };

  const nikLen = (draft.nik ?? "").length;
  const nikValid = nikLen === 16;

  return (
    <div className="space-y-6 px-4 py-6 pb-28 sm:px-5">
      {/* ── Identitas ── */}
      <section>
        <SectionHeading>Identitas</SectionHeading>

        <div className="space-y-4">
          <div>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <TextInput
              value={draft.fullName ?? ""}
              onChange={(v) => update({ fullName: v })}
              placeholder="Sesuai KTP"
            />
          </div>

          <div>
            <FieldLabel>NIK (16 digit)</FieldLabel>
            <div className="relative">
              <input
                type="text"
                value={draft.nik ?? ""}
                onChange={(e) =>
                  update({ nik: e.target.value.replace(/\D/g, "").slice(0, 16) })
                }
                placeholder="3201234567890001"
                inputMode="numeric"
                maxLength={16}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 pr-24 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none transition-colors ${
                  nikLen === 0
                    ? "border-gray-200 focus:border-primary100"
                    : nikValid
                      ? "border-green focus:border-green"
                      : "border-red focus:border-red"
                }`}
              />
              {nikLen > 0 && (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-bold ${
                    nikValid ? "text-green" : "text-red"
                  }`}
                >
                  <span className="text-xs">{nikLen}/16</span>
                  {nikValid ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lightGreen">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#19AD3C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lightRed">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M7 7l10 10M17 7L7 17" stroke="#DD2E44" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div>
            <FieldLabel>Tempat Lahir</FieldLabel>
            <AutocompleteInput
              value={draft.birthPlace ?? ""}
              onChange={(v) => update({ birthPlace: v })}
              suggestions={INDONESIAN_CITIES}
              placeholder="Cari kota..."
            />
          </div>

          <div>
            <FieldLabel>Tanggal Lahir</FieldLabel>
            <DateDropdowns
              value={draft.birthDate ?? ""}
              onChange={(v) => update({ birthDate: v })}
            />
          </div>

          <div>
            <FieldLabel>Jenis Kelamin</FieldLabel>
            <PillSelector
              value={(draft.gender as Gender) ?? "L"}
              options={GENDER_OPTIONS}
              onChange={(v) => update({ gender: v })}
            />
          </div>

          <div>
            <FieldLabel>Status Pernikahan</FieldLabel>
            <PillSelector
              value={(draft.maritalStatus as MaritalStatus) ?? "single"}
              options={MARITAL_OPTIONS}
              onChange={(v) => update({ maritalStatus: v })}
            />
          </div>

          <div>
            <FieldLabel>No HP WhatsApp</FieldLabel>
            <TextInput
              value={draft.phone ?? ""}
              onChange={(v) => update({ phone: v })}
              placeholder="081234567890"
              type="tel"
              inputMode="tel"
            />
          </div>
        </div>
      </section>

      {/* ── Kontak Darurat ── */}
      <section>
        <SectionHeading>Kontak darurat</SectionHeading>
        <div className="space-y-3">
          <div>
            <FieldLabel>Nama</FieldLabel>
            <TextInput
              value={draft.emergencyContact?.name ?? ""}
              onChange={(v) =>
                update({
                  emergencyContact: {
                    ...(draft.emergencyContact ?? {
                      name: "",
                      phone: "",
                      relation: "",
                    }),
                    name: v,
                  },
                })
              }
              placeholder="Nama kontak darurat"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>No HP</FieldLabel>
              <TextInput
                value={draft.emergencyContact?.phone ?? ""}
                onChange={(v) =>
                  update({
                    emergencyContact: {
                      ...(draft.emergencyContact ?? {
                        name: "",
                        phone: "",
                        relation: "",
                      }),
                      phone: v,
                    },
                  })
                }
                placeholder="081234567890"
                type="tel"
                inputMode="tel"
              />
            </div>
            <div>
              <FieldLabel>Hubungan</FieldLabel>
              <DropdownSelect
                value={draft.emergencyContact?.relation ?? ""}
                options={RELATION_OPTIONS}
                onChange={(v) =>
                  update({
                    emergencyContact: {
                      ...(draft.emergencyContact ?? {
                        name: "",
                        phone: "",
                        relation: "",
                      }),
                      relation: v,
                    },
                  })
                }
                placeholder="Pilih hubungan"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Alamat ── */}
      <section>
        <SectionHeading>Alamat</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>Cari Alamat</FieldLabel>
            <AddressAutocomplete
              value={draft.address ?? ""}
              onChange={(v) => update({ address: v })}
              onSelect={(result) => {
                update({
                  address: result.address,
                  subdistrict: result.subdistrict,
                  city: result.city,
                  province: result.province,
                  lat: result.lat,
                  lng: result.lng,
                });
              }}
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Ketik minimal 4 karakter untuk mencari alamat dari OpenStreetMap
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <FieldLabel>Kecamatan</FieldLabel>
              <TextInput
                value={draft.subdistrict ?? ""}
                onChange={(v) => update({ subdistrict: v })}
                placeholder="Kemayoran"
              />
            </div>
            <div>
              <FieldLabel>Kota</FieldLabel>
              <TextInput
                value={draft.city ?? ""}
                onChange={(v) => update({ city: v })}
                placeholder="Jakarta Pusat"
              />
            </div>
            <div>
              <FieldLabel>Provinsi</FieldLabel>
              <TextInput
                value={draft.province ?? ""}
                onChange={(v) => update({ province: v })}
                placeholder="DKI Jakarta"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Status Hunian</FieldLabel>
            <PillSelector
              value={(draft.housingStatus as HousingStatus) ?? "rent"}
              options={HOUSING_OPTIONS}
              onChange={(v) => update({ housingStatus: v })}
            />
          </div>

          <div>
            <FieldLabel>Lama Tinggal</FieldLabel>
            <PillSelector
              value={(draft.yearsAtAddress as YearsAtAddress) ?? "<1"}
              options={TENURE_OPTIONS}
              onChange={(v) => update({ yearsAtAddress: v })}
            />
          </div>
        </div>
      </section>

      <CTABar
        primaryLabel="Lanjut →"
        onPrimary={() => dispatch(goToStep(2))}
        onBack={() => navigate(-1)}
        backLabel="Batal"
      />
    </div>
  );
}
