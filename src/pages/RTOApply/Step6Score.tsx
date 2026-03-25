import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { submitApplication } from "../../features/rto/rtoApplicationSlice";
import { calculateScore } from "../../features/rto/rtoScoringEngine";
import type { ScoreBreakdown } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";

const DIMENSIONS: { key: keyof Omit<ScoreBreakdown, "total">; label: string; max: number }[] = [
  { key: "identity", label: "Identitas", max: 18 },
  { key: "income", label: "Penghasilan", max: 22 },
  { key: "employment", label: "Pekerjaan", max: 15 },
  { key: "family", label: "Keluarga", max: 12 },
  { key: "credit", label: "Kredit", max: 18 },
  { key: "documents", label: "Dokumen", max: 15 },
];

interface Decision {
  label: string;
  color: string;
  bg: string;
  border: string;
  eta: string;
}

function getDecision(total: number): Decision {
  if (total >= 80)
    return { label: "Disetujui Otomatis", color: "text-green", bg: "bg-lightGreen", border: "border-strokeGreen", eta: "Motor siap 1-2 hari kerja" };
  if (total >= 60)
    return { label: "Disetujui", color: "text-primaryDark", bg: "bg-primary10", border: "border-primary30", eta: "Dealer hubungi via WhatsApp dalam 24 jam" };
  if (total >= 41)
    return { label: "Sedang Direview", color: "text-gold", bg: "bg-lightOrange", border: "border-strokeOrange", eta: "Analisis manual 1-3 hari kerja" };
  if (total >= 21)
    return { label: "Perlu Penjamin", color: "text-orange", bg: "bg-lightOrange", border: "border-strokeOrange", eta: "Lengkapi penjamin & dokumen tambahan" };
  return { label: "Tidak Disetujui", color: "text-red", bg: "bg-lightRed", border: "border-strokeRed", eta: "Bisa mendaftar ulang setelah 30 hari" };
}

const SCORE_GUIDE = [
  { range: "80 - 100", label: "Disetujui Otomatis", desc: "Motor siap 1-2 hari kerja", color: "bg-green" },
  { range: "60 - 79", label: "Disetujui", desc: "Dealer hubungi 24 jam", color: "bg-primary100" },
  { range: "41 - 59", label: "Sedang Direview", desc: "Analisis 1-3 hari kerja", color: "bg-orange" },
  { range: "21 - 40", label: "Perlu Penjamin", desc: "Lengkapi penjamin & dokumen", color: "bg-gold" },
  { range: "0 - 20", label: "Tidak Disetujui", desc: "Daftar ulang setelah 30 hari", color: "bg-red" },
];

interface Props {
  onBack: () => void;
}

export default function Step6Score({ onBack }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { draft, operatorName, bikeName, pricePerDay, minSalary } = useSelector(
    (s: RootState) => s.rtoApplication,
  );

  const score = useMemo(
    () => calculateScore(draft, minSalary),
    [draft, minSalary],
  );
  const decision = getDecision(score.total);

  const handleSubmit = () => {
    dispatch(submitApplication(score));
    navigate("/rto-status/latest", { replace: true });
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      {/* Score card */}
      <div className={`rounded-2xl ${decision.bg} ${decision.border} border p-6 text-center`}>
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

      {/* Scoring guide */}
      <section>
        <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.14em] mb-3">
          Panduan Skor
        </h3>
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          {SCORE_GUIDE.map((tier, i) => (
            <div
              key={tier.range}
              className={`flex items-center gap-3 px-4 py-2.5 ${
                i < SCORE_GUIDE.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div className={`h-3 w-3 rounded-full ${tier.color} shrink-0`} />
              <span className="text-xs font-bold text-gray-700 w-14 tabular-nums shrink-0">
                {tier.range}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-800">
                  {tier.label}
                </span>
                <span className="text-[10px] text-gray-400 ml-1.5">
                  — {tier.desc}
                </span>
              </div>
            </div>
          ))}
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

      <div className="rounded-xl bg-lightOrange border border-strokeOrange p-3">
        <p className="text-xs text-gold">
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
