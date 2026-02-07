"use client";

import { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  trend: number;
  icon: ReactNode;
  invertTrend?: boolean;
}

export function KPICard({ title, value, trend, icon, invertTrend }: KPICardProps) {
  const trendDirection =
    trend === 0
      ? "neutral"
      : invertTrend
        ? trend < 0
          ? "up"
          : "down"
        : trend > 0
          ? "up"
          : "down";
  const trendLabel = `${trend > 0 ? "+" : ""}${trend.toFixed(1)}%`;
  const TrendIcon =
    trendDirection === "neutral" ? Minus : trendDirection === "up" ? ArrowUpRight : ArrowDownRight;
  const trendClass =
    trendDirection === "up"
      ? "trend-up"
      : trendDirection === "down"
        ? "trend-down"
        : "trend-neutral";

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <TrendIcon size={16} className={cn(trendClass)} />
        <span
          className={cn(
            trendClass
          )}
        >
          {trendLabel}
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
}
