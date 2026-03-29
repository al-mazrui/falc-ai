"use client";

import { GovernanceRight } from "@/lib/data";

const organConfig: Record<
  string,
  { bg: string; border: string; label: string; accent: string }
> = {
  board: {
    bg: "#F0F4F8",
    border: "#143449",
    label: "Board",
    accent: "#143449",
  },
  shareholders: {
    bg: "#F8F6EF",
    border: "#98802e",
    label: "Shareholders",
    accent: "#98802e",
  },
  executive: {
    bg: "#F1F5F9",
    border: "#4A7FB5",
    label: "Executive",
    accent: "#4A7FB5",
  },
};

export default function GovernanceMatrix({
  rights,
}: {
  rights: GovernanceRight[];
}) {
  const grouped = {
    board: rights.filter((r) => r.organ === "board"),
    shareholders: rights.filter((r) => r.organ === "shareholders"),
    executive: rights.filter((r) => r.organ === "executive"),
  };

  return (
    <div className="space-y-4">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((organ) => {
        const cfg = organConfig[organ];
        return (
          <div
            key={organ}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: `${cfg.border}30` }}
          >
            <div
              className="px-4 py-2 text-sm font-bold border-b"
              style={{
                backgroundColor: cfg.bg,
                borderColor: `${cfg.border}30`,
                color: cfg.accent,
              }}
            >
              {cfg.label}
            </div>
            <div className="divide-y divide-[#E8E5DF]">
              {grouped[organ].map((right) => (
                <div
                  key={right.id}
                  className="px-4 py-3 flex items-start gap-3 bg-white"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#2D2D2D]">
                        {right.matter}
                      </span>
                      {right.vetoRight && (
                        <span className="text-[9px] bg-[#98802e] text-white px-1.5 py-0.5 rounded font-bold">
                          VETO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      {right.description}
                    </div>
                  </div>
                  {right.threshold && (
                    <span className="shrink-0 text-[10px] text-[#143449] bg-[#F0F4F8] px-2 py-1 rounded border border-[#E8E5DF] font-bold">
                      {right.threshold}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
