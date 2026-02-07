"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { errorsByCategoryData } from "@/lib/mockData";

export function ErrorsByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Errors by Category</CardTitle>
        <CardDescription>Top drivers of claim risk</CardDescription>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={errorsByCategoryData}
            layout="vertical"
            margin={{ left: 20, right: 12 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                borderRadius: "12px",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {errorsByCategoryData.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
