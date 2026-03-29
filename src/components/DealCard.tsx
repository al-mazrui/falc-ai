"use client";

import { Deal } from "@/lib/data";
import Link from "next/link";

function StatusDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

export default function DealCard({ deal }: { deal: Deal }) {
  const hasOverdue = deal.overduePaymentsCount > 0 || deal.overdueAdminCount > 0;
  const healthColor =
    deal.financialHealthScore >= 75
      ? "#2D8659"
      : deal.financialHealthScore >= 50
      ? "#D4952A"
      : "#C4434A";

  return (
    <Link href={`/deal/${deal.id}`}>
      <div
        className={`bg-white rounded-xl p-5 border transition-all hover:shadow-md cursor-pointer ${
          hasOverdue ? "border-[#C4434A]/30" : "border-[#E8E5DF]"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-sm font-bold text-[#143449]">
              {deal.targetCompany}
            </div>
            <div className="text-[11px] text-[#9CA3AF] mt-0.5">
              {deal.sector} · {deal.country}
            </div>
          </div>
          {/* Health ring */}
          <div className="relative w-10 h-10 shrink-0">
            <svg viewBox="0 0 36 36" className="w-10 h-10">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="#E8E5DF"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke={healthColor}
                strokeWidth="3"
                strokeDasharray={`${deal.financialHealthScore * 0.942} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[9px] font-bold"
              style={{ color: healthColor }}
            >
              {deal.financialHealthScore}
            </span>
          </div>
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="text-[10px] text-[#9CA3AF]">Investment</div>
            <div className="text-base font-bold text-[#98802e]">
              ${(deal.totalInvestment / 1e6).toFixed(0)}M
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#9CA3AF]">Ownership</div>
            <div className="text-base font-bold text-[#143449]">
              {deal.ownershipPct}%
            </div>
          </div>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-3 text-[10px] pt-2 border-t border-[#E8E5DF]">
          <div className="flex items-center gap-1">
            <StatusDot
              color={
                deal.overduePaymentsCount > 0 ? "#C4434A" : "#2D8659"
              }
            />
            <span className="text-[#6B7280]">
              {deal.overduePaymentsCount > 0
                ? `${deal.overduePaymentsCount} overdue`
                : "Payments OK"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <StatusDot
              color={
                deal.overdueAdminCount > 0 ? "#D4952A" : "#2D8659"
              }
            />
            <span className="text-[#6B7280]">
              {deal.overdueAdminCount > 0
                ? `${deal.overdueAdminCount} filings due`
                : "Admin OK"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
