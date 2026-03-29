"use client";

import { Deal } from "@/lib/data";
import Link from "next/link";

// GitHub-style heatmap for the managing partner to see portfolio health at a glance
// Rows = deals, Columns = metrics, Color = severity

function getHealthColor(score: number): string {
  if (score >= 80) return "#2d6a4f"; // green
  if (score >= 60) return "#98802e"; // gold
  if (score >= 40) return "#d4740e"; // orange
  return "#c1292e"; // red
}

function getBurdenColor(score: number): string {
  if (score <= 30) return "#2d6a4f";
  if (score <= 50) return "#98802e";
  if (score <= 70) return "#d4740e";
  return "#c1292e";
}

function getOverdueColor(count: number): string {
  if (count === 0) return "#2d6a4f";
  if (count === 1) return "#98802e";
  if (count <= 3) return "#d4740e";
  return "#c1292e";
}

export default function PortfolioHeatmap({ deals }: { deals: Deal[] }) {
  const cellSize = 38;
  const gap = 3;
  const labelWidth = 200;
  const headerHeight = 80;
  const columns = [
    { label: "Financial Health", key: "financialHealth" },
    { label: "Overdue Payments", key: "overduePayments" },
    { label: "Outstanding ($)", key: "outstanding" },
    { label: "Admin Burden", key: "adminBurden" },
    { label: "Overdue Admin", key: "overdueAdmin" },
  ];

  const width = labelWidth + columns.length * (cellSize + gap) + 20;
  const height = headerHeight + deals.length * (cellSize + gap) + 10;

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="font-[Arsenal]">
        {/* Column headers */}
        {columns.map((col, ci) => (
          <text
            key={col.key}
            x={labelWidth + ci * (cellSize + gap) + cellSize / 2}
            y={headerHeight - 10}
            textAnchor="middle"
            fill="#c1ddfa"
            fontSize={10}
            transform={`rotate(-35, ${labelWidth + ci * (cellSize + gap) + cellSize / 2}, ${headerHeight - 10})`}
          >
            {col.label}
          </text>
        ))}

        {/* Rows */}
        {deals.map((deal, ri) => {
          const y = headerHeight + ri * (cellSize + gap);
          const values = [
            { color: getHealthColor(deal.financialHealthScore), label: `${deal.financialHealthScore}%` },
            { color: getOverdueColor(deal.overduePaymentsCount), label: `${deal.overduePaymentsCount}` },
            { color: getOverdueColor(Math.ceil(deal.totalOutstanding / 50_000_000)), label: `$${(deal.totalOutstanding / 1e6).toFixed(0)}M` },
            { color: getBurdenColor(deal.adminBurdenScore), label: `${deal.adminBurdenScore}%` },
            { color: getOverdueColor(deal.overdueAdminCount), label: `${deal.overdueAdminCount}` },
          ];

          return (
            <g key={deal.id}>
              <Link href={`/deal/${deal.id}`}>
                <text
                  x={labelWidth - 10}
                  y={y + cellSize / 2 + 4}
                  textAnchor="end"
                  fill="#c1ddfa"
                  fontSize={12}
                  className="cursor-pointer hover:fill-[#98802e]"
                >
                  {deal.targetCompany.length > 24
                    ? deal.targetCompany.slice(0, 22) + "…"
                    : deal.targetCompany}
                </text>
              </Link>
              {values.map((v, ci) => (
                <g key={ci}>
                  <rect
                    x={labelWidth + ci * (cellSize + gap)}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={4}
                    fill={v.color}
                    opacity={0.85}
                    className="heatmap-cell"
                  />
                  <text
                    x={labelWidth + ci * (cellSize + gap) + cellSize / 2}
                    y={y + cellSize / 2 + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    {v.label}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
