"use client";

import { AdminObligation } from "@/lib/data";

const typeIcons: Record<string, string> = {
  board_meeting: "🏛",
  filing: "📋",
  regulatory: "⚖",
  tax: "💰",
  reporting: "📊",
  other: "📌",
};

const statusColors: Record<string, string> = {
  completed: "#2d6a4f",
  pending: "#1f506a",
  overdue: "#c1292e",
  upcoming: "#98802e",
};

export default function AdminCalendar({
  obligations,
}: {
  obligations: AdminObligation[];
}) {
  const sorted = [...obligations].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const grouped: Record<string, AdminObligation[]> = {};
  sorted.forEach((ob) => {
    const month = ob.dueDate.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(ob);
  });

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <div className="text-sm font-bold text-[#98802e] mb-2">
            {new Date(month + "-01").toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="space-y-2">
            {items.map((ob) => (
              <div
                key={ob.id}
                className="flex items-start gap-3 rounded-lg px-4 py-3 border-l-4"
                style={{
                  borderColor: statusColors[ob.status],
                  background: `${statusColors[ob.status]}15`,
                }}
              >
                <span className="text-lg mt-0.5">{typeIcons[ob.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-white">
                      {ob.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {ob.requiresPhysicalPresence && (
                        <span className="text-[10px] bg-red-900/40 text-red-300 px-1.5 py-0.5 rounded font-bold">
                          IN-PERSON
                        </span>
                      )}
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                        style={{
                          background: statusColors[ob.status],
                          color: "#fff",
                        }}
                      >
                        {ob.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#c1ddfa] mt-1">
                    {ob.description}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#c1ddfa] opacity-70">
                    <span>📅 {ob.dueDate}</span>
                    <span>📍 {ob.jurisdiction}</span>
                    {ob.recurring && <span>🔄 {ob.frequency}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
