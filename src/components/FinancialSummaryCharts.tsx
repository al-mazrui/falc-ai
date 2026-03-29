"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Deal } from "@/lib/data";

const COLORS = ["#2d6a4f", "#98802e", "#d4740e", "#c1292e", "#1f506a"];

export function PaymentStatusChart({ deals }: { deals: Deal[] }) {
  const data = deals.map((d) => ({
    name:
      d.targetCompany.length > 15
        ? d.targetCompany.slice(0, 13) + "…"
        : d.targetCompany,
    Paid: d.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0) / 1e6,
    Outstanding: d.payments.filter((p) => p.status === "upcoming" || p.status === "partial").reduce((s, p) => s + p.amount, 0) / 1e6,
    Overdue: d.payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0) / 1e6,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 60 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: "#c1ddfa", fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fill: "#c1ddfa", fontSize: 10 }} />
        <Tooltip
          contentStyle={{
            background: "#143449",
            border: "1px solid #1f506a",
            borderRadius: 8,
            color: "#fff",
            fontFamily: "Arsenal",
          }}
          formatter={(value) => [`$${Number(value).toFixed(1)}M`]}
        />
        <Bar dataKey="Paid" stackId="a" fill="#2d6a4f" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Outstanding" stackId="a" fill="#98802e" />
        <Bar dataKey="Overdue" stackId="a" fill="#c1292e" radius={[4, 4, 0, 0]} />
        <Legend wrapperStyle={{ color: "#c1ddfa", fontSize: 12, fontFamily: "Arsenal" }} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SectorAllocationChart({ deals }: { deals: Deal[] }) {
  const sectorMap: Record<string, number> = {};
  deals.forEach((d) => {
    sectorMap[d.sector] = (sectorMap[d.sector] || 0) + d.totalInvestment;
  });
  const data = Object.entries(sectorMap)
    .map(([name, value]) => ({ name, value: value / 1e6 }))
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={110}
          dataKey="value"
          label={({ name, value }) => {
            const n = String(name || "");
            const v = Number(value || 0);
            return `${n.length > 12 ? n.slice(0, 10) + "…" : n}: $${v.toFixed(0)}M`;
          }}
          labelLine={{ stroke: "#c1ddfa", strokeWidth: 0.5 }}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={COLORS[i % COLORS.length]}
              opacity={0.85}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#143449",
            border: "1px solid #1f506a",
            borderRadius: 8,
            color: "#fff",
            fontFamily: "Arsenal",
          }}
          formatter={(value) => [`$${Number(value).toFixed(1)}M`]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
