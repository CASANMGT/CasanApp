import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { updateDraft, goToStep } from "../../features/rto/rtoApplicationSlice";
import type { SavingsBalance, Assets } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";
import {
  FieldLabel,
  TextInput,
  RpInput,
  PillSelector,
  DropdownSelect,
  SectionHeading,
  InfoBox,
} from "../../components/rto/FormFields";

const PROFESSION_OPTIONS = [
  "Ojol (Grab/Gojek/Maxim)",
  "Kurir",
  "Karyawan Swasta",
  "Wiraswasta",
  "PNS / BUMN",
  "Freelancer",
  "Buruh / Harian",
  "Pedagang",
  "Lainnya",
];

const OJOL_PLATFORM_OPTIONS = ["Grab", "Gojek", "Maxim", "ShopeeFood", "Lainnya"];
const KURIR_COMPANY_OPTIONS = ["JNE", "J&T Express", "SiCepat", "Anteraja", "Ninja Express", "TIKI", "ID Express", "Shopee Express", "Lainnya"];

const DURATION_OPTIONS = [
  "<6 bulan",
  "6-12 bulan",
  "1-2 tahun",
  "2-3 tahun",
  "3+ tahun",
];

const SAVINGS_OPTIONS: { value: SavingsBalance; label: string }[] = [
  { value: "0", label: "Tidak ada" },
  { value: "<1m", label: "<1 jt" },
  { value: "1m", label: "1-3 jt" },
  { value: "3m", label: "3-5 jt" },
  { value: "5m", label: "5+ jt" },
];

type ProfCategory = "ojol" | "kurir" | "formal" | "informal" | "business" | "other";

function getProfCategory(p: string): ProfCategory {
  const lc = p.toLowerCase();
  if (lc.includes("ojol")) return "ojol";
  if (lc.includes("kurir")) return "kurir";
  if (lc.includes("karyawan") || lc.includes("pns") || lc.includes("bumn"))
    return "formal";
  if (lc.includes("freelancer") || lc.includes("buruh") || lc.includes("harian"))
    return "informal";
  if (lc.includes("wiraswasta") || lc.includes("pedagang"))
    return "business";
  return "other";
}

function getDsrVerdict(dsr: number) {
  if (dsr <= 30)
    return { label: "Bisa disetujui", detail: "DSR sehat — peluang tinggi", color: "text-green", bg: "bg-green", border: "border-strokeGreen", bgCard: "bg-lightGreen" };
  if (dsr <= 50)
    return { label: "Mungkin disetujui", detail: "DSR wajar — perlu review manual", color: "text-gold", bg: "bg-orange", border: "border-strokeOrange", bgCard: "bg-lightOrange" };
  if (dsr <= 70)
    return { label: "Perlu penjamin", detail: "DSR tinggi — butuh penjamin / aset tambahan", color: "text-orange", bg: "bg-orange", border: "border-strokeOrange", bgCard: "bg-lightOrange" };
  return { label: "Sulit disetujui", detail: "DSR sangat tinggi — kurangi cicilan / tambah penghasilan", color: "text-red", bg: "bg-red", border: "border-strokeRed", bgCard: "bg-lightRed" };
}

