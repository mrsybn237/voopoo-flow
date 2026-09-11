"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatRibu(val) {
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return String(val);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-panel-raised border border-line rounded-lg px-3 py-2 text-[12px]">
      <div className="text-muted font-mono mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <b>{formatRibu(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({ data }) {
  return (
    <div className="bg-panel border border-line-soft rounded-[10px] p-5 mt-4 hover:border-line transition-colors">
      <div className="flex items-baseline justify-between mb-4">
        <div className="font-display text-sm font-semibold">Trend Performa (6 Bulan)</div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-dim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ember inline-block" /> Aktual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-vapor inline-block" /> Target
          </span>
        </div>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line-soft)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--color-line)" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatRibu}
              tick={{ fill: "var(--color-muted)", fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="aktual"
              name="Aktual"
              stroke="var(--color-ember)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-ember)" }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="var(--color-vapor)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "var(--color-vapor)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}