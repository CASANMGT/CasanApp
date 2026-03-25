import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { updateDraft, goToStep } from "../../features/rto/rtoApplicationSlice";
import type { GuarantorType, Dependent, Guarantor } from "../../types/rtoApplication";
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

const GUARANTOR_OPTIONS: { value: GuarantorType; label: string }[] = [
  { value: "none", label: "Tanpa Penjamin" },
  { value: "parent", label: "Orang Tua" },
  { value: "sibling", label: "Saudara" },
  { value: "spouse", label: "Pasangan" },
  { value: "employer", label: "Atasan" },
  { value: "other", label: "Lainnya" },
];

const DEPENDENT_TYPE_OPTIONS = [
  "Anak",
  "Orang Tua",
  "Saudara",
  "Lainnya",
];

const EMPTY_DEPENDENT: Dependent = { name: "", age: 0, type: "Anak" };

function DependentCard({
  dep,
  index,
  onChange,
  onRemove,
}: {
  dep: Dependent;
  index: number;
  onChange: (updated: Dependent) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500">
          Tanggungan #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-semibold text-red hover:underline"
        >
          Hapus
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <FieldLabel>Hubungan</FieldLabel>
          <DropdownSelect
            value={dep.type}
            options={DEPENDENT_TYPE_OPTIONS}
            onChange={(v) => onChange({ ...dep, type: v })}
            placeholder="Jenis"
          />
        </div>
        <div className="col-span-1">
          <FieldLabel>Nama</FieldLabel>
          <TextInput
            value={dep.name}
            onChange={(v) => onChange({ ...dep, name: v })}
            placeholder="Nama"
          />
        </div>
        <div className="col-span-1">
          <FieldLabel>Usia</FieldLabel>
          <TextInput
            value={dep.age > 0 ? String(dep.age) : ""}
            onChange={(v) => {
              const n = parseInt(v.replace(/\D/g, ""), 10);
              onChange({ ...dep, age: isNaN(n) ? 0 : n });
            }}
            placeholder="0"
            inputMode="numeric"
          />
        </div>
      </div>
    </div>
  );
}

export default function Step3Family() {
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((s: RootState) => s.rtoApplication.draft);
  const [showGuarantor, setShowGuarantor] = useState(
    draft.guarantorType !== "none",
  );

  const update = (patch: Record<string, unknown>) => {
    dispatch(updateDraft(patch));
  };

  const isMarried = draft.maritalStatus === "married";

  const updateGuarantor = (key: keyof Guarantor, val: unknown) => {
    update({
      guarantor: {
        ...(draft.guarantor ?? {
          name: "",
          phone: "",
          nik: "",
          relation: "",
          income: 0,
          address: "",
        }),
        [key]: val,
      },
    });
  };

  const addDependent = () => {
    update({ dependents: [...draft.dependents, { ...EMPTY_DEPENDENT }] });
  };

  const updateDependent = (index: number, updated: Dependent) => {
    const next = [...draft.dependents];
    next[index] = updated;
    update({ dependents: next });
  };

  const removeDependent = (index: number) => {
    update({ dependents: draft.dependents.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 px-4 py-6 pb-28 sm:px-5">
      {/* ── Pasangan ── */}
      {isMarried && (
        <section>
          <SectionHeading>Pasangan</SectionHeading>
          <div>
            <FieldLabel>Penghasilan Pasangan / bulan</FieldLabel>
            <RpInput
              value={draft.spouseIncome ?? 0}
              onChange={(v) => update({ spouseIncome: v })}
              placeholder="0"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Penghasilan pasangan turut meningkatkan skor
            </p>
          </div>
        </section>
      )}

      {/* ── Tanggungan ── */}
      <section>
        <SectionHeading>Tanggungan</SectionHeading>
        <div className="space-y-3">
          {draft.dependents.map((dep, i) => (
            <DependentCard
              key={i}
              dep={dep}
              index={i}
              onChange={(updated) => updateDependent(i, updated)}
              onRemove={() => removeDependent(i)}
            />
          ))}
          <button
            type="button"
            onClick={addDependent}
            className="w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs font-semibold text-gray-400 hover:border-[#4DB6AC] hover:text-[#4DB6AC] transition-colors"
          >
            + Tambah Tanggungan
          </button>
          {draft.dependents.length === 0 && (
            <p className="text-[10px] text-gray-400 text-center">
              Tidak ada tanggungan? Lewati saja.
            </p>
          )}
        </div>
      </section>

      {/* ── Penjamin ── */}
      <section>
        <SectionHeading>Penjamin (Opsional)</SectionHeading>
        <InfoBox variant="info">
          Penjamin meningkatkan peluang persetujuan, terutama jika skor di bawah
          60.
        </InfoBox>
        <div className="mt-3 space-y-4">
          <div>
            <FieldLabel>Tipe Penjamin</FieldLabel>
            <PillSelector
              value={draft.guarantorType}
              options={GUARANTOR_OPTIONS}
              onChange={(v) => {
                update({ guarantorType: v });
                setShowGuarantor(v !== "none");
              }}
            />
          </div>

          {showGuarantor && draft.guarantorType !== "none" && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <div>
                <FieldLabel>Nama Penjamin</FieldLabel>
                <TextInput
                  value={draft.guarantor?.name ?? ""}
                  onChange={(v) => updateGuarantor("name", v)}
                  placeholder="Sesuai KTP"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>NIK Penjamin</FieldLabel>
                  <TextInput
                    value={draft.guarantor?.nik ?? ""}
                    onChange={(v) =>
                      updateGuarantor("nik", v.replace(/\D/g, "").slice(0, 16))
                    }
                    placeholder="16 digit"
                    inputMode="numeric"
                    maxLength={16}
                  />
                </div>
                <div>
                  <FieldLabel>No HP</FieldLabel>
                  <TextInput
                    value={draft.guarantor?.phone ?? ""}
                    onChange={(v) => updateGuarantor("phone", v)}
                    placeholder="081234567890"
                    type="tel"
                    inputMode="tel"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Penghasilan Penjamin / bulan</FieldLabel>
                <RpInput
                  value={draft.guarantor?.income ?? 0}
                  onChange={(v) => updateGuarantor("income", v)}
                  placeholder="3.000.000"
                />
              </div>
              <div>
                <FieldLabel>Alamat Penjamin</FieldLabel>
                <TextInput
                  value={draft.guarantor?.address ?? ""}
                  onChange={(v) => updateGuarantor("address", v)}
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <CTABar
        primaryLabel="Lanjut →"
        onPrimary={() => dispatch(goToStep(4))}
        onBack={() => dispatch(goToStep(2))}
      />
    </div>
  );
}
