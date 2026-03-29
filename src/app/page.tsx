"use client";

import { deals, getPortfolioSummary } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import DealCard from "@/components/DealCard";
import PortfolioHeatmap from "@/components/PortfolioHeatmap";
import {
  PaymentStatusChart,
  SectorAllocationChart,
} from "@/components/FinancialSummaryCharts";

function StatBox({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-5 py-4 border ${
        alert
          ? "border-red-700/40 bg-gradient-to-br from-[#143449] to-[#1a1015]"
          : "border-[#1f506a]/30 bg-[#143449]"
      }`}
    >
      <div className="text-xs text-[#c1ddfa] opacity-60 mb-1">{label}</div>
      <div
        className={`text-2xl font-bold ${
          alert ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const summary = getPortfolioSummary();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#1f506a]/30 px-8 py-6 bg-gradient-to-r from-[#0d2233] to-[#143449]">
          <h1 className="text-2xl font-bold text-white">
            Portfolio Overview
          </h1>
          <p className="text-sm text-[#c1ddfa] opacity-60 mt-1">
            Falconer Capital Fund III — {summary.totalDeals} active investments
          </p>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <StatBox
              label="Total Invested"
              value={`$${(summary.totalInvested / 1e9).toFixed(1)}B`}
            />
            <StatBox
              label="Total Outstanding"
              value={`$${(summary.totalOutstanding / 1e9).toFixed(2)}B`}
            />
            <StatBox
              label="Total Paid"
              value={`$${(summary.totalPaid / 1e9).toFixed(2)}B`}
            />
            <StatBox
              label="Overdue Payments"
              value={String(summary.overduePayments)}
              alert={summary.overduePayments > 0}
            />
            <StatBox
              label="Overdue Admin/Filings"
              value={String(summary.overdueAdmin)}
              alert={summary.overdueAdmin > 0}
            />
            <StatBox
              label="Avg Financial Health"
              value={`${summary.avgFinancialHealth}%`}
              alert={summary.avgFinancialHealth < 60}
            />
          </div>

          {/* Portfolio Heatmap — the "GitHub chart" */}
          <div className="rounded-xl border border-[#1f506a]/30 bg-[#143449] p-6">
            <h2 className="text-lg font-bold text-white mb-1">
              Portfolio Health Matrix
            </h2>
            <p className="text-xs text-[#c1ddfa] opacity-50 mb-4">
              Each row is a target company. Green = healthy, Gold = monitor, Orange = warning, Red = critical action needed.
            </p>
            <PortfolioHeatmap deals={deals} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-[#1f506a]/30 bg-[#143449] p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Payment Status by Company ($M)
              </h2>
              <PaymentStatusChart deals={deals} />
            </div>
            <div className="rounded-xl border border-[#1f506a]/30 bg-[#143449] p-6">
              <h2 className="text-lg font-bold text-white mb-4">
                Sector Allocation
              </h2>
              <SectorAllocationChart deals={deals} />
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              All Investments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
