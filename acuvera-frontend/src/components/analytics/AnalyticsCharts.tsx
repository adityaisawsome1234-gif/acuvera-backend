"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { accuracyTrendData, errorTrendsData, savingsTrendData } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsCharts() {
  const [range, setRange] = useState<"30" | "90">("30");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button
          variant={range === "30" ? "default" : "outline"}
          onClick={() => setRange("30")}
        >
          30 Days
        </Button>
        <Button
          variant={range === "90" ? "default" : "outline"}
          onClick={() => setRange("90")}
        >
          90 Days
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Error Trends by Type</CardTitle>
            <CardDescription>Monthly distribution of high-impact errors</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={errorTrendsData} margin={{ left: -10, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    borderRadius: "12px",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duplicate"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="upcoding"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="modifier"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="coverage"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Over Time</CardTitle>
            <CardDescription>Verified savings attributed to Acuvera insights</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsTrendData} margin={{ left: -10, right: 12 }}>
                <defs>
                  <linearGradient id="analyticsSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
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
                  fill="url(#analyticsSavingsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accuracy Improvement</CardTitle>
          <CardDescription>AI detection accuracy over the last 6 months</CardDescription>
        </CardHeader>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={accuracyTrendData} margin={{ left: -10, right: 12 }}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[88, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  borderRadius: "12px",
                  borderColor: "hsl(var(--border))",
                }}
                formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, "Accuracy"]}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(var(--chart-1))"
                fill="url(#accuracyGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
