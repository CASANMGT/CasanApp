import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import { submitApplication } from "../../features/rto/rtoApplicationSlice";
import { calculateScore } from "../../features/rto/rtoScoringEngine";
import type { ScoreBreakdown } from "../../types/rtoApplication";
import CTABar from "../../components/rto/CTABar";
import { rtoCard, rtoSectionTitle } from "../RTOProgramExplore/rtoUi";

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
    return {
      label: "Review diprioritaskan",
      color: "text-green",
      bg: "bg-lightGreen",
      border: "border-strokeGreen",
      eta: "Estimasi proses lebih cepat (1–2 hari kerja). Keputusan akhir setelah verifikasi dealer — bukan persetujuan otomatis",
    };
  if (total >= 60)
    return { label: "Indikasi layak", color: "text-primaryDark", bg: "bg-primary10", border: "border-primary30", eta: "Dealer hubungi via WhatsApp dalam 24 jam" };
  if (total >= 41)
    return { label: "Sedang Direview", color: "text-gold", bg: "bg-lightOrange", border: "border-strokeOrange", eta: "Analisis manual 1-3 hari kerja" };
  if (total >= 21)
    return { label: "Perlu Penjamin", color: "text-orange", bg: "bg-lightOrange", border: "border-strokeOrange", eta: "Lengkapi penjamin & dokumen tambahan" };
  return { label: "Tidak Disetujui", color: "text-red", bg: "bg-lightRed", border: "border-strokeRed", eta: "Bisa mendaftar ulang setelah 30 hari" };
}

const SCORE_GUIDE = [
  { range: "80 - 100", label: "Review diprioritaskan", desc: "Estimasi lebih cepat; tetap verifikasi", color: "bg-green" },
  { range: "60 - 79", label: "Indikasi layak", desc: "Dealer hubungi 24 jam", color: "bg-primary100" },
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
    <div className="space-y-4 px-4 py-6 pb-28 sm:px-5">
      {operatorName && (
        <p className="text-center text-[11px] text-gray-500">
          <span className="font-semibold text-gray-700">{bikeName || "Motor listrik"}</span>
          {" · "}
          {operatorName}
          {pricePerDay > 0 && (
            <>
              {" · "}
              Rp {pricePerDay.toLocaleString("id-ID")}/hari
            </>
          )}
        </p>
      )}

      <div
        className={`rounded-2xl border-2 p-5 text-center shadow-[0_8px_28px_rgba(0,0,0,0.07)] ${decision.bg} ${decision.border}`}
      >
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
          Skor live
        </p>
        <div className="text-4xl font-black tabular-nums text-gray-900 sm:text-5xl">
          {score.total}
          <span className="text-lg font-semibold text-gray-400">/100</span>
        </div>
        <p className={`mt-1.5 text-sm font-bold ${decision.color}`}>
          {decision.label}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#4DB6AC] transition-all"
            style={{ width: `${score.total}%` }}
          />
        </div>
        <p className="mt-2.5 text-[11px] leading-relaxed text-gray-500">{decision.eta}</p>
      </div>

      <details className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-t-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none transition-colors hover:bg-gray-50/80 focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
          <span>Detail per dimensi &amp; panduan skor</span>
          <span className="text-gray-400 transition-transform group-open:rotate-180" aria-hidden>
            ▼
          </span>
        </summary>
        <div className="space-y-4 border-t border-gray-50 px-4 pb-4 pt-3">
          <div>
            <h3 className={rtoSectionTitle}>Breakdown</h3>
            <div className={`${rtoCard} space-y-2.5 p-4`}>
              {DIMENSIONS.map(({ key, label, max }) => {
                const val = score[key];
                const pct = Math.round((val / max) * 100);
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-gray-700">{label}</span>
                      <span className="text-[11px] font-bold tabular-nums text-gray-500">
                        {val}/{max}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#4DB6AC] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className={rtoSectionTitle}>Panduan skor</h3>
            <div className={`${rtoCard} overflow-hidden`}>
              {SCORE_GUIDE.map((tier, i) => (
                <div
                  key={tier.range}
                  className={`flex items-center gap-2 px-3 py-2 ${
                    i < SCORE_GUIDE.length - 1 ? "border-b border-gray-50" : ""
                  }`}
                >
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${tier.color}`} />
                  <span className="w-12 shrink-0 text-[10px] font-bold tabular-nums text-gray-600">
                    {tier.range}
                  </span>
                  <div className="min-w-0 flex-1 text-[10px] leading-snug text-gray-700">
                    <span className="font-semibold">{tier.label}</span>
                    <span className="text-gray-400"> — {tier.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </details>

      <div className="rounded-xl border border-strokeOrange bg-lightOrange p-3">
        <p className="text-xs leading-relaxed text-gold">
          <span className="font-bold">Catatan:</span> Skor indikasi dari data yang kamu isi — bukan
          kontrak kredit. Keputusan akhir dari dealer setelah verifikasi.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-[#4DB6AC]/35 bg-gradient-to-b from-white to-[#f0faf8] p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#327478]">
          Ringkasan sebelum ajukan
        </p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-black tabular-nums text-gray-900">{score.total}</span>
          <span className="text-sm font-semibold text-gray-400">/100</span>
          <span className={`text-sm font-bold ${decision.color}`}>{decision.label}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] text-gray-600">
          {DIMENSIONS.map(({ key, label, max }) => (
            <div key={key} className="flex items-center justify-between gap-1 border-b border-gray-100/80 pb-1">
              <span className="truncate text-gray-500">{label}</span>
              <span className="shrink-0 tabular-nums font-semibold text-gray-800">
                {score[key]}/{max}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-gray-500">
          Periksa ringkasan di atas. Jika sudah sesuai, lanjut ajukan — data akan dikirim ke dealer.
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
