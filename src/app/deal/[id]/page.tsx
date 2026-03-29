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
    <div className="bg-white rounded-xl border border-[#E8E5DF] overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#E8E5DF]">
        <h2 className="text-base font-bold text-[#143449]">{title}</h2>
        <div className="flex items-center gap-2">
          {partnerView && (
            <span className="text-[9px] bg-[#98802e] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Partner View
            </span>
          )}
          {badge && (
            <span className="text-[10px] bg-[#C4434A] text-white px-2 py-0.5 rounded font-bold">
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
  gold,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
  gold?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl px-4 py-3 border border-[#E8E5DF]">
      <div className="text-[10px] text-[#9CA3AF]">{label}</div>
      <div
        className={`text-xl font-bold mt-0.5 ${
          alert
            ? "text-[#C4434A]"
            : gold
            ? "text-[#98802e]"
            : "text-[#143449]"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-[#9CA3AF] mt-0.5">{sub}</div>
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
      <div className="flex min-h-screen bg-[#F8F7F4]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[#6B7280] text-lg">Deal not found.</div>
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

  const healthColor =
    deal.financialHealthScore >= 75
      ? "#2D8659"
      : deal.financialHealthScore >= 50
      ? "#D4952A"
      : "#C4434A";

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <div className="border-b border-[#E8E5DF] px-8 py-6 bg-white">
          <Link
            href="/"
            className="text-xs text-[#9CA3AF] hover:text-[#98802e] transition-colors"
          >
            ← Back to Portfolio
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#143449]">
                {deal.targetCompany}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {deal.sector} · {deal.country} · Since{" "}
                {new Date(deal.dealDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {deal.instrumentDescription}
              </p>
            </div>
            {/* Large health ring */}
            <div className="relative w-16 h-16 shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16">
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="#E8E5DF"
                  strokeWidth="2.5"
                />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke={healthColor}
                  strokeWidth="2.5"
                  strokeDasharray={`${deal.financialHealthScore * 0.942} 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                style={{ color: healthColor }}
              >
                {deal.financialHealthScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KeyMetric
              label="Total Investment"
              value={`$${(deal.totalInvestment / 1e6).toFixed(0)}M`}
              gold
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
              label="Admin Burden"
              value={`${deal.adminBurdenScore}/100`}
              alert={deal.adminBurdenScore > 70}
            />
          </div>

          {/* ========== PARTNER VIEW ========== */}

          {/* Overdue alert banner */}
          {penaltiesAccruing.length > 0 && (
            <div className="rounded-xl bg-[#FDF0F0] border border-[#C4434A]/20 px-6 py-4">
              <div className="text-sm font-bold text-[#C4434A] mb-2">
                Active Penalties Accruing
              </div>
              {penaltiesAccruing.map((p) => (
                <div key={p.id} className="text-xs text-[#C4434A]/80 mb-1">
                  <span className="font-bold">{p.description}:</span>{" "}
                  ${(p.amount / 1e6).toFixed(2)}M overdue —{" "}
                  <span className="font-bold">
                    {((p.penaltyRate || 0) * 100).toFixed(2)}%/day
                  </span>{" "}
                  penalty since {p.dueDate}
                </div>
              ))}
            </div>
          )}

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
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#F8F7F4] rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#143449]">
                  {deal.adminObligations.length}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">
                  Total Obligations
                </div>
              </div>
              <div className="bg-[#FEF6E8] rounded-lg px-4 py-3 text-center">
                <div className="text-2xl font-bold text-[#D4952A]">
                  {physicalPresenceCount}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">
                  Physical Presence
                </div>
              </div>
              <div
                className="rounded-lg px-4 py-3 text-center"
                style={{
                  backgroundColor:
                    deal.adminBurdenScore > 70 ? "#FDF0F0" : "#E8F5EE",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{
                    color:
                      deal.adminBurdenScore > 70
                        ? "#C4434A"
                        : deal.adminBurdenScore > 50
                        ? "#D4952A"
                        : "#2D8659",
                  }}
                >
                  {deal.adminBurdenScore}
                </div>
                <div className="text-[10px] text-[#9CA3AF]">Burden Score</div>
              </div>
            </div>
            <AdminCalendar obligations={deal.adminObligations} />
          </Section>

          {/* ========== TEAM VIEW ========== */}
          <div className="border-t border-[#E8E5DF] pt-6">
            <div className="text-[10px] uppercase tracking-widest text-[#9CA3AF] mb-4">
              Team Reference — Governance & Structure
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Section title="3 — Governance Rights">
                <GovernanceMatrix rights={deal.governanceRights} />
              </Section>

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
