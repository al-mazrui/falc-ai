"use client";

import { Deal } from "@/lib/data";
import Link from "next/link";

// Traffic-light matrix — the managing partner's primary tool
// Rows sorted by worst health first so problems float to the top

const STATUS_COLORS = {
  critical: "#C4434A",
  warning: "#D4952A",
  ok: "#2D8659",
  neutral: "#94A3B8",
};

function dot(score: number, invert = false) {
  const s = invert ? 100 - score : score;
  if (s >= 75) return STATUS_COLORS.ok;
  if (s >= 50) return STATUS_COLORS.warning;
  return STATUS_COLORS.critical;
}

function countDot(count: number) {
  if (count === 0) return STATUS_COLORS.ok;
  if (count <= 1) return STATUS_COLORS.warning;
  return STATUS_COLORS.critical;
}

const columns = [
  { label: "Financial\nHealth", key: "fin" },
  { label: "Overdue\nPayments", key: "op" },
  { label: "Admin\nBurden", key: "ab" },
  { label: "Overdue\nFilings", key: "of" },
  { label: "Outstanding\n($M)", key: "out" },
];

export default function PortfolioHeatmap({ deals }: { deals: Deal[] }) {
  // Sort worst health first
  const sorted = [...deals].sort(
    (a, b) => a.financialHealthScore - b.financialHealthScore
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 pr-4 text-[#9CA3AF] text-xs font-normal w-[220px]">
              Company
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-center py-2 px-3 text-[#9CA3AF] text-[10px] font-normal whitespace-pre-line leading-tight"
              >
                {col.label}
              </th>
            ))}
            <th className="text-right py-2 pl-4 text-[#9CA3AF] text-xs font-normal">
              Investment
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((deal) => {
            const cells = [
              {
                color: dot(deal.financialHealthScore),
                label: `${deal.financialHealthScore}%`,
              },
              {
                color: countDot(deal.overduePaymentsCount),
                label: String(deal.overduePaymentsCount),
              },
              {
                color: dot(deal.adminBurdenScore, true),
                label: `${deal.adminBurdenScore}`,
              },
              {
                color: countDot(deal.overdueAdminCount),
                label: String(deal.overdueAdminCount),
              },
              {
                color:
                  deal.totalOutstanding > 200e6
                    ? STATUS_COLORS.critical
                    : deal.totalOutstanding > 80e6
                    ? STATUS_COLORS.warning
                    : STATUS_COLORS.ok,
                label: `$${(deal.totalOutstanding / 1e6).toFixed(0)}M`,
              },
            ];

            return (
              <tr
                key={deal.id}
                className="border-t border-[#E8E5DF] hover:bg-[#F3F1EC] transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <Link
                    href={`/deal/${deal.id}`}
                    className="text-[#143449] font-bold text-sm hover:text-[#98802e] transition-colors"
                  >
                    {deal.targetCompany}
                  </Link>
                  <div className="text-[10px] text-[#9CA3AF]">
                    {deal.sector} · {deal.country}
                  </div>
                </td>
                {cells.map((cell, ci) => (
                  <td key={ci} className="text-center py-2.5 px-3">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: cell.color }}
                      />
                      <span className="text-[10px] text-[#6B7280] font-bold">
                        {cell.label}
                      </span>
                    </div>
                  </td>
                ))}
                <td className="text-right py-2.5 pl-4">
                  <span className="text-sm font-bold text-[#143449]">
                    ${(deal.totalInvestment / 1e6).toFixed(0)}M
                  </span>
                  <div className="text-[10px] text-[#9CA3AF]">
                    {deal.ownershipPct}% · {deal.securityType.split(" ")[0]}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
