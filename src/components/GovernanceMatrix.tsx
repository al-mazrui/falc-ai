"use client";

import { GovernanceRight } from "@/lib/data";

const organColors: Record<string, string> = {
  board: "#1f506a",
  shareholders: "#143449",
  executive: "#2a6a8a",
};

const organLabels: Record<string, string> = {
  board: "Board",
  shareholders: "Shareholders",
  executive: "Executive",
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
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((organ) => (
        <div key={organ}>
          <div
            className="text-sm font-bold px-3 py-1.5 rounded-t"
            style={{ background: organColors[organ], color: "#c1ddfa" }}
          >
            {organLabels[organ]}
          </div>
          <div className="border border-[#1f506a]/40 rounded-b divide-y divide-[#1f506a]/30">
            {grouped[organ].map((right) => (
              <div
                key={right.id}
                className="px-4 py-2.5 flex items-start gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {right.matter}
                    </span>
                    {right.vetoRight && (
                      <span className="text-[10px] bg-[#98802e] text-white px-1.5 py-0.5 rounded font-bold">
                        VETO
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#c1ddfa] mt-0.5">
                    {right.description}
                  </div>
                </div>
                {right.threshold && (
                  <span className="shrink-0 text-[10px] bg-[#143449] text-[#c1ddfa] px-2 py-1 rounded border border-[#1f506a]/50">
                    {right.threshold}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
