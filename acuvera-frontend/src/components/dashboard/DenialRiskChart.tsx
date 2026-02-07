"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { denialRiskData } from "@/lib/mockData";

export function DenialRiskChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Denial Risk Trend</CardTitle>
        <CardDescription>Six month rolling denial risk</CardDescription>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={denialRiskData} margin={{ left: -10, right: 12 }}>
            <defs>
              <linearGradient id="denialRiskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[3, 6]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderRadius: "12px",
                borderColor: "hsl(var(--border))",
              }}
              formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, "Risk"]}
            />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="hsl(var(--chart-1))"
              fill="url(#denialRiskGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
