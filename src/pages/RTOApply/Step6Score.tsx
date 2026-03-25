import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { submitApplication } from "../../features/rto/rtoApplicationSlice";
import type { ScoreBreakdown } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";

/** Placeholder scoring — returns a fixed 50/100 until Slice 3 adds the real engine */
function placeholderScore(): ScoreBreakdown {
  return {
    identity: 10,
    income: 8,
    employment: 7,
    family: 5,
    credit: 8,
    documents: 5,
    total: 43,
  };
}

const DIMENSIONS: { key: keyof Omit<ScoreBreakdown, "total">; label: string; max: number }[] = [
  { key: "identity", label: "Identitas", max: 18 },
  { key: "income", label: "Penghasilan", max: 22 },
  { key: "employment", label: "Pekerjaan", max: 15 },
  { key: "family", label: "Keluarga", max: 12 },
  { key: "credit", label: "Kredit", max: 18 },
  { key: "documents", label: "Dokumen", max: 15 },
];

function getDecision(total: number) {
  if (total >= 80)
    return { label: "Disetujui Otomatis", color: "text-green-500", bg: "bg-green-50", eta: "Motor siap 1-2 hari kerja" };
  if (total >= 60)
    return { label: "Disetujui", color: "text-teal-600", bg: "bg-teal-50", eta: "Dealer hubungi 24 jam" };
  if (total >= 41)
    return { label: "Sedang Direview", color: "text-blue-500", bg: "bg-blue-50", eta: "Analisis 1-3 hari kerja" };
  if (total >= 21)
    return { label: "Perlu Penjamin", color: "text-amber-500", bg: "bg-amber-50", eta: "Lengkapi penjamin & dokumen" };
  return { label: "Tidak Disetujui", color: "text-red-500", bg: "bg-red-50", eta: "Bisa mendaftar ulang setelah 30 hari" };
}

interface Props {
  onBack: () => void;
}

export default function Step6Score({ onBack }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { operatorName, bikeName, pricePerDay } = useSelector(
    (s: RootState) => s.rtoApplication,
  );

  const score = placeholderScore();
  const decision = getDecision(score.total);

  const handleSubmit = () => {
    dispatch(submitApplication(score));
    navigate("/rto-status/latest", { replace: true });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      {/* Score card */}
      <div className={`rounded-2xl ${decision.bg} border border-gray-100 p-6 text-center`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Live Scoring
        </p>
        <div className="text-5xl font-black tabular-nums text-gray-900">
          {score.total}
          <span className="text-lg font-semibold text-gray-400">/100</span>
        </div>
        <p className={`mt-2 text-sm font-bold ${decision.color}`}>
          {decision.label}
        </p>
        <div className="mt-2 h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4DB6AC] transition-all"
            style={{ width: `${score.total}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-gray-500">{decision.eta}</p>
      </div>

      {/* Dimension breakdown */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
          Breakdown per Dimensi
        </h3>
        <div className="space-y-3">
          {DIMENSIONS.map(({ key, label, max }) => {
            const val = score[key];
            const pct = Math.round((val / max) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <span className="text-xs font-bold tabular-nums text-gray-500">
                    {val}/{max}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4DB6AC] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Program recap */}
      {operatorName && (
        <section>
          <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
            Program Dipilih
          </h3>
          <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center gap-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4DB6AC]/10 text-lg">
              🛵
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {bikeName || "Motor Listrik"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {operatorName}
                {pricePerDay > 0 && (
                  <> &middot; Rp {pricePerDay.toLocaleString("id-ID")}/hari</>
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
        <p className="text-xs text-amber-700">
          <span className="font-bold">Catatan:</span> Skor dihitung otomatis dari data yang kamu isi.
          Kamu tetap bisa submit meskipun ada data yang belum lengkap — skor mencerminkan kelengkapan.
        </p>
      </div>

      <CTABar
        primaryLabel="Submit Aplikasi →"
        onPrimary={handleSubmit}
        onBack={onBack}
      />
    </div>
  );
}
