"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Deal } from "@/lib/data";

export function PaymentStatusChart({ deals }: { deals: Deal[] }) {
  const data = deals
    .map((d) => ({
      name:
        d.targetCompany.length > 18
          ? d.targetCompany.slice(0, 16) + "…"
          : d.targetCompany,
      Paid:
        d.payments
          .filter((p) => p.status === "paid")
          .reduce((s, p) => s + p.amount, 0) / 1e6,
      Outstanding:
        d.payments
          .filter((p) => p.status === "upcoming" || p.status === "partial")
          .reduce((s, p) => s + p.amount, 0) / 1e6,
      Overdue:
        d.payments
          .filter((p) => p.status === "overdue")
          .reduce((s, p) => s + p.amount, 0) / 1e6,
    }))
    .sort((a, b) => b.Overdue - a.Overdue);

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={data}
        margin={{ left: 10, right: 10, top: 10, bottom: 60 }}
      >
        <XAxis
          dataKey="name"
          tick={{ fill: "#6B7280", fontSize: 10 }}
          angle={-45}
          textAnchor="end"
          height={80}
          axisLine={{ stroke: "#E8E5DF" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6B7280", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#FFFFFF",
            border: "1px solid #E8E5DF",
            borderRadius: 8,
            color: "#2D2D2D",
            fontFamily: "Arsenal",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`$${Number(value).toFixed(1)}M`]}
        />
        <Bar dataKey="Paid" stackId="a" fill="#2D8659" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Outstanding" stackId="a" fill="#D4952A" />
        <Bar
          dataKey="Overdue"
          stackId="a"
          fill="#C4434A"
          radius={[3, 3, 0, 0]}
        />
        <Legend
          wrapperStyle={{
            color: "#6B7280",
            fontSize: 12,
            fontFamily: "Arsenal",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HealthBarChart({ deals }: { deals: Deal[] }) {
  const data = [...deals]
    .sort((a, b) => a.financialHealthScore - b.financialHealthScore)
    .map((d) => ({
      name:
        d.targetCompany.length > 20
          ? d.targetCompany.slice(0, 18) + "…"
          : d.targetCompany,
      score: d.financialHealthScore,
    }));

  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 150, right: 20, top: 10, bottom: 10 }}
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: "#6B7280", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#2D2D2D", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={145}
        />
        <Tooltip
          contentStyle={{
            background: "#FFFFFF",
            border: "1px solid #E8E5DF",
            borderRadius: 8,
            color: "#2D2D2D",
            fontFamily: "Arsenal",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => [`${Number(value)}%`, "Health Score"]}
        />
        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.score >= 75
                  ? "#2D8659"
                  : entry.score >= 50
                  ? "#D4952A"
                  : "#C4434A"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
