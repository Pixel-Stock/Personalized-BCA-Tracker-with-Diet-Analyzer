'use client'
// src/app/dashboard/DashboardChart.tsx
// Client component island — Recharts line chart for member growth
import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DashboardChartProps {
  data: { month: string; members: number }[]
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#d1d5db" />
        <YAxis tick={{ fontSize: 12 }} stroke="#d1d5db" allowDecimals={false} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(v) => [v, 'New Members']}
        />
        <Area
          type="monotone"
          dataKey="members"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#colorMembers)"
          dot={{ r: 4, fill: '#2563eb' }}
          activeDot={{ r: 6 }}
          name="Members"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
