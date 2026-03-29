"use client";

import { SPVNode } from "@/lib/data";

const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
  fund: { bg: "#98802e", border: "#98802e", text: "#FFFFFF" },
  holdco: { bg: "#FFFFFF", border: "#143449", text: "#143449" },
  spv: { bg: "#FFFFFF", border: "#4A7FB5", text: "#4A7FB5" },
  target: { bg: "#143449", border: "#143449", text: "#FFFFFF" },
};

const typeLabels: Record<string, string> = {
  fund: "Fund",
  holdco: "Holding Co",
  spv: "SPV",
  target: "Target",
};

export default function SPVChain({ nodes }: { nodes: SPVNode[] }) {
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
    <div className="flex flex-col items-center gap-0">
      {ordered.map((node, i) => {
        const st = typeStyles[node.type];
        return (
          <div key={node.id} className="flex flex-col items-center">
            {i > 0 && (
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-4 bg-[#D1CFC9]" />
                <div className="text-[10px] font-bold text-[#98802e] bg-[#F8F6EF] px-2 py-0.5 rounded-full border border-[#E8E5DF]">
                  {node.ownershipPct}%
                </div>
                <div className="w-0.5 h-4 bg-[#D1CFC9]" />
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#D1CFC9]" />
              </div>
            )}
            <div
              className="rounded-xl px-5 py-3 text-center border-2 min-w-[260px] shadow-sm"
              style={{
                backgroundColor: st.bg,
                borderColor: st.border,
              }}
            >
              <div
                className="text-sm font-bold"
                style={{ color: st.text }}
              >
                {node.name}
              </div>
              <div
                className="text-[10px] mt-0.5 opacity-70"
                style={{ color: st.text }}
              >
                {node.jurisdiction} · {typeLabels[node.type]}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
