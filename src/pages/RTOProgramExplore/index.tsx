import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header2 } from "../../components";
import { rupiah } from "../../helpers";
import {
  RTO_EXPLORE_OPERATORS,
  formatRtoDistanceKm,
  nearestBranchDistanceKm,
  sortExploreOperatorsNearestFirst,
} from "../../data/rtoProgramExplore";
import { RTO_HOME_TAB_PATH, rtoOperatorPath } from "../../constants/rtoRoutes";
import { rtoCard } from "./rtoUi";
import { useRTOExploreUserPosition } from "../../hooks/useRTOExploreUserPosition";

export default function RTOProgramExplore() {
  const navigate = useNavigate();
  const { lat, lng, hasPosition, status } = useRTOExploreUserPosition();

  const sortedOperators = useMemo(
    () => sortExploreOperatorsNearestFirst(RTO_EXPLORE_OPERATORS, lat, lng),
    [lat, lng],
  );

  const branchCount = (op: (typeof RTO_EXPLORE_OPERATORS)[0]) =>
    op.branches?.length ?? 1;

  return (
    <div className="background-2 min-h-svh overflow-x-hidden pb-24 text-gray-900 antialiased">
      <Header2
        title="Jelajahi program lain"
        onDismiss={() => navigate(RTO_HOME_TAB_PATH)}
      />
      <div className="px-4 pt-2 pb-1">
        {status === "loading" && (
          <p className="text-xs text-gray-500">Mencari lokasi untuk urutan terdekat…</p>
        )}
        {status === "denied" && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            Izin lokasi ditolak — urutan pakai perkiraan jarak. Aktifkan lokasi untuk jarak dari kamu.
          </p>
        )}
        {hasPosition && (
          <p className="text-xs font-medium text-[#2d8a7d]">
            Diurutkan: cabang terdekat dari lokasi kamu
          </p>
        )}
      </div>
      <div className="mx-auto w-full max-w-lg space-y-4 px-4 pt-2">
        {sortedOperators.map((op) => {
          const dKm =
            hasPosition && lat != null && lng != null
              ? nearestBranchDistanceKm(op, lat, lng)
              : null;
          const distLabel =
            dKm != null
              ? `${formatRtoDistanceKm(dKm)} km`
              : `${op.distanceKm} km`;
          const nCabang = branchCount(op);

          return (
            <button
              key={op.id}
              type="button"
              onClick={() => navigate(rtoOperatorPath(op.id))}
              className={`${rtoCard} w-full p-4 text-left transition-transform active:scale-[0.995] hover:border-[#4DB6AC]/20`}
            >
              <div className="flex gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8f5f3] to-[#d4ebe8] text-xl font-bold text-[#2d8a7d] ring-1 ring-[#4DB6AC]/10">
                  {op.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{op.name}</h3>
                      <p className="mt-0.5 text-sm text-gray-500">{op.area}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                        <span>★</span>
                        <span>{op.rating}</span>
                        <span className="font-normal text-gray-400">({op.reviewCount})</span>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-[#4DB6AC]">{distLabel}</p>
                      <p className="text-[10px] text-gray-400">
                        {dKm != null
                          ? nCabang > 1
                            ? `Cabang terdekat · ${nCabang} lokasi`
                            : "Dari lokasi kamu"
                          : "Perkiraan"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {op.bikes.slice(0, 3).map((b) => (
                      <span
                        key={b.id}
                        className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-100"
                      >
                        {b.name}
                      </span>
                    ))}
                    {op.bikes.length > 3 && (
                      <span className="rounded-full bg-[#f0faf8] px-2.5 py-1 text-xs font-medium text-[#2d8a7d]">
                        +{op.bikes.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm text-gray-600">
                      Min. gaji{" "}
                      <span className="font-bold tabular-nums text-gray-900">
                        {rupiah(op.minSalary)}
                      </span>
                    </span>
                    <span className="flex items-center gap-0.5 text-sm font-bold text-[#4DB6AC]">
                      {op.bikes.length} motor <span aria-hidden>›</span>
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-lg px-4 pb-8 pt-4 text-center">
        <button
          type="button"
          onClick={() => navigate(RTO_HOME_TAB_PATH)}
          className="text-sm font-semibold text-[#4DB6AC] underline-offset-4 transition-colors hover:text-[#3d9e94] hover:underline"
        >
          ← Kembali ke Beranda RTO
        </button>
      </div>
    </div>
  );
}
