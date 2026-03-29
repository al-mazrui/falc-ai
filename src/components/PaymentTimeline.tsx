"use client";

import { Payment } from "@/lib/data";

const statusColors: Record<string, string> = {
  paid: "#2d6a4f",
  upcoming: "#1f506a",
  overdue: "#c1292e",
  partial: "#d4740e",
};

const statusLabels: Record<string, string> = {
  paid: "PAID",
  upcoming: "UPCOMING",
  overdue: "OVERDUE",
  partial: "PARTIAL",
};

export default function PaymentTimeline({ payments }: { payments: Payment[] }) {
  const sorted = [...payments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="space-y-2">
      {sorted.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-3 rounded-lg px-4 py-3 border-l-4"
          style={{
            borderColor: statusColors[p.status],
            background: `${statusColors[p.status]}15`,
          }}
        >
          <div
            className="shrink-0 w-2.5 h-2.5 rounded-full"
            style={{ background: statusColors[p.status] }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-white truncate font-bold">
                {p.description}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  background: statusColors[p.status],
                  color: "#fff",
                }}
              >
                {statusLabels[p.status]}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-[#c1ddfa]">
              <span className="font-bold text-white">
                ${(p.amount / 1e6).toFixed(2)}M
              </span>
              <span>Due: {p.dueDate}</span>
              {p.paidDate && <span>Paid: {p.paidDate}</span>}
              {p.penaltyRate && p.status === "overdue" && (
                <span className="text-red-400 font-bold">
                  ⚠ {p.penaltyRate * 100}%/day penalty
                </span>
              )}
            </div>
            {p.notes && (
              <div className="text-xs text-red-400 mt-1 font-bold">{p.notes}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
