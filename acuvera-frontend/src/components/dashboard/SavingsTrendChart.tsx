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
import { savingsTrendData } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export function SavingsTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Protected</CardTitle>
        <CardDescription>Monthly savings verified by Acuvera</CardDescription>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={savingsTrendData} margin={{ left: -10, right: 12 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderRadius: "12px",
                borderColor: "hsl(var(--border))",
              }}
              formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Savings"]}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="hsl(var(--chart-2))"
              fill="url(#savingsGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
