import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "success" | "warning" | "destructive" | "neutral";
};

const variants = {
  success: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  destructive: "bg-destructive/10 text-destructive border-destructive/30",
  neutral: "bg-muted text-foreground border-border",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
