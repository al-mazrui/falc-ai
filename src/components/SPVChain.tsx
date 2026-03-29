"use client";

import { SPVNode } from "@/lib/data";

const typeColors: Record<string, string> = {
  fund: "#98802e",
  holdco: "#1f506a",
  spv: "#2a6a8a",
  target: "#143449",
};

const typeBorders: Record<string, string> = {
  fund: "#98802e",
  holdco: "#c1ddfa",
  spv: "#c1ddfa",
  target: "#98802e",
};

export default function SPVChain({ nodes }: { nodes: SPVNode[] }) {
  // Build top-down ordering
  const ordered: SPVNode[] = [];
  const root = nodes.find((n) => !n.parentId);
  if (!root) return null;

  function walk(id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    ordered.push(node);
    nodes.filter((n) => n.parentId === id).forEach((child) => walk(child.id));
  }
  walk(root.id);

  return (
    <div className="flex flex-col items-center gap-1">
      {ordered.map((node, i) => (
        <div key={node.id} className="flex flex-col items-center">
          {i > 0 && (
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-5 bg-[#c1ddfa] opacity-40" />
              <div className="text-[10px] text-[#c1ddfa] opacity-60 -my-1">
                {node.ownershipPct}%
              </div>
              <div className="w-0.5 h-5 bg-[#c1ddfa] opacity-40" />
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#c1ddfa] opacity-40" />
            </div>
          )}
          <div
            className="rounded-lg px-5 py-3 text-center border-2 min-w-[240px]"
            style={{
              background: typeColors[node.type],
              borderColor: typeBorders[node.type],
            }}
          >
            <div className="text-sm font-bold text-white">{node.name}</div>
            <div className="text-xs text-[#c1ddfa] mt-0.5">
              {node.jurisdiction} •{" "}
              {node.type === "fund"
                ? "Fund"
                : node.type === "holdco"
                ? "Holding Co"
                : node.type === "spv"
                ? "SPV"
                : "Target"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
