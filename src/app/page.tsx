"use client";

import { deals, getPortfolioSummary } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import DealCard from "@/components/DealCard";
import PortfolioHeatmap from "@/components/PortfolioHeatmap";
import {
  PaymentStatusChart,
  HealthBarChart,
} from "@/components/FinancialSummaryCharts";

function StatBox({
  label,
  value,
  alert,
  gold,
}: {
  label: string;
  value: string;
  alert?: boolean;
  gold?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 border border-[#E8E5DF]">
      <div className="text-xs text-[#9CA3AF] mb-1">{label}</div>
      <div
        className={`text-2xl font-bold ${
          alert
            ? "text-[#C4434A]"
            : gold
            ? "text-[#98802e]"
            : "text-[#143449]"
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
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#E8E5DF] px-8 py-6 bg-white">
          <h1 className="text-2xl font-bold text-[#143449]">
            Portfolio Overview
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Al Falaj Capital Fund III — {summary.totalDeals} active
            investments
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatBox
              label="Total Invested"
              value={`$${(summary.totalInvested / 1e9).toFixed(1)}B`}
              gold
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

          {/* Traffic Light Matrix */}
          <div className="bg-white rounded-xl border border-[#E8E5DF] p-6">
            <h2 className="text-lg font-bold text-[#143449] mb-1">
              Portfolio Health Matrix
            </h2>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Sorted by worst health first. Green = on track, Amber = monitor,
              Red = action needed.
            </p>
            <PortfolioHeatmap deals={deals} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E8E5DF] p-6">
              <h2 className="text-lg font-bold text-[#143449] mb-4">
                Payment Status by Company
              </h2>
              <PaymentStatusChart deals={deals} />
            </div>
            <div className="bg-white rounded-xl border border-[#E8E5DF] p-6">
              <h2 className="text-lg font-bold text-[#143449] mb-4">
                Financial Health Ranking
              </h2>
              <HealthBarChart deals={deals} />
            </div>
          </div>

          {/* Deal Cards Grid */}
          <div>
            <h2 className="text-lg font-bold text-[#143449] mb-4">
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
