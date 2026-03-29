"use client";

import { Deal } from "@/lib/data";
import Link from "next/link";

function HealthBadge({ score }: { score: number }) {
  const bg =
    score >= 80
      ? "bg-green-800/60 text-green-300"
      : score >= 60
      ? "bg-yellow-800/60 text-yellow-300"
      : score >= 40
      ? "bg-orange-800/60 text-orange-300"
      : "bg-red-800/60 text-red-300";
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bg}`}>
      {score}%
    </span>
  );
}

export default function DealCard({ deal }: { deal: Deal }) {
  const hasIssues = deal.overduePaymentsCount > 0 || deal.overdueAdminCount > 0;

  return (
    <Link href={`/deal/${deal.id}`}>
      <div
        className={`rounded-xl p-4 border transition-all hover:border-[#98802e]/60 hover:shadow-lg hover:shadow-[#98802e]/5 cursor-pointer ${
          hasIssues
            ? "border-red-700/40 bg-gradient-to-br from-[#143449] to-[#1a1015]"
            : "border-[#1f506a]/30 bg-[#143449]"
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              {deal.targetCompany}
            </div>
            <div className="text-[10px] text-[#c1ddfa] opacity-60 mt-0.5">
              {deal.sector} • {deal.country}
            </div>
          </div>
          <HealthBadge score={deal.financialHealthScore} />
        </div>

        {/* Key numbers */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[#0d2233] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#c1ddfa] opacity-50">
              Investment
            </div>
            <div className="text-sm font-bold text-white">
              ${(deal.totalInvestment / 1e6).toFixed(0)}M
            </div>
          </div>
          <div className="bg-[#0d2233] rounded-lg px-3 py-2">
            <div className="text-[10px] text-[#c1ddfa] opacity-50">
              Ownership
            </div>
            <div className="text-sm font-bold text-white">
              {deal.ownershipPct}%
            </div>
          </div>
        </div>

        {/* Alert row */}
        <div className="flex items-center gap-2 text-[10px]">
          {deal.overduePaymentsCount > 0 && (
            <span className="bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded font-bold">
              {deal.overduePaymentsCount} overdue payment
              {deal.overduePaymentsCount > 1 ? "s" : ""}
            </span>
          )}
          {deal.overdueAdminCount > 0 && (
            <span className="bg-orange-900/40 text-orange-300 px-1.5 py-0.5 rounded font-bold">
              {deal.overdueAdminCount} overdue filing
              {deal.overdueAdminCount > 1 ? "s" : ""}
            </span>
          )}
          {!hasIssues && (
            <span className="bg-green-900/40 text-green-300 px-1.5 py-0.5 rounded font-bold">
              On track
            </span>
          )}
          <span className="text-[#c1ddfa] opacity-40 ml-auto">
            {deal.securityType}
          </span>
        </div>
      </div>
    </Link>
  );
}
