"use client";

import { Payment } from "@/lib/data";

const STATUS = {
  paid: { color: "#2D8659", bg: "#E8F5EE", label: "PAID" },
  upcoming: { color: "#94A3B8", bg: "#F1F5F9", label: "UPCOMING" },
  overdue: { color: "#C4434A", bg: "#FDF0F0", label: "OVERDUE" },
  partial: { color: "#D4952A", bg: "#FEF6E8", label: "PARTIAL" },
};

export default function PaymentTimeline({ payments }: { payments: Payment[] }) {
  const sorted = [...payments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const today = new Date("2026-03-29");

  // Find time range for the visual timeline
  const dates = sorted.map((p) => new Date(p.dueDate).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const range = maxDate - minDate || 1;
  const todayPct =
    ((today.getTime() - minDate) / range) * 100;

  return (
    <div className="space-y-6">
      {/* Visual timeline strip */}
      <div className="relative">
        {/* Track */}
        <div className="h-16 bg-[#F1F0ED] rounded-xl relative overflow-visible">
          {/* Today marker */}
          {todayPct >= 0 && todayPct <= 100 && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#143449] z-20"
              style={{ left: `${todayPct}%` }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#143449] bg-[#F8F7F4] px-1.5 py-0.5 rounded border border-[#143449]/20 whitespace-nowrap">
                TODAY
              </div>
            </div>
          )}

          {/* Payment dots */}
          {sorted.map((p, i) => {
            const pct =
              ((new Date(p.dueDate).getTime() - minDate) / range) * 100;
            const st = STATUS[p.status];
            const size = Math.max(16, Math.min(36, p.amount / 5e6 + 12));

            return (
              <div
                key={p.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 group"
                style={{ left: `${Math.max(2, Math.min(98, pct))}%` }}
              >
                <div
                  className="rounded-full border-2 border-white flex items-center justify-center shadow-sm cursor-default"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: st.color,
                  }}
                />
                {/* Hover tooltip */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-[#E8E5DF] rounded-lg px-3 py-2 shadow-lg z-30 whitespace-nowrap">
                  <div className="text-xs font-bold text-[#2D2D2D]">
                    {p.description}
                  </div>
                  <div className="text-[10px] text-[#6B7280]">
                    ${(p.amount / 1e6).toFixed(2)}M · {p.dueDate}
                  </div>
                  {p.penaltyRate && p.status === "overdue" && (
                    <div className="text-[10px] text-[#C4434A] font-bold">
                      {(p.penaltyRate * 100).toFixed(2)}%/day penalty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[10px] text-[#6B7280]">
          {Object.entries(STATUS).map(([key, st]) => (
            <div key={key} className="flex items-center gap-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: st.color }}
              />
              {st.label}
            </div>
          ))}
          <div className="ml-auto text-[#9CA3AF]">
            Dot size = payment amount
          </div>
        </div>
      </div>

      {/* Detail cards grouped by status */}
      <div className="space-y-2">
        {/* Overdue first (critical) */}
        {sorted
          .filter((p) => p.status === "overdue")
          .map((p) => (
            <PaymentCard key={p.id} payment={p} />
          ))}
        {/* Then upcoming */}
        {sorted
          .filter((p) => p.status === "upcoming" || p.status === "partial")
          .map((p) => (
            <PaymentCard key={p.id} payment={p} />
          ))}
        {/* Paid last (collapsed feel) */}
        {sorted
          .filter((p) => p.status === "paid")
          .map((p) => (
            <PaymentCard key={p.id} payment={p} />
          ))}
      </div>
    </div>
  );
}

function PaymentCard({ payment: p }: { payment: Payment }) {
  const st = STATUS[p.status];

  return (
    <div
      className="flex items-center gap-4 rounded-lg px-4 py-3 border"
      style={{
        borderColor: `${st.color}30`,
        backgroundColor: st.bg,
      }}
    >
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: st.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-[#2D2D2D] font-bold truncate">
            {p.description}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0"
            style={{ backgroundColor: st.color, color: "#fff" }}
          >
            {st.label}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-xs text-[#6B7280]">
          <span className="font-bold text-[#143449]">
            ${(p.amount / 1e6).toFixed(2)}M
          </span>
          <span>Due: {p.dueDate}</span>
          {p.paidDate && <span>Paid: {p.paidDate}</span>}
          {p.penaltyRate && p.status === "overdue" && (
            <span className="text-[#C4434A] font-bold">
              {(p.penaltyRate * 100).toFixed(2)}%/day penalty accruing
            </span>
          )}
        </div>
        {p.notes && (
          <div className="text-xs text-[#C4434A] mt-1 font-bold">
            {p.notes}
          </div>
        )}
      </div>
    </div>
  );
}
