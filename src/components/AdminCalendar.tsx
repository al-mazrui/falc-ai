"use client";

import { AdminObligation } from "@/lib/data";

const typeLabels: Record<string, string> = {
  board_meeting: "Board",
  filing: "Filing",
  regulatory: "Regulatory",
  tax: "Tax",
  reporting: "Reporting",
  other: "Other",
};

const typeColors: Record<string, string> = {
  board_meeting: "#143449",
  filing: "#4A7FB5",
  regulatory: "#C4434A",
  tax: "#D4952A",
  reporting: "#2D8659",
  other: "#94A3B8",
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "#E8F5EE", text: "#2D8659", label: "Done" },
  pending: { bg: "#F1F5F9", text: "#94A3B8", label: "Pending" },
  overdue: { bg: "#FDF0F0", text: "#C4434A", label: "Overdue" },
  upcoming: { bg: "#FEF6E8", text: "#D4952A", label: "Upcoming" },
};

// Months heatmap: which months are heavy?
function MonthHeatmap({ obligations }: { obligations: AdminObligation[] }) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, "0");
    const items = obligations.filter((o) => o.dueDate.slice(5, 7) === m);
    const overdueCount = items.filter((o) => o.status === "overdue").length;
    const physicalCount = items.filter((o) => o.requiresPhysicalPresence).length;
    return {
      label: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ][i],
      count: items.length,
      overdueCount,
      physicalCount,
    };
  });

  const maxCount = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className="grid grid-cols-12 gap-1.5">
      {months.map((m) => {
        const intensity = m.count / maxCount;
        const hasOverdue = m.overdueCount > 0;
        const bg = hasOverdue
          ? `rgba(196, 67, 74, ${0.15 + intensity * 0.45})`
          : m.count > 0
          ? `rgba(20, 52, 73, ${0.08 + intensity * 0.25})`
          : "#F1F0ED";

        return (
          <div key={m.label} className="text-center">
            <div
              className="rounded-lg py-3 mb-1 relative"
              style={{ backgroundColor: bg }}
            >
              <div
                className="text-lg font-bold"
                style={{
                  color: hasOverdue
                    ? "#C4434A"
                    : m.count > 0
                    ? "#143449"
                    : "#9CA3AF",
                }}
              >
                {m.count}
              </div>
              {m.physicalCount > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4952A]" />
              )}
            </div>
            <div className="text-[10px] text-[#9CA3AF]">{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminCalendar({
  obligations,
}: {
  obligations: AdminObligation[];
}) {
  const sorted = [...obligations].sort((a, b) => {
    // Overdue first, then by date
    if (a.status === "overdue" && b.status !== "overdue") return -1;
    if (b.status === "overdue" && a.status !== "overdue") return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Month heatmap */}
      <div>
        <div className="text-xs text-[#9CA3AF] mb-2 flex items-center gap-3">
          <span>Monthly obligation density · 2026</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#D4952A]" />
            <span>= physical presence</span>
          </span>
        </div>
        <MonthHeatmap obligations={obligations} />
      </div>

      {/* Obligation list */}
      <div className="space-y-1.5">
        {sorted.map((ob) => {
          const st = statusStyles[ob.status];
          const tc = typeColors[ob.type];
          return (
            <div
              key={ob.id}
              className="flex items-center gap-3 rounded-lg px-4 py-3 border border-[#E8E5DF]"
              style={{ backgroundColor: st.bg }}
            >
              {/* Type pill */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0 text-white"
                style={{ backgroundColor: tc }}
              >
                {typeLabels[ob.type]}
              </span>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#2D2D2D] truncate">
                  {ob.title}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  {ob.description.length > 100
                    ? ob.description.slice(0, 97) + "…"
                    : ob.description}
                </div>
              </div>

              <div className="shrink-0 text-right space-y-0.5">
                <div className="text-xs font-bold text-[#2D2D2D]">
                  {ob.dueDate}
                </div>
                <div className="text-[10px] text-[#6B7280]">
                  {ob.jurisdiction}
                </div>
              </div>

              {/* Badges */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: st.text, color: "#fff" }}
                >
                  {st.label}
                </span>
                {ob.requiresPhysicalPresence && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D4952A] text-white">
                    IN-PERSON
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