function AssetToggle({
  icon,
  label,
  active,
  onToggle,
}: {
  icon: string;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-colors ${
        active ? "border-[#4DB6AC] bg-[#4DB6AC]/5" : "border-gray-200 bg-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-left text-xs font-semibold text-gray-700">
        {label}
      </span>
      <div
        className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          active ? "border-[#4DB6AC] bg-[#4DB6AC]" : "border-gray-300 bg-white"
        }`}
      >
        {active && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

export default function Step2Employment() {
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((s: RootState) => s.rtoApplication.draft);
  const { minSalary } = useSelector((s: RootState) => s.rtoApplication);

  const update = (patch: Record<string, unknown>) => {
    dispatch(updateDraft(patch));
  };

  const updateAsset = (key: keyof Assets, val: unknown) => {
    update({ assets: { ...draft.assets, [key]: val } });
  };

  const totalIncome = (draft.primaryIncome ?? 0) + (draft.secondaryIncome ?? 0);
  const totalOutgoing = (draft.monthlyExpenses ?? 0) + (draft.monthlyInstallmentTotal ?? 0);
  const dsr = totalIncome > 0 ? Math.round((totalOutgoing / totalIncome) * 100) : 0;
  const dsrVerdict = getDsrVerdict(dsr);
  const belowMinSalary = minSalary > 0 && (draft.primaryIncome ?? 0) < minSalary;

  const cat = getProfCategory(draft.profession);

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      {/* ── Pekerjaan ── */}
      <section>
        <SectionHeading>Pekerjaan</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>Profesi Utama</FieldLabel>
            <DropdownSelect
              value={draft.profession}
              options={PROFESSION_OPTIONS}
              onChange={(v) => update({ profession: v })}
              placeholder="Pilih profesi"
            />
          </div>

          {/* ── Ojol-specific ── */}
          {cat === "ojol" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Platform</FieldLabel>
                  <DropdownSelect
                    value={draft.ojolPlatform ?? ""}
                    options={OJOL_PLATFORM_OPTIONS}
                    onChange={(v) => update({ ojolPlatform: v })}
                    placeholder="Pilih"
                  />
                </div>
                <div>
                  <FieldLabel>Lama Bekerja</FieldLabel>
                  <DropdownSelect
                    value={draft.ojolDuration ?? ""}
                    options={DURATION_OPTIONS}
                    onChange={(v) => update({ ojolDuration: v })}
                    placeholder="Pilih"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Rating Ojol</FieldLabel>
                <TextInput
                  value={draft.ojolRating ? String(draft.ojolRating) : ""}
                  onChange={(v) => {
                    const n = parseFloat(v);
                    update({ ojolRating: isNaN(n) ? 0 : Math.min(5, n) });
                  }}
                  placeholder="4.85"
                  inputMode="numeric"
                />
              </div>
            </>
          )}

          {/* ── Kurir-specific ── */}
          {cat === "kurir" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Perusahaan Kurir</FieldLabel>
                <DropdownSelect
                  value={draft.employerName ?? ""}
                  options={KURIR_COMPANY_OPTIONS}
                  onChange={(v) => update({ employerName: v })}
                  placeholder="Pilih"
                />
              </div>
              <div>
                <FieldLabel>Lama Bekerja</FieldLabel>
                <DropdownSelect
                  value={draft.ojolDuration ?? ""}
                  options={DURATION_OPTIONS}
                  onChange={(v) => update({ ojolDuration: v })}
                  placeholder="Pilih"
                />
              </div>
            </div>
          )}

          {/* ── Formal employee (Karyawan / PNS) ── */}
          {cat === "formal" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Nama Perusahaan</FieldLabel>
                <TextInput
                  value={draft.employerName ?? ""}
                  onChange={(v) => update({ employerName: v })}
                  placeholder="PT Contoh Sejahtera"
                />
              </div>
              <div>
                <FieldLabel>Lama Bekerja</FieldLabel>
                <DropdownSelect
                  value={draft.ojolDuration ?? ""}
                  options={DURATION_OPTIONS}
                  onChange={(v) => update({ ojolDuration: v })}
                  placeholder="Pilih"
                />
              </div>
            </div>
          )}

          {/* ── Informal (Freelancer / Buruh / Harian) ── */}
          {cat === "informal" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Jenis Pekerjaan</FieldLabel>
                <TextInput
                  value={draft.employerName ?? ""}
                  onChange={(v) => update({ employerName: v })}
                  placeholder="Tukang las, cleaning service..."
                />
              </div>
              <div>
                <FieldLabel>Lama Bekerja</FieldLabel>
                <DropdownSelect
                  value={draft.ojolDuration ?? ""}
                  options={DURATION_OPTIONS}
                  onChange={(v) => update({ ojolDuration: v })}
                  placeholder="Pilih"
                />
              </div>
            </div>
          )}

          {/* ── Business (Wiraswasta / Pedagang) ── */}
          {cat === "business" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Nama Usaha</FieldLabel>
                <TextInput
                  value={draft.employerName ?? ""}
                  onChange={(v) => update({ employerName: v })}
                  placeholder="Warung Makan Ibu..."
                />
              </div>
              <div>
                <FieldLabel>Lama Usaha</FieldLabel>
                <DropdownSelect
                  value={draft.ojolDuration ?? ""}
                  options={DURATION_OPTIONS}
                  onChange={(v) => update({ ojolDuration: v })}
                  placeholder="Pilih"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Penghasilan ── */}
      <section>
        <SectionHeading>Penghasilan & Pengeluaran</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel>Penghasilan Utama / bulan</FieldLabel>
            <RpInput
              value={draft.primaryIncome}
              onChange={(v) => update({ primaryIncome: v })}
              placeholder="3.000.000"
            />
            {minSalary > 0 && (
              <p className="mt-1 text-[10px] text-gray-400">
                Min. gaji untuk program ini:{" "}
                <span className={`font-bold ${(draft.primaryIncome ?? 0) >= minSalary ? "text-green" : "text-red"}`}>
                  Rp {minSalary.toLocaleString("id-ID")}
                </span>
              </p>
            )}
            {belowMinSalary && (
              <div className="mt-2 rounded-lg border border-strokeRed bg-lightRed px-3 py-2">
                <p className="text-[11px] font-semibold text-red">
                  Penghasilan utama belum memenuhi minimal gaji program.
                </p>
              </div>
            )}
          </div>
          <div>
            <FieldLabel>Penghasilan Sampingan / bulan</FieldLabel>
            <RpInput
              value={draft.secondaryIncome}
              onChange={(v) => update({ secondaryIncome: v })}
              placeholder="0"
            />
          </div>
          <div>
            <FieldLabel>Pengeluaran Bulanan</FieldLabel>
            <RpInput
              value={draft.monthlyExpenses}
              onChange={(v) => update({ monthlyExpenses: v })}
              placeholder="1.500.000"
            />
          </div>

          {/* DSR with approval meaning */}
          {totalIncome > 0 && (
            <div className={`rounded-xl border p-3 ${dsrVerdict.border} ${dsrVerdict.bgCard}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">
                  DSR (Pengeluaran vs Penghasilan)
                </span>
                <span className={`text-sm font-bold ${dsrVerdict.color}`}>
                  {dsr}%
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${dsrVerdict.bg}`}
                  style={{ width: `${Math.min(100, dsr)}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white ${dsrVerdict.bg}`}>
                  {dsrVerdict.label}
                </span>
                <span className="text-[10px] text-gray-500">
                  {dsrVerdict.detail}
                </span>
              </div>
            </div>
          )}

          <div>
            <FieldLabel>Saldo Tabungan</FieldLabel>
            <PillSelector
              value={draft.savingsBalance}
              options={SAVINGS_OPTIONS}
              onChange={(v) => update({ savingsBalance: v })}
            />
          </div>
        </div>
      </section>

      {/* ── Aset di bawah nama sendiri ── */}
      <section>
        <SectionHeading>Aset di Bawah Nama Sendiri</SectionHeading>
        <p className="text-[10px] text-gray-400 -mt-2 mb-3">
          Centang aset yang kamu miliki atas nama sendiri. Tidak perlu isi nilai.
        </p>
        <div className="space-y-2">
          <AssetToggle
            icon="🏠"
            label="Tanah / Lahan"
            active={draft.assets.tanah}
            onToggle={() => updateAsset("tanah", !draft.assets.tanah)}
          />
          <AssetToggle
            icon="🏢"
            label="Bangunan / Rumah"
            active={draft.assets.bangunan}
            onToggle={() => updateAsset("bangunan", !draft.assets.bangunan)}
          />
          <AssetToggle
            icon="🏍️"
            label="Kendaraan (Motor / Mobil)"
            active={draft.assets.kendaraan}
            onToggle={() => updateAsset("kendaraan", !draft.assets.kendaraan)}
          />
          <AssetToggle
            icon="🏪"
            label="Usaha / Tempat Usaha"
            active={draft.assets.usaha}
            onToggle={() => updateAsset("usaha", !draft.assets.usaha)}
          />
        </div>
        <div className="mt-2">
          <InfoBox variant="info">
            Semakin banyak aset yang dimiliki, semakin tinggi skor kelayakan.
          </InfoBox>
        </div>
      </section>

      <CTABar
        primaryLabel="Lanjut →"
        onPrimary={() => dispatch(goToStep(3))}
        onBack={() => dispatch(goToStep(1))}
        disabled={belowMinSalary}
      />
    </div>
  );
}
