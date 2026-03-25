import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { updateDraft, goToStep } from "../../features/rto/rtoApplicationSlice";
import type { SlikScore, CreditEntry } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";
import {
  FieldLabel,
  TextInput,
  RpInput,
  PillSelector,
  DropdownSelect,
  Toggle,
  SectionHeading,
  InfoBox,
} from "../../components/rto/FormFields";

const SLIK_OPTIONS: { value: SlikScore; label: string }[] = [
  { value: "col1", label: "Kol 1 (Lancar)" },
  { value: "col2", label: "Kol 2 (DPK)" },
  { value: "col3", label: "Kol 3 (Kurang Lancar)" },
  { value: "col4", label: "Kol 4 (Diragukan)" },
  { value: "col5", label: "Kol 5 (Macet)" },
];

const CREDIT_TYPE_OPTIONS = [
  "KPR",
  "Kredit Motor",
  "Kredit Mobil",
  "Kartu Kredit",
  "Pinjol",
  "KTA",
  "Lainnya",
];

const STATUS_OPTIONS = ["lancar", "macet", "lunas"];

function newEntry(): CreditEntry {
  return {
    id: Date.now().toString(36),
    institution: "",
    type: "",
    monthlyInstallment: 0,
    remainingMonths: 0,
    status: "lancar",
    onTime: true,
  };
}

function CreditCard({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: CreditEntry;
  index: number;
  onChange: (e: CreditEntry) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500">
          Kredit #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-red hover:underline"
        >
          Hapus
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Jenis Kredit</FieldLabel>
          <DropdownSelect
            value={entry.type}
            options={CREDIT_TYPE_OPTIONS}
            onChange={(v) => onChange({ ...entry, type: v })}
            placeholder="Pilih"
          />
        </div>
        <div>
          <FieldLabel>Lembaga</FieldLabel>
          <TextInput
            value={entry.institution}
            onChange={(v) => onChange({ ...entry, institution: v })}
            placeholder="BCA, Akulaku..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Cicilan / bulan</FieldLabel>
          <RpInput
            value={entry.monthlyInstallment}
            onChange={(v) => onChange({ ...entry, monthlyInstallment: v })}
            placeholder="500.000"
          />
        </div>
        <div>
          <FieldLabel>Sisa (bulan)</FieldLabel>
          <TextInput
            value={entry.remainingMonths > 0 ? String(entry.remainingMonths) : ""}
            onChange={(v) => {
              const n = parseInt(v.replace(/\D/g, ""), 10);
              onChange({ ...entry, remainingMonths: isNaN(n) ? 0 : n });
            }}
            placeholder="12"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Status</FieldLabel>
          <DropdownSelect
            value={entry.status}
            options={STATUS_OPTIONS}
            onChange={(v) =>
              onChange({
                ...entry,
                status: v as CreditEntry["status"],
              })
            }
            placeholder="Status"
          />
        </div>
        <div className="flex items-end pb-1">
          <Toggle
            value={entry.onTime}
            onChange={(v) => onChange({ ...entry, onTime: v })}
            label="Selalu tepat waktu"
          />
        </div>
      </div>
    </div>
  );
}

export default function Step4Credit() {
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((s: RootState) => s.rtoApplication.draft);

  const update = (patch: Record<string, unknown>) => {
    dispatch(updateDraft(patch));
  };

  const totalInstallment = draft.creditEntries.reduce(
    (sum, e) => sum + e.monthlyInstallment,
    0,
  );

  const addEntry = () => {
    update({ creditEntries: [...draft.creditEntries, newEntry()] });
  };

  const updateEntry = (index: number, updated: CreditEntry) => {
    const next = [...draft.creditEntries];
    next[index] = updated;
    const total = next.reduce((s, e) => s + e.monthlyInstallment, 0);
    update({ creditEntries: next, monthlyInstallmentTotal: total });
  };

  const removeEntry = (index: number) => {
    const next = draft.creditEntries.filter((_, i) => i !== index);
    const total = next.reduce((s, e) => s + e.monthlyInstallment, 0);
    update({ creditEntries: next, monthlyInstallmentTotal: total });
  };

  return (
    <div className="space-y-6 px-4 py-6 pb-28 sm:px-5">
      {/* ── Toggle ── */}
      <section>
        <SectionHeading>Riwayat Kredit</SectionHeading>
        <Toggle
          value={draft.hasPriorCredit}
          onChange={(v) => update({ hasPriorCredit: v })}
          label="Pernah / sedang memiliki kredit?"
        />
      </section>

      {draft.hasPriorCredit && (
        <>
          {/* ── SLIK ── */}
          <section>
            <SectionHeading>Skor SLIK (BI Checking)</SectionHeading>
            <PillSelector
              value={draft.slikScore ?? "col1"}
              options={SLIK_OPTIONS}
              onChange={(v) => update({ slikScore: v })}
            />
            <InfoBox variant="info">
              Kol 1 = lancar, Kol 5 = macet. Kamu bisa cek gratis di SLIK OJK.
            </InfoBox>
          </section>

          {/* ── Credit entries ── */}
          <section>
            <SectionHeading>Daftar Kredit Aktif</SectionHeading>
            <div className="space-y-3">
              {draft.creditEntries.map((entry, i) => (
                <CreditCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  onChange={(updated) => updateEntry(i, updated)}
                  onRemove={() => removeEntry(i)}
                />
              ))}
              <button
                type="button"
                onClick={addEntry}
                className="w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs font-semibold text-gray-400 hover:border-[#4DB6AC] hover:text-[#4DB6AC] transition-colors"
              >
                + Tambah Kredit
              </button>
            </div>

            {draft.creditEntries.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">
                  Total cicilan / bulan
                </span>
                <span className="text-sm font-bold text-gray-900">
                  Rp {totalInstallment.toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </section>
        </>
      )}

      {!draft.hasPriorCredit && (
        <div className="rounded-xl border border-strokeGreen bg-lightGreen p-4 text-center">
          <p className="text-xs font-semibold text-green">
            Belum pernah kredit = skor lebih baik di bagian ini
          </p>
        </div>
      )}

      <CTABar
        primaryLabel="Lanjut →"
        onPrimary={() => dispatch(goToStep(5))}
        onBack={() => dispatch(goToStep(3))}
      />
    </div>
  );
}
