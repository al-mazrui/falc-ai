"use client";

import { use } from "react";
import { deals } from "@/lib/data";
import Sidebar from "@/components/Sidebar";
import PaymentTimeline from "@/components/PaymentTimeline";
import AdminCalendar from "@/components/AdminCalendar";
import GovernanceMatrix from "@/components/GovernanceMatrix";
import SPVChain from "@/components/SPVChain";
import Link from "next/link";

function Section({
  title,
  badge,
  children,
  partnerView,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  partnerView?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[#1f506a]/30 bg-[#143449] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1f506a]/30 bg-[#0d2233]">
        <h2 className="text-base font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {partnerView && (
            <span className="text-[9px] bg-[#98802e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Partner View
            </span>
          )}
          {badge && (
            <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded font-bold">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function KeyMetric({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-4 py-3 border ${
        alert
          ? "border-red-700/40 bg-[#1a1015]"
          : "border-[#1f506a]/30 bg-[#0d2233]"
      }`}
    >
      <div className="text-[10px] text-[#c1ddfa] opacity-50">{label}</div>
      <div
        className={`text-xl font-bold mt-0.5 ${
          alert ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-[#c1ddfa] opacity-40 mt-0.5">
          {sub}
        </div>
      )}
    </div>
  );
}

export default function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const deal = deals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[#c1ddfa] text-lg">Deal not found.</div>
        </main>
      </div>
    );
  }

  const totalOverdueAmount = deal.payments
    .filter((p) => p.status === "overdue")
    .reduce((s, p) => s + p.amount, 0);

  const penaltiesAccruing = deal.payments.filter(
    (p) => p.status === "overdue" && p.penaltyRate
  );

  const physicalPresenceCount = deal.adminObligations.filter(
    (a) => a.requiresPhysicalPresence
  ).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#1f506a]/30 px-8 py-6 bg-gradient-to-r from-[#0d2233] to-[#143449]">
          <Link
            href="/"
            className="text-xs text-[#c1ddfa] opacity-50 hover:opacity-80 transition-opacity"
          >
            ← Back to Portfolio
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">
            {deal.targetCompany}
          </h1>
          <p className="text-sm text-[#c1ddfa] opacity-60 mt-1">
            {deal.sector} • {deal.country} • Since{" "}
            {new Date(deal.dealDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-[#c1ddfa] opacity-40 mt-1">
            {deal.instrumentDescription}
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <KeyMetric
              label="Total Investment"
              value={`$${(deal.totalInvestment / 1e6).toFixed(0)}M`}
            />
            <KeyMetric
              label="Ownership"
              value={`${deal.ownershipPct}%`}
              sub={deal.securityType}
            />
            <KeyMetric
              label="Total Paid"
              value={`$${(deal.totalPaid / 1e6).toFixed(0)}M`}
            />
            <KeyMetric
              label="Total Outstanding"
              value={`$${(deal.totalOutstanding / 1e6).toFixed(0)}M`}
              alert={deal.totalOutstanding > 0}
            />
            <KeyMetric
              label="Overdue Amount"
              value={`$${(totalOverdueAmount / 1e6).toFixed(1)}M`}
              alert={totalOverdueAmount > 0}
              sub={
                penaltiesAccruing.length > 0
                  ? `${penaltiesAccruing.length} with penalties`
                  : undefined
              }
            />
            <KeyMetric
              label="Financial Health"
              value={`${deal.financialHealthScore}%`}
              alert={deal.financialHealthScore < 60}
            />
          </div>

          {/* ========== PARTNER VIEW: Sections 1 & 2 ========== */}

          {/* 1. Financial Obligations */}
          <Section
            title="1 — Financial Obligations"
            badge={
              deal.overduePaymentsCount > 0
                ? `${deal.overduePaymentsCount} OVERDUE`
                : undefined
            }
            partnerView
          >
            {/* Overdue alert banner */}
            {penaltiesAccruing.length > 0 && (
              <div className="mb-4 rounded-lg bg-red-900/30 border border-red-700/50 px-4 py-3">
                <div className="text-sm font-bold text-red-300 mb-1">
                  ⚠ Active Penalties Accruing
                </div>
                {penaltiesAccruing.map((p) => (
                  <div key={p.id} className="text-xs text-red-300/80">
                    {p.description}: ${(p.amount / 1e6).toFixed(2)}M overdue —{" "}
                    <span className="font-bold">
                      {((p.penaltyRate || 0) * 100).toFixed(2)}%/day
                    </span>{" "}
                    penalty accruing since {p.dueDate}
                  </div>
                ))}
              </div>
            )}
            <PaymentTimeline payments={deal.payments} />
          </Section>

          {/* 2. Administrative Burden */}
          <Section
            title="2 — Administrative Burden"
            badge={
              deal.overdueAdminCount > 0
                ? `${deal.overdueAdminCount} OVERDUE`
                : undefined
            }
            partnerView
          >
            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-[#0d2233] px-3 py-2">
                <div className="text-[10px] text-[#c1ddfa] opacity-50">
                  Total Obligations
                </div>
                <div className="text-lg font-bold text-white">
                  {deal.adminObligations.length}
                </div>
              </div>
              <div className="rounded-lg bg-[#0d2233] px-3 py-2">
                <div className="text-[10px] text-[#c1ddfa] opacity-50">
                  Physical Presence Required
                </div>
                <div className="text-lg font-bold text-[#98802e]">
                  {physicalPresenceCount}
                </div>
              </div>
              <div className="rounded-lg bg-[#0d2233] px-3 py-2">
                <div className="text-[10px] text-[#c1ddfa] opacity-50">
                  Burden Score
                </div>
                <div
                  className={`text-lg font-bold ${
                    deal.adminBurdenScore > 70
                      ? "text-red-400"
                      : deal.adminBurdenScore > 50
                      ? "text-[#98802e]"
                      : "text-green-400"
                  }`}
                >
                  {deal.adminBurdenScore}/100
                </div>
              </div>
            </div>
            <AdminCalendar obligations={deal.adminObligations} />
          </Section>

          {/* ========== TEAM VIEW: Sections 3 & 4 ========== */}

          <div className="border-t border-[#1f506a]/20 pt-6">
            <div className="text-[10px] uppercase tracking-widest text-[#c1ddfa] opacity-30 mb-4">
              Team Reference — Governance & Structure
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3. Governance */}
              <Section title="3 — Governance Rights">
                <GovernanceMatrix rights={deal.governanceRights} />
              </Section>

              {/* 4. SPV & Ownership Chain */}
              <Section title="4 — SPV & Ownership Chain">
                <SPVChain nodes={deal.spvChain} />
              </Section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
