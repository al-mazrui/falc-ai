"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { deals } from "@/lib/data";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#0a1c2b] border-r border-[#1f506a]/30 flex flex-col h-screen sticky top-0 overflow-hidden">
      {/* Logo */}
      <Link href="/" className="block px-6 pt-6 pb-4 border-b border-[#1f506a]/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#98802e] flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-wide">
              FALC<span className="text-[#98802e]">.AI</span>
            </div>
            <div className="text-[9px] text-[#c1ddfa] opacity-60 -mt-0.5 tracking-widest uppercase">
              Portfolio Intelligence
            </div>
          </div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="px-3 py-4">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
            pathname === "/"
              ? "bg-[#98802e]/20 text-[#98802e] font-bold"
              : "text-[#c1ddfa] hover:bg-[#1f506a]/30"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
          </svg>
          Portfolio Overview
        </Link>
      </nav>

      {/* Deal list */}
      <div className="px-3 mt-1">
        <div className="text-[10px] uppercase tracking-widest text-[#c1ddfa] opacity-40 px-3 mb-2">
          Target Companies
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {deals.map((deal) => {
          const isActive = pathname === `/deal/${deal.id}`;
          const hasOverdue =
            deal.overduePaymentsCount > 0 || deal.overdueAdminCount > 0;
          return (
            <Link
              key={deal.id}
              href={`/deal/${deal.id}`}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs mb-0.5 transition-colors ${
                isActive
                  ? "bg-[#98802e]/20 text-[#98802e] font-bold"
                  : "text-[#c1ddfa] hover:bg-[#1f506a]/30"
              }`}
            >
              {hasOverdue && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              )}
              <span className="truncate">{deal.targetCompany}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-[#1f506a]/30 text-[10px] text-[#c1ddfa] opacity-30">
        Falconer Capital Fund III
      </div>
    </aside>
  );
}
