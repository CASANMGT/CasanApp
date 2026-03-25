import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { updateDraft, goToStep } from "../../features/rto/rtoApplicationSlice";
import type { UploadedDocument } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";
import { SectionHeading, InfoBox } from "../../components/rto/FormFields";

interface DocSlot {
  docId: string;
  label: string;
  description: string;
  icon: string;
  required: boolean;
}

const GUARANTOR_DOC_SLOTS: DocSlot[] = [
  {
    docId: "ktp_penjamin",
    label: "KTP Penjamin",
    description: "Foto KTP penjamin yang jelas — nama harus sama dengan data penjamin",
    icon: "🪪",
    required: true,
  },
  {
    docId: "slip_gaji_penjamin",
    label: "Slip gaji / bukti penghasilan penjamin",
    description: "Bukti penghasilan bulan terakhir (gaji, rekening koran bisnis penjamin, dll.)",
    icon: "💼",
    required: true,
  },
];

const BASE_DOC_SLOTS: DocSlot[] = [
  {
    docId: "ktp",
    label: "KTP",
    description: "Foto KTP yang jelas dan tidak buram",
    icon: "🪪",
    required: true,
  },
  {
    docId: "selfie_ktp",
    label: "Selfie + KTP",
    description: "Foto diri memegang KTP di samping wajah",
    icon: "🤳",
    required: true,
  },
  {
    docId: "kk",
    label: "Kartu Keluarga",
    description: "Foto KK halaman utama",
    icon: "👨‍👩‍👧‍👦",
    required: false,
  },
  {
    docId: "sim",
    label: "SIM C",
    description: "SIM C yang masih berlaku",
    icon: "🏍️",
    required: true,
  },
  {
    docId: "slip_gaji",
    label: "Slip Gaji / Screenshot Pendapatan",
    description: "Bukti penghasilan bulan terakhir",
    icon: "💵",
    required: false,
  },
  {
    docId: "slik",
    label: "Hasil SLIK OJK",
    description: "Screenshot BI Checking (opsional)",
    icon: "📊",
    required: false,
  },
];

function buildDocSlots(guarantorActive: boolean): DocSlot[] {
  return guarantorActive
    ? [...BASE_DOC_SLOTS, ...GUARANTOR_DOC_SLOTS]
    : [...BASE_DOC_SLOTS];
}

function DocumentCard({
  slot,
  uploadedDoc,
  file,
  onFileChange,
  onRemove,
}: {
  slot: DocSlot;
  uploadedDoc?: UploadedDocument;
  file?: File;
  onFileChange: (f: File) => void;
  onRemove: () => void;
}) {
  const hasFile = !!file || !!uploadedDoc;
  const fileName = file?.name ?? uploadedDoc?.fileName;

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-colors ${
        hasFile
          ? "border-[#4DB6AC] bg-[#4DB6AC]/5"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{slot.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">
              {slot.label}
            </span>
            {slot.required && (
              <span className="rounded-full bg-red/10 px-2 py-0.5 text-[9px] font-bold text-red">
                Wajib
              </span>
            )}
            {hasFile && (
              <span className="rounded-full bg-lightGreen px-2 py-0.5 text-[9px] font-bold text-green">
                Terupload
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {slot.description}
          </p>

          {hasFile && fileName && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="flex-1 text-xs text-gray-600 truncate">
                {fileName}
              </span>
              <button
                type="button"
                onClick={onRemove}
                className="text-xs font-semibold text-red hover:underline shrink-0"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      {!hasFile && (
        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs font-semibold text-gray-400 hover:border-[#4DB6AC] hover:text-[#4DB6AC] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          Upload File
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFileChange(f);
              e.target.value = "";
            }}
          />
        </label>
      )}
    </div>
  );
}

export default function Step5Documents() {
  const dispatch = useDispatch<AppDispatch>();
  const draft = useSelector((s: RootState) => s.rtoApplication.draft);
  const guarantorActive = draft.guarantorType !== "none";
  const docSlots = useMemo(
    () => buildDocSlots(guarantorActive),
    [guarantorActive],
  );

  const [localFiles, setLocalFiles] = useState<Record<string, File>>({});

  const update = (patch: Record<string, unknown>) => {
    dispatch(updateDraft(patch));
  };

  const handleUpload = (docId: string, file: File) => {
    setLocalFiles((prev) => ({ ...prev, [docId]: file }));

    const existing = draft.uploadedDocs.filter((d) => d.docId !== docId);
    const newDoc: UploadedDocument = {
      docId,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: "uploaded",
    };
    update({ uploadedDocs: [...existing, newDoc] });
  };

  const handleRemove = (docId: string) => {
    setLocalFiles((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
    update({
      uploadedDocs: draft.uploadedDocs.filter((d) => d.docId !== docId),
    });
  };

  const requiredIds = docSlots.filter((s) => s.required).map((s) => s.docId);
  const uploadedIds = draft.uploadedDocs.map((d) => d.docId);
  const allRequiredUploaded = requiredIds.every((id) =>
    uploadedIds.includes(id),
  );

  const uploadedCount = draft.uploadedDocs.length;
  const totalCount = docSlots.length;

  return (
    <div className="space-y-6 px-4 py-6 pb-28 sm:px-5">
      <section>
        <SectionHeading>Upload Dokumen</SectionHeading>

        {guarantorActive && (
          <div className="mb-3">
            <InfoBox variant="info">
              <span className="font-bold">Penjamin aktif:</span> unggah{" "}
              <strong>KTP penjamin</strong> dan{" "}
              <strong>bukti penghasilan penjamin</strong> di bagian bawah. Ini
              membantu verifikasi hubungan dan daya bayar bersama — bukan jaminan
              persetujuan otomatis.
            </InfoBox>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">
              {uploadedCount} dari {totalCount} dokumen
            </span>
            <span className="text-xs font-bold text-[#4DB6AC]">
              {Math.round((uploadedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4DB6AC] transition-all"
              style={{
                width: `${(uploadedCount / totalCount) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {docSlots.map((slot) => (
            <DocumentCard
              key={slot.docId}
              slot={slot}
              uploadedDoc={draft.uploadedDocs.find(
                (d) => d.docId === slot.docId,
              )}
              file={localFiles[slot.docId]}
              onFileChange={(f) => handleUpload(slot.docId, f)}
              onRemove={() => handleRemove(slot.docId)}
            />
          ))}
        </div>
      </section>

      {!allRequiredUploaded && (
        <InfoBox variant="warning">
          <span className="font-bold">Dokumen wajib belum lengkap.</span> Kamu
          tetap bisa lanjut, tapi skor dokumen akan lebih rendah.
        </InfoBox>
      )}

      {allRequiredUploaded && (
        <div className="rounded-xl border border-strokeGreen bg-lightGreen p-3 text-center">
          <p className="text-xs font-semibold text-green">
            Semua dokumen wajib sudah terupload!
          </p>
        </div>
      )}

      <CTABar
        primaryLabel="Lihat Skor →"
        onPrimary={() => dispatch(goToStep(6))}
        onBack={() => dispatch(goToStep(4))}
      />
    </div>
  );
}
